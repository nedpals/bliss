import { Analyzer } from "../analyzer";
import { Importer } from "../importer";
import { TypeMap, TypeProperties, Types } from "../types";
import * as path from "path";
import Parser, { SyntaxNode } from "web-tree-sitter";

async function getLocal(filepath: string, node: SyntaxNode, analyzer: Analyzer): Promise<{ list: Types }> {
    let parentNode: SyntaxNode = node;
    let isParent: boolean = false;
    let localTypemap = new TypeMap(filepath, parentNode); 
    localTypemap.generate(true);
    let list = localTypemap.getAll();
    const globalTypemap = await analyzer.getTypeList(filepath);

    while (!isParent) {
        // console.log(parentNode.text);
        // console.log(parentNode.type);
        // TODO: Set rules for Struct
        if (['struct', 'struct_declaration'].includes(parentNode.type)) {
            parentNode = parentNode.parent as SyntaxNode;
            continue;
        }

        // TODO: Set rules for variables
        if (['expression_list', 'identifier', 'short_var_declaration'].includes(parentNode.type)) {
            parentNode = parentNode.parent as SyntaxNode;
            continue;
        } 

        // TODO: Set rules for enums
        if (['enum', 'enum_declaration'].includes(parentNode.type)) {
            parentNode = parentNode.parent as SyntaxNode;
            continue;
        }

        // Consts
        if (['const', 'const_declaration'].includes(parentNode.type)) {
            parentNode = parentNode.parent as SyntaxNode;
            continue;
        }

        // TODO: Set rules for custom types
        
        // TODO: Set rules for parent nodes
        // TODO: Identify name

        if (['block', 'source_file'].includes(parentNode.type)) {
            isParent = true;
            localTypemap.setNode(parentNode);
            localTypemap.generate();
            list = { ...list, ...localTypemap.getAll() };
            continue;
        }

        isParent = true;
        break;
    }
    
    Object.keys(localTypemap.getAll()[localTypemap.moduleName]).forEach(typName => {
        const origType = localTypemap.get(typName).returnType;
        if (typeof globalTypemap[localTypemap.moduleName][origType] !== "undefined") {
            localTypemap.insertParent(typName, globalTypemap[localTypemap.moduleName][origType]);
        }
    });

    return { list };
}

async function navigate() {
    let analyzer: Analyzer;

    try {
        await Parser.init();
    } catch(e) {
        console.log(e);
    } finally {
        analyzer = await Analyzer.create();

        const source = `
        module main

        const (
            name = 'Ned'
            age = 18
        )

        enum PersonType {
            regular
            alien
            executive
        }

        struct Person {
            name string
            age int
            typ PersonType
        }

        interface Speaker {
            say_hello() string
        }

        fn (p Person) say_hello() {
            println('Hello, $name! You are $age years old.')
        }

        fn main() {
            three := 1+3
            person := Person{'Ned', 19}
            person.say_hello()
        }
        `;

        const filename = 'hello.v';

        try {
            await analyzer.open(filename, source);
        } catch(e) {
            console.log(e);
        } finally {
            // const tree = analyzer.trees.get(filename);
            const moduleName = analyzer.getModuleName(filename);
            // console.log(typelist);
            const typelist = await analyzer.getTypeList(filename, { 
                includeModules: false,
                pos: { row: 28, column: 8 }
            });
            // const sp = typelist[moduleName]['main'].node?.startPosition as Parser.Point;
            // const localList = await getLocal(filename, tree.rootNode.descendantForPosition(sp), analyzer);
            // console.log(sp)
            console.log(typelist);
        }
    }
}

navigate();