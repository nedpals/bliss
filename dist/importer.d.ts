import Parser from "web-tree-sitter";
import { Analyzer } from "./analyzer";
export declare type Module = string;
interface DepGraph {
    [module_name: string]: {
        files: string[];
        dependencies: Module[];
    };
}
export declare class Importer {
    depGraph: DepGraph;
    static get(rootNode: Parser.SyntaxNode): Promise<Module[]>;
    static resolveModulePath(moduleName: Module, excludeOSSuffixes?: boolean): Promise<string[]>;
    import(modules: Module[], analyzer: Analyzer): Promise<void>;
    getAndResolve(filepath: string, analyzer: Analyzer): Promise<void>;
}
export {};
