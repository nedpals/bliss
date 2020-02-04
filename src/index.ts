import Parser from "web-tree-sitter";

import { Importer } from "./imports";
import { newTree, trees } from "./trees";
import { TypeMap, filterChildrenByType, TypeProperties } from "./types";

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
    
    constructor() {}

    async init(): Promise<void> {
        const v = await Parser.Language.load(__dirname + '/src/tree-sitter-v.wasm');
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
            this.typemap.insertType(tree);
        });
    
        return -1;
    }
}

async function init() {
    let analyzer: Analyzer;

    try {
       await Parser.init();
    } catch(e) {
        //@ts-ignore
        console.log(e);
    } finally {
        analyzer = await Analyzer.create();

        const source = `
        module main

        type Hello string

        struct Person {
            name string
            age string
        }

        /** this is a comment
        * @return something
        */
        pub fn (d Person) hello(name string) {
            print('Hello $name')
        }

        // cant lee
        // canledudebudebu
        // # Hello World!
        fn main() {
            hello := Hello{}
            woo := hello.world('hey')
        }
        `;

        await analyzer.open('Untitled-1', source);
        console.log(analyzer.typemap.getAll());
    }
}

init();