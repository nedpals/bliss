import Parser from "web-tree-sitter";
export declare type ParsedFiles = Map<string, Map<string, Parser.Tree>>;
export interface ContentChanges {
    startIndex: number;
    startPos: Parser.Point;
    old: {
        endIndex: number;
        endPos: Parser.Point;
    };
    new: {
        endIndex: number;
        endPos: Parser.Point;
    };
}
export declare class TreeList {
    private trees;
    private parser;
    constructor(parser: Parser);
    new(filepath: string, source: string): void;
    update(filepath: string, source: string, ...changes: ContentChanges[]): void;
    has(filepath: string): boolean;
    get(filepath: string): Parser.Tree;
    delete(filepath: string): void;
    static getTreePath(filepath: string): string[];
}
