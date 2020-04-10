import Parser from "web-tree-sitter";
import { parse as path_parse } from "path";
import { normalizePath } from "./utils";

export type ParsedFiles = Map<string, Map<string, Parser.Tree>>;

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
    private trees: ParsedFiles = new Map();
    private parser: Parser;

    constructor(parser: Parser) {
        this.parser = parser;
    }

    new(filepath: string, source: string) {
        const parser = this.parser;
        const [dir, base] = TreeList.getTreePath(filepath);
        const tree = parser.parse(source);

        if (!this.trees.has(dir)) {
            this.trees.set(dir, new Map());
        }

        this.trees.get(dir).set(base, tree);
    }

    update(filepath: string, source: string, ...changes: ContentChanges[]) {
        if (changes.length == 0) return;
        const old = this.get(filepath);
        const [dir, base] = TreeList.getTreePath(filepath);

        for (const c of changes) {
            old.edit({
                startIndex: c.startIndex,
                startPosition: c.startPos,
                oldEndIndex: c.old.endIndex,
                oldEndPosition: c.old.endPos,
                newEndIndex: c.new.endIndex,
                newEndPosition: c.new.endPos
            });
        }
        const t = this.parser.parse(source, old);
        this.trees.get(dir).set(base, t);
    }

    has(filepath: string): boolean {
        const [dir, base] = TreeList.getTreePath(filepath);
        
        return this.trees.has(dir) && this.trees.get(dir).has(base);
    }

    get(filepath: string): Parser.Tree {
        const [dir, base] = TreeList.getTreePath(filepath);

        return this.trees.get(dir).get(base);
    }

    delete(filepath: string): void {
        let [dir, base] = TreeList.getTreePath(filepath);
        this.trees.get(dir).delete(base);

        if (this.trees.get(dir).size == 0) {
            this.trees.delete(dir);
        }
    }

    static getTreePath(filepath: string): string[] {
        let { dir, base } = path_parse(normalizePath(filepath));
        if (dir.length == 0) { dir = '.'; }

        return [dir, base];
    }
}