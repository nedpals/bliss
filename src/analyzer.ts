import Parser from "web-tree-sitter";
import * as fs from "fs";
import { promisify } from "util";

import { Importer } from "./importer";
import { TreeList } from "./trees";
import { filterChildrenByType, TypeMap, Types } from "./types";

export class Analyzer {
    parser!: Parser;
    importer: Importer = new Importer();
    trees: TreeList = new TreeList(this.parser);

    async init(): Promise<void> {
        this.parser = new Parser();
        const parserPath = require.resolve('tree-sitter-v/wasm/tree-sitter-v.wasm');
        const v = await Parser.Language.load(parserPath);
        this.parser.setLanguage(v);
        this.trees = new TreeList(this.parser);
    };

    static async create(): Promise<Analyzer> {
        const an = new Analyzer();
        await an.init();

        return an;
    }

    getTree(filepath: string): Parser.Tree {
        const parsedPath = path.parse(filepath);

        return this.trees[parsedPath.dir][parsedPath.base];
    }

    static getCurrentModule(rootNode: Parser.SyntaxNode): string {
        const module_clause = filterChildrenByType(rootNode, 'module_clause');
        if (typeof module_clause === "undefined") { return 'main'; }
    
        //@ts-ignore
        const module_name = filterChildrenByType(module_clause[0], 'module_identifier')[0].text;
        return module_name;
    }

    async open(filepath: string, source?: string): Promise<void> {
        const _source = typeof source == "undefined" ? await promisify(fs.readFile)(filepath, { encoding: 'utf-8' }) : source;

        try {
            await this.trees.new({ filepath, source: _source });
            await this.importer.getAndResolve(filepath, this);
        } catch(e) {
            console.log(e);
        }
    }

    async update(filepath: string, source: string) {
        // TODO: Update tree function
        // function updateTree(parser: Parser, edit: vscode.TextDocumentChangeEvent) {
        //     if (edit.contentChanges.length == 0) return
        //     const old = trees[edit.document.uri.toString()]
        //     for (const e of edit.contentChanges) {
        //         const startIndex = e.rangeOffset
        //         const oldEndIndex = e.rangeOffset + e.rangeLength
        //         const newEndIndex = e.rangeOffset + e.text.length
        //         const startPos = edit.document.positionAt(startIndex)
        //         const oldEndPos = edit.document.positionAt(oldEndIndex)
        //         const newEndPos = edit.document.positionAt(newEndIndex)
        //         const startPosition = asPoint(startPos)
        //         const oldEndPosition = asPoint(oldEndPos)
        //         const newEndPosition = asPoint(newEndPos)
        //         const delta = {startIndex, oldEndIndex, newEndIndex, startPosition, oldEndPosition, newEndPosition}
        //         old.edit(delta)
        //     }
        //     const t = parser.parse(edit.document.getText(), old) // TODO don't use getText, use Parser.Input
        //     trees[edit.document.uri.toString()] = t
        // }
    }

    async getTypeList(filepath: string, options = { modules: true }): Promise<Types> {
        let generatedTypes: Types = {};

        const tree = this.trees.get(filepath);
        let typemap: TypeMap = new TypeMap(filepath, tree.rootNode);

        if (options.modules) {
            for (let mod of this.importer.depGraph[moduleName].dependencies) {
                // console.log('[getTypeList] Getting type information for module "' + mod + '"...');
                const modFiles = this.importer.depGraph[mod].files;
                
                for (let modFilepath of modFiles) {
                    // console.log('[getTypeList] Getting types on "' + modFilepath + '"...');
                    const modTree = this.trees.get(modFilepath);
                    let modTypemap = new TypeMap(modFilepath, modTree.rootNode);
    
                    generatedTypes = {
                        ...generatedTypes,
                        ...modTypemap.generate()
                    };
                }
            }
        }

        generatedTypes = {
            ...generatedTypes,
            ...typemap.generate()
        };

        return generatedTypes;
    }
}
