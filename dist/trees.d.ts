import Parser from "web-tree-sitter";
export interface ParsedFiles {
    [base_paths: string]: {
        [filename: string]: Parser.Tree;
    };
}
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
    new(input: {
        filepath: string;
        source: string;
    }): Promise<void>;
    update(filepath: string, source: string, ...changes: ContentChanges[]): Promise<void>;
    get(filepath: string): Parser.Tree;
    static getTreePath(filepath: string): string[];
}
