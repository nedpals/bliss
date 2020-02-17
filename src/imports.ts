import Parser from "web-tree-sitter";
import glob from "glob";
import { homedir } from "os";
import * as path from "path";
import { promisify } from "util";

import { exc_os_suffix } from "./utils";
import { newTree } from "./trees";
import { Analyzer } from "./analyzer";

export type Module = string;
export const cached_trees: { [key: string]: Parser.Tree } = {};

export class Importer {
    analyzer: Analyzer;

    constructor(analyzer: Analyzer) {
        this.analyzer = analyzer;
    }

    static async get(rootNode: Parser.SyntaxNode): Promise<Module[]> {
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

    async resolve(modules: Module[], parser: Parser): Promise<{ name: string, files: string[] }[]> {
        let resolved_modules: { name: string, files: string[] }[] = [];
        let resolved_imports_filepaths: { [x: string]: string[] } = {};
    
        const paths = [
            String.raw`C:\Users\admin\Documents\Coding\v\vlib`,
            __dirname,
            path.join(__dirname, 'modules'),
            path.join(homedir(), '.vmodules')
        ]
    
        for (let m of modules) {
            const mod = m.replace('.', '\\');
            let found;
    
            for (let p of paths) {
                if (typeof found !== "undefined") { break; }
                const modpath = path.join(p, `@(${mod})`, `!(*_test|${exc_os_suffix.map(o => '*' + o).join('|')}).v`);
    
                const matches = await promisify(glob)(modpath);
                if (matches.length >= 1) { 
                    found = matches;
                    if (Object.keys(resolved_imports_filepaths).indexOf(mod) !== -1) {
                        continue;
                    }
                    resolved_imports_filepaths[mod] = found;
                    resolved_modules.push({ name: mod, files: found });
                }
            }
    
            if (typeof found === "undefined") { console.log(`Module ${mod}: not found.`) }
        }
    
        for (let modfiles of Object.keys(resolved_imports_filepaths)) {
            for (let p of resolved_imports_filepaths[modfiles]) {
                if (Object.keys(cached_trees).indexOf(p) !== -1) {
                    continue;
                }
                await newTree({ filepath: p, tree: cached_trees }, parser);
                
                const mods = await Importer.get(cached_trees[p].rootNode);
                const resolved = await this.resolve(mods, parser);
                const resolved_modnames = resolved_modules.map(r => r.name);
                const moduleName = Analyzer.getCurrentModule(cached_trees[p].rootNode);
                this.analyzer.typemap.setModuleName(moduleName);
                await this.analyzer.typemap.insertTypeFromTree(cached_trees[p].rootNode);
    
                resolved_modules = resolved_modules.concat(resolved.filter(r => !resolved_modnames.includes(r.name)));
            }
        }
    
        return resolved_modules;
    }

    async getAndResolve(rootNode: Parser.SyntaxNode, parser: Parser): Promise<{ name: string, files: string[] }[]> {
        const mods = await Importer.get(rootNode);
        return await this.resolve(mods, parser);
    }
}