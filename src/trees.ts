import Parser from "web-tree-sitter";
import { parse as path_parse } from "path";

export interface ParsedFiles {
    [base_paths: string]: {
        [filename: string]: Parser.Tree
    }
}

export class TreeList {
    private trees: ParsedFiles = {};
    private parser: Parser;

    constructor(parser: Parser) {
        this.parser = parser;
    }

    async new(input: { filepath: string, source: string }) {
        let tree;

        const parser = this.parser;
        const treePaths = TreeList.getTreePath(input.filepath);
        const dir = treePaths[0];
        const base = treePaths[1]; 

        if (typeof input.source != "undefined") {
            tree = parser.parse(input.source);
        }

        if (typeof tree !== "undefined") {
            if (Object.keys(this.trees).indexOf(dir) == -1) {
                this.trees[dir] = {};
            }

            this.trees[dir][base] = tree;
        }
    }

    get(filepath: string): Parser.Tree {
        const treePaths = TreeList.getTreePath(filepath);
        const dir = treePaths[0];
        const base = treePaths[1]; 
        
        return this.trees[dir][base];
        }

    static getTreePath(filepath: string): string[] {
        let { dir, base } = path_parse(filepath);
        if (dir.length == 0) { dir = '.'; }

        return [dir, base];
    }
}