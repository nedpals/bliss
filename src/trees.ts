import Parser from "web-tree-sitter";
import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";

interface ParsedFiles {
    [base_paths: string]: {
        [filename: string]: Parser.Tree
    }
}

export const trees: ParsedFiles = {};
export async function newTree(options: { 'filepath': string, 'source': string, 'trees'?: ParsedFiles }, parser: Parser) {
    let tree;
    const parsedPath = path.parse(options.filepath);
    
    if (typeof options.source != "undefined") {
        tree = parser.parse(options.source);
    }

    if (typeof tree !== "undefined") {
        if (Object.keys(options.trees || trees).indexOf(parsedPath.dir) == -1) {
            (options.trees || trees)[parsedPath.dir] = {};
        }

        (options.trees || trees)[parsedPath.dir][parsedPath.base] = tree;
    }
}
