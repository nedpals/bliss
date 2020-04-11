import Parser from "web-tree-sitter";
import { Analyzer } from "./analyzer";
export declare type Module = string;
interface DepGraph {
    [module_name: string]: {
        files: Set<string>;
        dependencies: Set<string>;
    };
}
export declare class Importer {
    depGraph: DepGraph;
    findModuleName(name: string): string;
    static get(rootNode: Parser.SyntaxNode): Promise<Set<Module>>;
    static importModulePaths(additionalPaths?: string[]): Promise<string[]>;
    static resolveModuleFilepaths(moduleName: Module, excludeOSSuffixes?: boolean, paths?: string[]): Promise<string[]>;
    static resolveFromFilepath(filepath: string, excludeOSSuffixes?: boolean): Promise<string[]>;
    import(modules: Set<Module>, analyzer: Analyzer, paths?: string[]): Promise<void>;
    static getOtherFiles(filepath: string, analyzer: Analyzer): Promise<string[]>;
    getAndResolve(filepath: string, analyzer: Analyzer): Promise<void>;
}
export {};
