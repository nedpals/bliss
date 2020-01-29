import Parser from "web-tree-sitter";
import glob from "glob";
import { homedir, type } from "os";
import * as path from "path";
import { promisify } from "util";

import { exc_os_suffix } from "./utils";
import { newTree } from "./trees";
import { declare } from "./types";

export type Module = string;
export const cached_trees: { [key: string]: Parser.Tree } = {};

export async function getImports(rootNode: Parser.SyntaxNode): Promise<Module[]> {
    const modules: Module[] = [];
    // const 

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

export async function resolveImports(modules: Module[], parser: Parser): Promise<{ name: string, files: string[] }[]> {
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
            const mods = await getImports(cached_trees[p].rootNode);
            const resolved = await resolveImports(mods, parser);
            const resolved_modnames = resolved_modules.map(r => r.name);
            
            for (let c of cached_trees[p].rootNode.children) {
                if (c.type.length <= 1) { continue; }
                declare(c);
            }

            resolved_modules = resolved_modules.concat(resolved.filter(r => !resolved_modnames.includes(r.name)));
        }
    }

    return resolved_modules;
}

export default async function getAndResolveImports(rootNode: Parser.SyntaxNode, parser: Parser): Promise<{ name: string, files: string[] }[]> {
    const mods = await getImports(rootNode);

    return await resolveImports(mods, parser);
}