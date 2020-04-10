import Parser from "web-tree-sitter";
import { Importer } from "./importer";
import { TreeList } from "./trees";
import { Symbol, Symbols } from "./types";
export interface TypeInfo {
    name: string;
    returnType?: string;
    signature?: string;
    comment: string;
    prop?: Symbol;
}
export declare class Analyzer {
    parser: Parser;
    importer: Importer;
    trees: TreeList;
    parserPath: string;
    cachedSymbols: Symbols;
    init(parserPath?: string): Promise<void>;
    cache(syms: Symbols): void;
    static create(parserPath?: string): Promise<Analyzer>;
    getModuleName(filepath: string): string;
    getFullModuleName(filepath: string): Promise<string>;
    static getModuleNameFromTree(tree: Parser.Tree): string;
    static getModuleNameFromNode(rootNode: Parser.SyntaxNode): string;
    open(filepath: string, source?: string): Promise<void>;
    getSymbols(filepath: string): Map<string, Symbol>;
    getLocalSuggestions(filepath: string, options: {
        pos?: Parser.Point;
        range?: Parser.Range;
    }): Promise<Symbols>;
    getGlobalSuggestions(filepath: string, includeModules?: boolean, publicOnlyOnMod?: boolean): Promise<void>;
}
