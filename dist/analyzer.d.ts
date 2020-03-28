import Parser from "web-tree-sitter";
import { Importer } from "./importer";
import { TreeList } from "./trees";
import { Types, TypeProperties } from "./types";
export interface TypeInfo {
    name: string;
    returnType?: string;
    signature?: string;
    comment: string;
    prop?: TypeProperties;
}
export declare class Analyzer {
    parser: Parser;
    importer: Importer;
    trees: TreeList;
    parserPath: string;
    init(parserPath?: string): Promise<void>;
    static create(parserPath?: string): Promise<Analyzer>;
    getModuleName(filepath: string): string;
    static getModuleNameFromTree(tree: Parser.Tree): string;
    static getModuleNameFromNode(rootNode: Parser.SyntaxNode): string;
    open(filepath: string, source?: string): Promise<void>;
    provideInfo(filepath: string, pos: Parser.Point, name: string): Promise<TypeInfo>;
    getTypeList(filepath: string, options?: {
        includeModules: boolean;
        pos?: Parser.Point;
    }): Promise<Types>;
}
