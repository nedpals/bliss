import Parser from "web-tree-sitter";
import { SymbolKind, CompletionItemKind } from "./symbols";
export declare type Symbols = Map<string, Map<string, Symbol>>;
interface ParsedSymbol {
    name: string;
    sym: Symbol;
}
export declare class Symbol {
    name: string;
    file: string;
    type: string;
    children: Map<string, Symbol>;
    parent: Symbol;
    node: Parser.SyntaxNode;
    returnType: string;
    symbolKind: SymbolKind;
    completionItemKind: CompletionItemKind;
    module: string;
    isMut: boolean;
    isPublic: boolean;
    constructor(name: string, type: string);
}
export declare class SymbolMap {
    private node;
    private filepath;
    symbols: Symbols;
    moduleName: string;
    constructor(filepath: string, node: Parser.SyntaxNode, autogenerate?: boolean);
    has: (moduleName: string) => boolean;
    setNode(node: Parser.SyntaxNode): void;
    setFile(filepath: string): void;
    get: (key: string) => Symbol;
    getFrom: (moduleName: string) => Map<string, Symbol>;
    getAll: () => Symbols;
    set: (key: string, sym: Symbol) => void;
    insertParent: (key: string, sym: Symbol) => void;
    register({ name, sym }: ParsedSymbol): void;
    registerChild(pSym: ParsedSymbol, parent: string): void;
    registerChildToProp({ name, sym }: ParsedSymbol, parent: Symbol): void;
    getPublicSymbols(except?: string): Symbols;
    generate(exclude?: string[]): void;
    static get basicTypes(): string[];
    static identify(node: Parser.SyntaxNode, customTypes?: string[]): string;
    identifyType(node: Parser.SyntaxNode): string;
    parseTypedef(node: Parser.SyntaxNode): ParsedSymbol;
    parseFunction(node: Parser.SyntaxNode): ParsedSymbol;
    parseMethod(pSym: ParsedSymbol): ParsedSymbol[];
    parseFunctionParameters(pSym: ParsedSymbol): ParsedSymbol[];
    parseFunctionBody(pSym: ParsedSymbol): ParsedSymbol[];
    parseInterface(node: Parser.SyntaxNode): ParsedSymbol;
    parseInterfaceMethods(pSym: ParsedSymbol): ParsedSymbol[];
    parseConstants(node: Parser.SyntaxNode): ParsedSymbol[];
    parseStruct(node: Parser.SyntaxNode): ParsedSymbol;
    parseStructFields(pSym: ParsedSymbol): ParsedSymbol[];
    parseVariable(node: Parser.SyntaxNode, pSym?: ParsedSymbol): ParsedSymbol;
    parseEnum(node: Parser.SyntaxNode): ParsedSymbol;
    parseEnumValues(pSym: ParsedSymbol): ParsedSymbol[];
}
export declare function findChildByType(node: Parser.SyntaxNode | null, name: string): Parser.SyntaxNode | null;
export declare function filterChildrenByType(node: Parser.SyntaxNode | null, name: string | string[]): Parser.SyntaxNode[] | undefined;
export {};
