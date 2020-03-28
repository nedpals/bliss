import Parser from "web-tree-sitter";
import { parse as path_parse } from "path";

export interface ParsedFiles {
    [base_paths: string]: {
        [filename: string]: Parser.Tree
    }
}

export interface ContentChanges { 
    startIndex: number,
    startPos: Parser.Point,
    old: {
        endIndex: number,
        endPos: Parser.Point
    },
    new: {
        endIndex: number,
        endPos: Parser.Point
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

    async update(filepath: string, source: string, ...changes: ContentChanges[]) {
        if (changes.length == 0) return;
        const old = this.get(filepath); // edit.document.uri.toString()
        const treePaths = TreeList.getTreePath(filepath);
        const dir = treePaths[0];
        const base = treePaths[1]; 

        for (const c of changes) {
            //const startIndex = e.rangeOffset
            // const oldEndIndex = e.rangeOffset + e.rangeLength
            // const newEndIndex = e.rangeOffset + e.text.length
            // const startPos = edit.document.positionAt(startIndex)
            // const oldEndPos = edit.document.positionAt(oldEndIndex)
            // const newEndPos = edit.document.positionAt(newEndIndex)
            // const startPosition = asPoint(startPos)
            // const oldEndPosition = asPoint(oldEndPos)
            // const newEndPosition = asPoint(newEndPos)
            // const delta = {startIndex, oldEndIndex, newEndIndex, startPosition, oldEndPosition, newEndPosition}
            old.edit({
                startIndex: c.startIndex,
                startPosition: c.startPos,
                oldEndIndex: c.old.endIndex,
                oldEndPosition: c.old.endPos,
                newEndIndex: c.new.endIndex,
                newEndPosition: c.new.endPos
            });
        }
        const t = this.parser.parse(source, old) // TODO don't use getText, use Parser.Input // edit.document.getText()
        this.trees[dir][base] = t;
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