import Parser from "web-tree-sitter";
import glob from "glob";
import { homedir } from "os";
import * as path from "path";
import { promisify } from "util";

import { excludedOSSuffixes, normalizePath } from "./utils";
import { Analyzer } from "./analyzer";
import which from "which";
import slash from "slash";

export type Module = string;

interface DepGraph {
    [module_name: string]: {
        files: Set<string>,
        dependencies: Set<string>
    }
}

export class Importer {
    depGraph: DepGraph = {};

    findModuleName(name: string): string {
        for (const mod in this.depGraph) {
            if (mod.includes(name)) return mod;
        }

        return name;
    }

    static async get(rootNode: Parser.SyntaxNode): Promise<Set<Module>> {
        // Get imported modules
        const modules: Set<Module> = new Set();
    
        for (let i = 0; i < rootNode.namedChildren.length; i++) {
            const child = rootNode.namedChildren[i];
            if (child.type !== 'import_declaration') continue;
            const name = child.namedChildren[0].childForFieldName('path')?.text;
            if (typeof name === "undefined") continue;
            modules.add(name);
        }
    
        if (!modules.has('builtin')) modules.add('builtin');
        return modules;
    }

    static async importModulePaths(additionalPaths: string[] = []): Promise<string[]> {
        const vPath = await which('v');
        const importModulePaths = [
            ...additionalPaths,
            process.cwd(),
            path.join(process.cwd(), 'modules'),
            path.join(path.dirname(vPath), 'vlib'),
            path.join(homedir(), '.vmodules')
        ];

        return importModulePaths
    }

    static async resolveModuleFilepaths(moduleName: Module, excludeOSSuffixes: boolean = true, paths: string[] = []): Promise<string[]> {
        let resolved: string[] = [];
        const _module = moduleName.split('.');
        const importModulePaths = await Importer.importModulePaths();

        for (let i = 0; i < importModulePaths.length; i++) {
            const p = slash(importModulePaths[i]);
            const excludedFiles = (() => {
                const prefixes = ['*_test', '*_js'];
                if (excludeOSSuffixes) prefixes.push(...excludedOSSuffixes.map(o => '*' + o));
                
                return `!(${prefixes.join('|')}).v`
            })();
        
            const matchedPaths = await promisify(glob)(path.join(p, ..._module, excludedFiles));
            if (matchedPaths.length >= 1) resolved = matchedPaths;
            if (resolved.length !== 0) break;
        }

        // if (resolved.length === 0) {
        //     throw new Error(`[resolveModuleFilepaths] Module '${moduleName}' was not found.`);
        // }

        return resolved;
    }

    static async resolveFromFilepath(filepath: string, excludeOSSuffixes: boolean = true): Promise<string[]> {
        let resolved: string[] = [];
        let fp = normalizePath(filepath);
        const base = path.dirname(fp);
        const excludedFiles = (() => {
            const prefixes = ['*_test', '*_js', path.basename(fp, '.v')];
            if (excludeOSSuffixes) prefixes.push(...excludedOSSuffixes.map(o => '*' + o));

            return `!(${prefixes.join('|')}).v`
        })();

        const modulePath = path.join(base, excludedFiles);
        const matchedPaths = await promisify(glob)(modulePath);

        if (matchedPaths.length >= 1) {
            resolved = matchedPaths;
        }

        // if (resolved.length === 0) {
        //     throw new Error(`[resolveFromFilepath] Directory '${base}' has no V files.`);
        // }

        return resolved;
    }

    async import(modules: Set<Module>, analyzer: Analyzer, paths: string[] = []): Promise<void> { 
        for (let m of modules.values()) {
            if (typeof this.depGraph[m] !== "undefined") continue;

            const resolvedPaths = await (async () => {
                const unique = [];
                try {
                    const filepaths = await Importer.resolveModuleFilepaths(m, true, paths);
                    if (filepaths.length == 0) return unique;
                    for (const file of filepaths) {
                        if (analyzer.trees.has(file)) continue;
                        unique.push(analyzer.open(file));
                    }    
                } catch(e) {
                    console.error(e);
                }
                
                return unique;
            })();
            
            if (resolvedPaths.length === 0) continue;
            await Promise.all(resolvedPaths);
        }
    }

    static async getOtherFiles(filepath: string, analyzer: Analyzer): Promise<string[]> {
        const relatedFiles = await Importer.resolveFromFilepath(filepath);
        const toBeResolved = new Map();

        for (let i = 0; i < relatedFiles.length; i++) {
            if (analyzer.trees.has(relatedFiles[i])) continue;
            toBeResolved.set(relatedFiles[i], analyzer.open(relatedFiles[i]));
        }

        await Promise.all(toBeResolved.values());
        return Array.from(toBeResolved.keys());
    }

    async getAndResolve(filepath: string, analyzer: Analyzer): Promise<void> {
        const fp = normalizePath(filepath);
        const tree = analyzer.trees.get(fp);
        const rootNode = tree.rootNode;
        const currentModuleName = await analyzer.getFullModuleName(fp);
        if (typeof this.depGraph[currentModuleName] !== "undefined" && this.depGraph[currentModuleName].files.has(fp)) return;

        const resolvedModules = await Importer.get(rootNode);
        if (typeof this.depGraph[currentModuleName] === "undefined") {
            this.depGraph[currentModuleName] = { files: new Set(), dependencies: new Set() };    
        }

        this.depGraph[currentModuleName].files.add(fp);
        
        for (const mod of resolvedModules.values()) {
            if (this.depGraph[currentModuleName].dependencies.has(mod)) continue;
            this.depGraph[currentModuleName].dependencies.add(mod);
        }

        // Start importing process. (For modules only)
        await Importer.getOtherFiles(fp, analyzer);
        await this.import(resolvedModules, analyzer, [path.dirname(filepath), path.dirname(path.dirname(filepath))]);
    }
}