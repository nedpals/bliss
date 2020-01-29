import Parser from "web-tree-sitter";
import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";

export const trees: { [key: string]: Parser.Tree } = {};

export async function newTree(options: { 'filepath': string, 'source'?: string, 'tree'?: { [x: string]: Parser.Tree } }, parser: Parser) {
    let tree;

    if (typeof options.filepath !== "undefined" && typeof options.source === "undefined") {
        const source = await promisify(fs.readFile)(path.resolve(options.filepath), { encoding: 'utf-8' });
        tree = parser.parse(source);
    } else {
        if (typeof options.source !== "undefined") {
            tree = parser.parse(options.source);
        }
    }

    if (typeof tree !== "undefined") {
        (options.tree || trees)[options.filepath] = tree;
    }
}
