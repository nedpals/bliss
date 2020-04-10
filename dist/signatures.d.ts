import Parser from "web-tree-sitter";
import { Symbol } from "./types";
export declare function buildFnSignature(node: Parser.SyntaxNode, withPub?: boolean): string;
export declare function buildEnumSignature(node: Parser.SyntaxNode | null, withPub?: boolean): string;
export declare function buildSignature(pType: Symbol): string;
export declare function buildStructSignature(node: Parser.SyntaxNode | null, withPub?: boolean): string;
export declare function buildTypeSignature(name: string, type: string): string;
export declare function buildComment(start_node: Parser.SyntaxNode, backwards?: boolean): string;
