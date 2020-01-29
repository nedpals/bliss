import Parser from "web-tree-sitter";

import getAndResolveImports from "./imports";
import { newTree, trees } from "./trees";
import { declare, typesmap, getCurrentModule, insertTypes, TypeMap } from "./types";

interface Analyzer {
    typesmap: TypeMap,
    files: AnalyzedFiles,
    trees: { [path: string]: Parser.Tree }
}

interface IAnalyzer {
    filename: string,
    name: string,
    modules: string[]
}

interface AnalyzedFiles {
    [paths: string]: IAnalyzer
}

async function init() {
    // Initialize parser
    await Parser.init();

    const parser = new Parser;
    const v = await Parser.Language.load(__dirname + '/src/tree-sitter-v.wasm');
    parser.setLanguage(v);

    const source = `
    module main

    import log

    type Hello string

    struct Person {
        name string
        age string
    }

    /** this is a comment
    * @return something
    */
    pub fn (d Dog) hello(name string) {
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

    await newTree({ filepath: 'Untitled-1', source }, parser);
    await getAndResolveImports(trees['Untitled-1'].rootNode, parser);

    Object.keys(trees).forEach(p => {
        const tree = trees[p].rootNode;
        const moduleName = getCurrentModule(tree);
        insertTypes(tree, moduleName);
    });

    console.log(typesmap);
}
init();