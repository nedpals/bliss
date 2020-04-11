import * as fs from "fs";
import { dirname, basename } from "path";
import { promisify } from "util";
import Parser from "web-tree-sitter";
import { Importer } from "./importer";
import { TreeList } from "./trees";
import { filterChildrenByType, SymbolMap, Symbol, Symbols } from "./types";
import { normalizePath } from "./utils";
import { CompletionItemKind, SymbolKind } from "./symbols";

export interface TypeInfo {
    name: string,
    returnType?: string,
    signature?: string,
    comment: string,
    prop?: Symbol 
}

export class Analyzer {
    parser!: Parser;
    importer: Importer = new Importer();
    trees: TreeList = new TreeList(this.parser);
    parserPath: string = require.resolve('tree-sitter-v/wasm/tree-sitter-v.wasm');
    cachedSymbols: Symbols = new Map();

    async init(parserPath?: string): Promise<void> {
        this.parser = new Parser();
        
        if (typeof parserPath != 'undefined') { 
            this.parserPath = parserPath;
        }

        const v = await Parser.Language.load(this.parserPath);
        this.parser.setLanguage(v);
        this.trees = new TreeList(this.parser);
    };

    cache(syms: Symbols) {
        for (const name of syms.keys()) {
            if (!this.cachedSymbols.has(name)) {
                this.cachedSymbols.set(name, new Map());
            }

            for (const [symName, newSym] of syms.get(name).entries()) {
                this.cachedSymbols.get(name).set(symName, newSym);
            }
        }
    }

    static async create(parserPath?: string): Promise<Analyzer> {
        const an = new Analyzer();
        await an.init(parserPath);
    
        return an;
    }

    getModuleName(filepath: string): string {
        const tree = this.trees.get(filepath);
        const parent = dirname(dirname(normalizePath(filepath)));
        const parentModName = basename(parent);
        let moduleName = Analyzer.getModuleNameFromTree(tree);
        
        if (typeof this.importer.depGraph[parentModName] !== "undefined") {
            moduleName = parentModName + '.' + moduleName;
        }

        return moduleName;
    }
    
    async getFullModuleName(filepath: string): Promise<string> {
        const fp = normalizePath(filepath);
        const tree = this.trees.get(filepath);
        const parent = dirname(dirname(fp));
        let parentModName = this.importer.findModuleName(basename(parent));
        let moduleName = Analyzer.getModuleNameFromTree(tree);
        
        if (moduleName === 'main') return moduleName;
        if (typeof this.importer.depGraph[parentModName] !== "undefined") {
            moduleName = parentModName + '.' + moduleName;
        } else {
            let filename = '';
            let files = await Importer.resolveModuleFilepaths(parentModName);

            if (files.length != 0) {
                await this.open(files[0]);
                filename = files[0];
            }

            if (filename.length !== 0) {
                parentModName = await this.getFullModuleName(filename);
                if (parentModName !== 'main') {
                    moduleName = parentModName + '.' + moduleName;
                }
            }
        }

        return moduleName;
    }

    static getModuleNameFromTree(tree: Parser.Tree): string {
        return Analyzer.getModuleNameFromNode(tree.rootNode);
    }

    static getModuleNameFromNode(rootNode: Parser.SyntaxNode): string {
        const moduleClause = filterChildrenByType(rootNode, 'module_clause');
        if (typeof moduleClause === "undefined") { return 'main'; }
    
        //@ts-ignore
        const moduleName = filterChildrenByType(moduleClause[0], 'module_identifier')[0].text;
        return moduleName;
    }

    open(filepath: string, source?: string): Promise<void> {
        let fp = normalizePath(filepath);
        if (this.trees.has(fp)) return;
        const _source = typeof source === "undefined" ? fs.readFileSync(fp, { encoding: 'utf-8' }) : source;
        this.trees.new(fp, _source);

        return this.importer.getAndResolve(fp, this)
    }

    getSymbols(filepath: string): Map<string, Symbol> {
        const tree = this.trees.get(filepath);
        const symbols = new SymbolMap(filepath, tree.rootNode);

        return symbols.getFrom(Analyzer.getModuleNameFromNode(tree.rootNode));
    }

    // provideInfo(filepath: string, options: { pos?: Parser.Point, range?: Parser.Range }): Promise<void> {
    //     const node 
    // }

