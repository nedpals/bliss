import Parser from "web-tree-sitter";
import { SymbolKind } from "./symbols";
export interface TypeProperties {
    type: string;
    name: string;
    file?: string;
    children?: {
        [name: string]: TypeProperties;
    };
    parent?: TypeProperties;
    node?: Parser.SyntaxNode;
    returnType: string;
    symbolKind: SymbolKind;
}
export interface Types {
    [moduleName: string]: {
        [name: string]: TypeProperties;
    };
}
interface ParsedType {
    name: string;
    props: TypeProperties;
}
export declare class TypeMap {
    private node;
    private filepath;
    private types;
    moduleName: string;
    constructor(filepath: string, node: Parser.SyntaxNode);
    setNode(node: Parser.SyntaxNode): void;
    getAll(): Types;
    get(key: string): TypeProperties;
    set(key: string, props: TypeProperties): void;
    insertParent(key: string, prop: TypeProperties): void;
    register(pType: ParsedType): void;
    registerChild(pType: ParsedType, parent: string): void;
    generate(log?: boolean): void;
    identifyType(node: Parser.SyntaxNode | null): string;
    parseTypedef(node: Parser.SyntaxNode): ParsedType;
    parseFunction(node: Parser.SyntaxNode): ParsedType;
    parseMethodReceiver(pType: ParsedType): void;
    parseFunctionParameters(pType: ParsedType): ParsedType[];
    parseFunctionBody(pType: ParsedType): ParsedType[];
    parseInterface(node: Parser.SyntaxNode): ParsedType;
    parseInterfaceMethods(pType: ParsedType): ParsedType[];
    parseConstants(node: Parser.SyntaxNode): ParsedType[];
    parseStruct(node: Parser.SyntaxNode): ParsedType;
    parseStructFields(pType: ParsedType): ParsedType[];
    parseVariable(node: Parser.SyntaxNode, pType?: ParsedType): ParsedType;
    parseEnum(node: Parser.SyntaxNode): ParsedType;
    parseEnumValues(pType: ParsedType): ParsedType[];
}
export declare function findChildByType(node: Parser.SyntaxNode | null, name: string): Parser.SyntaxNode | null;
export declare function filterChildrenByType(node: Parser.SyntaxNode | null, name: string | string[]): Parser.SyntaxNode[] | undefined;
export {};
