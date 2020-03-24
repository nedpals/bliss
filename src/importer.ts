import Parser from "web-tree-sitter";
import glob from "glob";
import { homedir } from "os";
import * as path from "path";
import { promisify } from "util";

import { excludedOSSuffixes } from "./utils";
import { newTree, trees } from "./trees";
import { Analyzer } from "./analyzer";

export type Module = string;
export const cached_trees: { [key: string]: Parser.Tree } = {};

interface DepGraph {
    [module_name: string]: {
        files: string[],
        dependencies: Module[]
    }
}

export class Importer {
    depGraph: DepGraph = {};

    static async get(rootNode: Parser.SyntaxNode): Promise<Module[]> {
        // Get imported modules
        const modules: Module[] = [];
    
        rootNode.namedChildren.filter(x => {
            return x.type == 'import_declaration';
        }).forEach(x => {
            const name = x.namedChildren[0].childForFieldName('path')?.text;
            
            if (typeof name !== "undefined") {
                modules.push(name);
            }
        });
    
        if (modules.indexOf('builtin') === -1) {
            modules.push('builtin');
        }
    
        return modules;
    }

    static async resolveModulePath(moduleName: Module, excludeOSSuffixes: boolean = true): Promise<string[]> {
        let resolved: string[] = [];
        const _module = moduleName.replace('.', '\\');
        const importModulePaths = [
            String.raw`C:\Users\admin\Documents\Coding\v\vlib`,
            process.cwd(),
            path.join(process.cwd(), 'modules'),
            path.join(homedir(), '.vmodules')
        ];

        for (let p of importModulePaths) {
            if (resolved.length != 0) { break; }
            // console.log('[resolveModulePath] Checking from ' + p);

            let excludedFiles = `!(*_test|*_js|${excludedOSSuffixes.map(o => '*' + o).join('|')}).v`;

            if (!excludeOSSuffixes) {
                excludedFiles = `!(*_test|*_js).v`;
            }

            const modulePath = path.join(p, `@(${_module})`, excludedFiles);
            const matchedPaths = await promisify(glob)(modulePath);

            if (matchedPaths.length >= 1) {
                resolved = matchedPaths;
            }
        }

        return resolved;
    }

    async import(modules: Module[], analyzer: Analyzer): Promise<void> {    
        for (let m of modules) {
            
            console.log('[import] Importing module ' + m + '...');

            // Skip if it already present.
            if (typeof this.depGraph[m] !== "undefined") { 
                continue;
            }

            // Import and resolve all modules
            let resolvedPaths = await Importer.resolveModulePath(m);

            // Stop here if there are no modules found.
            if (resolvedPaths.length == 0) { 
                
                console.log(`[import] Module ${m}: not found.`);
                continue;
            }

            // Use `analyzer.open` for resolving dependencies.
            for (let file of resolvedPaths) {
                
                console.log('[import] Opening file ' + file);
                
                if (typeof this.depGraph[m] == "undefined" || this.depGraph[m].files.indexOf(file) == -1) {
                    await analyzer.open(file);
                }
            }
        }
    }

    async getAndResolve(filepath: string, analyzer: Analyzer): Promise<void> {
        // Parsed path
        const parsedPath = path.parse(filepath);

        // Get the tree
        const tree = analyzer.trees[parsedPath.dir][parsedPath.base];

        // Get the root node of the tree.
        const rootNode = tree.rootNode;

        // Get the imported module names.
        const resolvedModules = await Importer.get(rootNode);

        // Construct dependency graph for current filepath.
        const currentModuleName = Analyzer.getCurrentModule(rootNode);

        // Add to dep graph if not present.
        if (Object.keys(this.depGraph).indexOf(currentModuleName) == -1) {
            this.depGraph[currentModuleName] = {
                files: [filepath],
                dependencies: resolvedModules
            }    
        } else {
        // ...or else just put it inside an existing one.
            if (this.depGraph[currentModuleName].files.indexOf(filepath) == -1) {
                this.depGraph[currentModuleName].files.push(filepath);
            }
            
            // Important! Dependencies must not have duplicated entries.
            resolvedModules.forEach(mod => {
                if (this.depGraph[currentModuleName].dependencies?.indexOf(mod) == -1) {
                    this.depGraph[currentModuleName].dependencies?.push(mod);
                }
            });
        }

        // Start importing process.
        await this.import(resolvedModules, analyzer);
    }
}