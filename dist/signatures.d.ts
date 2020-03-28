import Parser from "web-tree-sitter";
import { TypeProperties } from "./types";
export declare function buildFnSignature(node: Parser.SyntaxNode | null, withPub?: boolean): string;
export declare function buildEnumSignature(node: Parser.SyntaxNode | null, withPub?: boolean): string;
export declare function buildSignature(pType: TypeProperties): string;
export declare function buildStructSignature(node: Parser.SyntaxNode | null, withPub?: boolean): string;
export declare function buildTypeSignature(name: string, type: string): string;
export declare function buildComment(start_node: Parser.SyntaxNode, backwards?: boolean): string;
