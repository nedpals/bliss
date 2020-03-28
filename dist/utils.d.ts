import { SyntaxNode, Point } from "web-tree-sitter";
export declare const osSuffixes: string[];
export declare const excludedOSSuffixes: string[];
export declare function isNodePublic(node: SyntaxNode | null): boolean;
export declare function isPositionAtRange(pos: Point, node: SyntaxNode): boolean;