    async getLocalSuggestions(filepath: string, options: { pos?: Parser.Point, range?: Parser.Range }): Promise<Symbols> {
        const tree = this.trees.get(filepath);
        const node = tree.rootNode;

        let isParent: boolean = false;
        let fromFn: boolean = false;
        let locals: SymbolMap = new SymbolMap(filepath, node, false);
        let parentNode = options.range ? 
                node.namedDescendantForPosition(options.range.startPosition, options.range.endPosition) : 
                node.namedDescendantForPosition(options.pos);
        
        if (typeof parentNode.parent === 'undefined') return locals.getAll();

        while (!isParent) {
            // console.log(parentNode.type);
            // console.log(parentNode.text);
            // TODO: Set rules for Struct        
            // TODO: Set rules for variables
            // TODO: Set rules for enums
            if (parentNode.type == 'source_file') {
                locals.setNode(parentNode);
                locals.generate();
                break;
            }

            if (parentNode.type == 'block') {
                locals.setNode(parentNode);
                locals.generate();

                if (fromFn) {
                    isParent = true;
                    break;
                }

                parentNode = parentNode.parent;
                continue;
            }

            if (parentNode.type == 'source_file') {
                isParent = true;
                break;
            }
        
            if (parentNode.type == 'parameter_list') {
                // Extract parameter
                let fn = locals.parseFunction(parentNode.parent);
                if (parentNode.parent?.type === 'method_declaration') {
                    let [_fn, _] = locals.parseMethod(fn);
                    fn = _fn;
                };
                locals.parseFunctionParameters(fn).forEach(p => { locals.register(p); });
                parentNode = parentNode.parent;
                continue;
            }

            if (['function_declaration', 'method_declaration'].includes(parentNode.type)) {
                let fn = locals.parseFunction(parentNode);
                if (parentNode.type === 'method_declaration') {
                    let [_fn, rec] = locals.parseMethod(fn);
                    fn = _fn; locals.register(rec);
                };
                locals.parseFunctionParameters(fn).forEach(p => locals.register(p));
                parentNode = parentNode.childForFieldName('body');
                fromFn = true;
                continue;
            }
    
            // TODO: Set rules for custom types
            // TODO: Set rules for parent nodes
            // TODO: Identify name

            parentNode = parentNode.parent;
        }

        if (this.cachedSymbols.has(locals.moduleName) && locals.has(locals.moduleName)) {
            for (const [symName, sym] of locals.getFrom(locals.moduleName).entries()) {
                const origType = sym.returnType;
                if (!this.cachedSymbols.get(locals.moduleName).has(origType)) {
                    if (sym.type !== "variable") continue; 
                    const lastNamedChild = sym.node.lastNamedChild;
                    const firstChild = lastNamedChild.firstNamedChild;
                    // TODO:
                    // if (sym.name == '_type') {
                    //     if (lastNamedChild.type == 'index_expression') {
                    //         const baseChild = lastNamedChild.namedChildren[0];

                    //         if (baseChild.type == 'selector_expression') {
                    //             let selectedSym: Symbol;

                    //             for (const child of baseChild.namedChildren) {
                    //                 let fieldName = child.text;
                    //                 if (child.type == 'field_identifier') {
                    //                     if (selectedSym.children.has(fieldName)) {
                    //                         selectedSym = selectedSym.children.get(fieldName);
                    //                     }
                    //                 } else {
                    //                     if (locals.getFrom(locals.moduleName).has(fieldName)) {
                    //                         selectedSym = locals.getFrom(locals.moduleName).get(fieldName);
                    //                         continue;
                    //                     }
                    //                 }
                    //             }

                    //             if (typeof selectedSym !== 'undefined') {
                    //                 sym.returnType = selectedSym.returnType;
                    //             } else {
                    //                 sym.returnType = 'unknown';
                    //             }

                    //             continue;
                    //         }
                    //     }
                    // }
                    if (firstChild.type === 'identifier') {
                        locals.insertParent(sym.name, this.cachedSymbols.get(locals.moduleName).get(firstChild.text));
                        sym.returnType = sym.parent.returnType;
                    }
                }

                locals.insertParent(symName, this.cachedSymbols.get(locals.moduleName).get(origType));
            }
        }

        return locals.getAll();
    }

    async getGlobalSuggestions(filepath: string, includeModules: boolean = false, publicOnlyOnMod: boolean = true): Promise<void> {
        const tree = this.trees.get(filepath);
        const moduleName = await this.getFullModuleName(filepath);
        const node = tree.rootNode;
        const generateSuggestions = (fp, modName) => {
            suggestions.setFile(fp);
            suggestions.setNode(this.trees.get(fp).rootNode);
            suggestions.moduleName = modName;
            suggestions.generate();
        }

        if (typeof this.importer.depGraph[moduleName] === 'undefined') return;
        let suggestions: SymbolMap = new SymbolMap(filepath, node, false);
        if (includeModules) {
            const deps = this.importer.depGraph[moduleName].dependencies;

            for (const mod of deps.values()) {
                if (typeof this.importer.depGraph[mod] === 'undefined') continue;
                const files = this.importer.depGraph[mod].files;
                for (const f of files) { generateSuggestions(f, mod); }
            }
        }

        const relatedFiles = this.importer.depGraph[moduleName].files;
        for (const f of relatedFiles.keys()) { generateSuggestions(f, moduleName); }

        for (const [modName, syms] of suggestions.getAll()) {
            for (const sym of syms.values()) {
                if (sym.type !== "method") continue;
                const names = sym.name.split(".");
                const originalType = names[0];
                const originalName = sym.name;
                if (!suggestions.symbols.get(modName).has(originalType)) {
                    suggestions.moduleName = modName;
                    const newType = new Symbol(originalType, originalType);
                    newType.isPublic = true;
                    newType.completionItemKind = CompletionItemKind.Keyword;
                    newType.symbolKind = SymbolKind.Object;
                    newType.returnType = originalType;

                    suggestions.register({ name: newType.name, sym: newType });
                    suggestions.moduleName = moduleName;
                }
                suggestions.symbols.get(modName).get(originalType).children.set(names[1], sym);
                suggestions.symbols.get(modName).delete(originalName);
            }
        }

        this.cache(publicOnlyOnMod ? suggestions.getPublicSymbols(moduleName) : suggestions.getAll());
    }
}
