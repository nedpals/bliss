import Parser from "web-tree-sitter";
import * as fs from "fs";
import { promisify } from "util";

import { Importer } from "./importer";
import { TreeList } from "./trees";
import { filterChildrenByType, TypeMap, Types, TypeProperties } from "./types";
import { buildComment, buildSignature } from "./signatures";
import { isPositionAtRange } from "./utils";

export interface TypeInfo {
    name: string,
    returnType?: string,
    signature?: string,
    comment: string,
    prop?: TypeProperties 
}

export class Analyzer {
    parser!: Parser;
    importer: Importer = new Importer();
    trees: TreeList = new TreeList(this.parser);
    parserPath: string = require.resolve('tree-sitter-v/wasm/tree-sitter-v.wasm');

    async init(parserPath?: string): Promise<void> {
        this.parser = new Parser();
        
        if (typeof parserPath != 'undefined') { 
            this.parserPath = parserPath;
        }

        const v = await Parser.Language.load(this.parserPath);
        this.parser.setLanguage(v);
        this.trees = new TreeList(this.parser);
    };

    static async create(parserPath?: string): Promise<Analyzer> {
        const an = new Analyzer();
        await an.init(parserPath);
    
        return an;
    }

    getModuleName(filepath: string): string {
        const tree = this.trees.get(filepath);

        return Analyzer.getModuleNameFromTree(tree);
    }

    static getModuleNameFromTree(tree: Parser.Tree): string {
        return Analyzer.getModuleNameFromNode(tree.rootNode);
    }

    static getModuleNameFromNode(rootNode: Parser.SyntaxNode): string {
        const moduleClause = filterChildrenByType(rootNode, 'module_clause');
        if (typeof moduleClause === "undefined") { return 'main'; }
    
        //@ts-ignore
        const moduleName = filterChildrenByType(moduleClause[0], 'module_identifier')[0].text;
        return moduleName;
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



    async provideInfo(filepath: string, pos: Parser.Point, name: string): Promise<TypeInfo> {
        const typelists = await this.getTypeList(filepath, { includeModules: false, pos });
        const treePath = (path: string) => {
            const paths = path.split('.');
            return { parent: paths[0], child: paths[1] };
        };

        
        if (typelists !== {}) {
            let selectedChildName: string | undefined;
            
            for (let s of Object.keys(typelists[this.getModuleName(filepath)])) {
                const childName = Object.keys(typelists[this.getModuleName(filepath)][s].children as object).find(c => {
                    const child = typelists[this.getModuleName(filepath)][c];
                    return c === name || isPositionAtRange(pos, child.node as Parser.SyntaxNode);
                });
                
                if (typeof childName !== 'undefined') {
                    selectedChildName = `${s}.${childName || name}`;
                    console.log(selectedChildName);
                    break;
                }
            }
            
            const selectedChild = (() => {
                const { parent, child } = treePath(selectedChildName as string);
                //@ts-ignore
                return typelists[this.getModuleName(filepath)][parent].children[child];
            })();
            const selected = typelists[this.getModuleName(filepath)][name] || selectedChild;

            return {
                name,
                comment: buildComment(selected.node as Parser.SyntaxNode, true),
                prop: selected,
                returnType: selected.returnType,
                signature: buildSignature(selected)
            };
        }

        switch (name) {
            case 'fn': return { name, comment: 'A string.' };
            case 'pub': return { name, comment: 'Exposed to the public.' };
            case 'i8':
            case 'i16':
            case 'i64':
            case 'int': return { name, comment: 'An integer.' };
            case 'rune': return { name, comment: 'A rune.' };
            case 'byte': return { name, comment: 'A byte.' };
            case 'u16':
            case 'u32': return { name, comment: 'An unsigned integer.' }
            default: return { name, comment: 'Unknown' };
        }
    }

    async getTypeList(filepath: string, options: { includeModules: boolean, pos?: Parser.Point } = { includeModules: true }): Promise<Types> {
        let generatedTypeLists: Types = {};

        const tree = this.trees.get(filepath);
        const moduleName = Analyzer.getModuleNameFromTree(tree);
        let node = tree.rootNode;        
        let typemap: TypeMap = new TypeMap(filepath, node);
        typemap.generate();

        if (options.includeModules) {
            for (let mod of this.importer.depGraph[moduleName].dependencies) {
                // console.log('[getTypeList] Getting type information for module "' + mod + '"...');
                const modFiles = this.importer.depGraph[mod].files;
                
                for (let modFilepath of modFiles) {
                    // console.log('[getTypeList] Getting types on "' + modFilepath + '"...');
                    const modTree = this.trees.get(modFilepath);
                    let modTypemap = new TypeMap(modFilepath, modTree.rootNode);
                    modTypemap.generate();
    
                    generatedTypeLists = {
                        ...generatedTypeLists,
                        ...modTypemap.getAll()
                    };
                }
            }
        }

        // Applies to options.pos only
        if (typeof options.pos !== 'undefined') {
            let parentNode = node.descendantForPosition(options.pos);

            let isParent: boolean = false;
            let list = typemap.getAll();
            let locals = new TypeMap(filepath, node);

            while (!isParent) {
                // console.log(parentNode.text);
                console.log(parentNode.type);
                // TODO: Set rules for Struct
                if (['struct', 'struct_declaration'].includes(parentNode.type)) {
                    parentNode = parentNode.parent as Parser.SyntaxNode;
                    continue;
                }
        
                // TODO: Set rules for variables
                if (['expression_list', 'identifier', 'short_var_declaration'].includes(parentNode.type)) {
                    parentNode = parentNode.parent as Parser.SyntaxNode;
                    continue;
                } 
        
                // TODO: Set rules for enums
                if (['fn', 'enum', 'enum_declaration'].includes(parentNode.type)) {
                    parentNode = parentNode.parent as Parser.SyntaxNode;
                    continue;
                }

                if (parentNode.type == 'function_declaration') {
                    parentNode = parentNode.childForFieldName('body') as Parser.SyntaxNode;
                    continue;
                }
        
                // Consts
                if (['const', 'const_declaration'].includes(parentNode.type)) {
                    parentNode = parentNode.parent as Parser.SyntaxNode;
                    continue;
                }
        
                // TODO: Set rules for custom types
                
                // TODO: Set rules for parent nodes
                // TODO: Identify name
        
                if (['block', 'source_file'].includes(parentNode.type)) {
                    isParent = true;
                    locals.setNode(parentNode);
                    locals.generate();
                    list = { ...list, ...locals.getAll() };
                    continue;
                }
        
                isParent = true;
                break;
            }
            
            Object.keys(locals.getAll()[locals.moduleName]).forEach(typName => {
                const origType = locals.get(typName).returnType;
                if (typeof typemap.getAll()[locals.moduleName][origType] !== "undefined") {
                    locals.insertParent(typName, typemap.getAll()[locals.moduleName][origType]);
                }
            });

            generatedTypeLists = { ...generatedTypeLists, ...list };
        } else {
            generatedTypeLists = { ...generatedTypeLists, ...typemap.getAll() };
        }

        return generatedTypeLists;
    }
}
