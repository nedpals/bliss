import Parser from "web-tree-sitter";
import * as path from "path";

import { Importer } from "./imports";
import { newTree, trees } from "./trees";
import { TypeMap, filterChildrenByType, TypeProperties } from "./types";
import { SymbolKind } from "./symbols";

interface IAnalyzer {
    filename: string,
    name: string,
    modules: string[]
}

interface AnalyzedFiles {
    [paths: string]: IAnalyzer
}

export class Analyzer {
    parser: Parser = new Parser;
    typemap: TypeMap = new TypeMap('');
    files: AnalyzedFiles = {};
    trees: { [path: string]: Parser.Tree } = {};
    importer: Importer = new Importer(this);

    async init(): Promise<void> {
        const v = await Parser.Language.load(path.join(__dirname, '..', '/src/tree-sitter-v.wasm'));
        this.parser.setLanguage(v);
    };

    static async create(): Promise<Analyzer> {
        const an = new Analyzer();
        await an.init();

        return an;
    }

    static getCurrentModule(node: Parser.SyntaxNode): string {
        const module_clause = filterChildrenByType(node, 'module_clause');
        if (typeof module_clause === "undefined") { return 'main'; }
    
        //@ts-ignore
        const module_name = filterChildrenByType(module_clause[0], 'module_identifier')[0].text;
        return module_name;
    }

    async open(filename: string, source: string): Promise<number> {
        await newTree({ filepath: filename, source }, this.parser);
        await this.importer.getAndResolve(trees[filename].rootNode, this.parser);
    
        Object.keys(trees).forEach(p => {
            const tree = trees[p].rootNode;
            const moduleName = Analyzer.getCurrentModule(tree);
            this.typemap.setModuleName(moduleName);
            this.typemap.insertTypeFromTree(tree);
        });
    
        return -1;
    }

    async generateSymbols(filename: string): Promise<{[x: string]: any}[]> {
        const tree = trees[filename].rootNode;
        const typemap = new TypeMap(Analyzer.getCurrentModule(tree));
        
        typemap.insertTypeFromTree(tree);

        return Object.keys(typemap.getAll()).map(id => {
            const type: TypeProperties = typemap.get(id);

            return {
                name: id,
                detail: type.signature,
                kind: SymbolKind.Variable,
                range: { 
                    start: { line: type.range.start[0], character: type.range.start[1] },
                    end: { line: type.range.end[0], character: type.range.end[1] },
                },
                selectionRange: { 
                    start: { line: type.range.start[0], character: type.range.start[1] },
                    end: { line: type.range.end[0], character: type.range.end[1] },
                }
            }
        });
    }
}
