"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path_1 = require("path");
const util_1 = require("util");
const web_tree_sitter_1 = __importDefault(require("web-tree-sitter"));
const importer_1 = require("./importer");
const trees_1 = require("./trees");
const types_1 = require("./types");
const utils_1 = require("./utils");
const symbols_1 = require("./symbols");
class Analyzer {
    constructor() {
        this.importer = new importer_1.Importer();
        this.trees = new trees_1.TreeList(this.parser);
        this.parserPath = require.resolve('tree-sitter-v/wasm/tree-sitter-v.wasm');
        this.cachedSymbols = new Map();
    }
    async init(parserPath) {
        this.parser = new web_tree_sitter_1.default();
        if (typeof parserPath != 'undefined') {
            this.parserPath = parserPath;
        }
        const v = await web_tree_sitter_1.default.Language.load(this.parserPath);
        this.parser.setLanguage(v);
        this.trees = new trees_1.TreeList(this.parser);
    }
    ;
    cache(syms) {
        for (const name of syms.keys()) {
            if (!this.cachedSymbols.has(name)) {
                this.cachedSymbols.set(name, new Map());
            }
            for (const [symName, newSym] of syms.get(name).entries()) {
                this.cachedSymbols.get(name).set(symName, newSym);
            }
        }
    }
    static async create(parserPath) {
        const an = new Analyzer();
        await an.init(parserPath);
        return an;
    }
    getModuleName(filepath) {
        const tree = this.trees.get(filepath);
        const parent = path_1.dirname(path_1.dirname(utils_1.normalizePath(filepath)));
        const parentModName = path_1.basename(parent);
        let moduleName = Analyzer.getModuleNameFromTree(tree);
        if (typeof this.importer.depGraph[parentModName] !== "undefined") {
            moduleName = parentModName + '.' + moduleName;
        }
        return moduleName;
    }
    async getFullModuleName(filepath) {
        const fp = utils_1.normalizePath(filepath);
        const tree = this.trees.get(filepath);
        const parent = path_1.dirname(path_1.dirname(fp));
        let parentModName = this.importer.findModuleName(path_1.basename(parent));
        let moduleName = Analyzer.getModuleNameFromTree(tree);
        if (typeof this.importer.depGraph[parentModName] !== "undefined") {
            moduleName = parentModName + '.' + moduleName;
        }
        else {
            let filename = '';
            let files = await importer_1.Importer.resolveModuleFilepaths(parentModName);
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
    static getModuleNameFromTree(tree) {
        return Analyzer.getModuleNameFromNode(tree.rootNode);
    }
    static getModuleNameFromNode(rootNode) {
        const moduleClause = types_1.filterChildrenByType(rootNode, 'module_clause');
        if (typeof moduleClause === "undefined") {
            return 'main';
        }
        const moduleName = types_1.filterChildrenByType(moduleClause[0], 'module_identifier')[0].text;
        return moduleName;
    }
    async open(filepath, source) {
        let fp = utils_1.normalizePath(filepath);
        if (this.trees.has(fp))
            return;
        const _source = typeof source === "undefined" ? await util_1.promisify(fs.readFile)(fp, { encoding: 'utf-8' }) : source;
        this.trees.new(fp, _source);
        return this.importer.getAndResolve(fp, this);
    }
    getSymbols(filepath) {
        const tree = this.trees.get(filepath);
        const symbols = new types_1.SymbolMap(filepath, tree.rootNode);
        return symbols.getFrom(Analyzer.getModuleNameFromNode(tree.rootNode));
    }
    async getLocalSuggestions(filepath, options) {
        var _a;
        const tree = this.trees.get(filepath);
        let isParent = false;
        let fromFn = false;
        let node = tree.rootNode;
        let locals = new types_1.SymbolMap(filepath, node, false);
        let parentNode = options.range ?
            node.namedDescendantForPosition(options.range.startPosition, options.range.endPosition) :
            node.namedDescendantForPosition(options.pos);
        if (typeof parentNode.parent === 'undefined')
            return locals.getAll();
        while (!isParent) {
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
                let fn = locals.parseFunction(parentNode.parent);
                if (((_a = parentNode.parent) === null || _a === void 0 ? void 0 : _a.type) === 'method_declaration') {
                    let [_fn, _] = locals.parseMethod(fn);
                    fn = _fn;
                }
                ;
                locals.parseFunctionParameters(fn).forEach(p => { locals.register(p); });
                parentNode = parentNode.parent;
                continue;
            }
            if (['function_declaration', 'method_declaration'].includes(parentNode.type)) {
                let fn = locals.parseFunction(parentNode);
                if (parentNode.type === 'method_declaration') {
                    let [_fn, rec] = locals.parseMethod(fn);
                    fn = _fn;
                    locals.register(rec);
                }
                ;
                locals.parseFunctionParameters(fn).forEach(p => locals.register(p));
                parentNode = parentNode.childForFieldName('body');
                fromFn = true;
                continue;
            }
            parentNode = parentNode.parent;
        }
        if (this.cachedSymbols.has(locals.moduleName) && locals.has(locals.moduleName)) {
            for (const [symName, sym] of locals.getFrom(locals.moduleName).entries()) {
                const origType = sym.returnType;
                if (!this.cachedSymbols.get(locals.moduleName).has(origType)) {
                    if (sym.type !== "variable")
                        continue;
                    const lastNamedChild = sym.node.lastNamedChild;
                    const firstChild = lastNamedChild.firstNamedChild;
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
    async getGlobalSuggestions(filepath, includeModules = false, publicOnlyOnMod = true) {
        const tree = this.trees.get(filepath);
        const moduleName = await this.getFullModuleName(filepath);
        let node = tree.rootNode;
        let suggestions = new types_1.SymbolMap(filepath, node, false);
        const generateSuggestions = (fp, modName) => {
            suggestions.setFile(fp);
            suggestions.setNode(this.trees.get(fp).rootNode);
            suggestions.moduleName = modName;
            suggestions.generate();
        };
        if (includeModules) {
            const deps = this.importer.depGraph[moduleName].dependencies;
            for (const mod of deps.values()) {
                const files = this.importer.depGraph[mod].files;
                for (const f of files) {
                    generateSuggestions(f, mod);
                }
            }
        }
        const relatedFiles = this.importer.depGraph[moduleName].files;
        for (const f of relatedFiles.keys()) {
            generateSuggestions(f, moduleName);
        }
        for (const [modName, syms] of suggestions.getAll()) {
            for (const sym of syms.values()) {
                if (sym.type !== "method")
                    continue;
                const names = sym.name.split(".");
                const originalType = names[0];
                const originalName = sym.name;
                if (!suggestions.symbols.get(modName).has(originalType)) {
                    suggestions.moduleName = modName;
                    const newType = new types_1.Symbol(originalType, originalType);
                    newType.isPublic = true;
                    newType.completionItemKind = symbols_1.CompletionItemKind.Keyword;
                    newType.symbolKind = symbols_1.SymbolKind.Object;
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
exports.Analyzer = Analyzer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYW5hbHl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXlCO0FBQ3pCLCtCQUF5QztBQUN6QywrQkFBaUM7QUFDakMsc0VBQXFDO0FBQ3JDLHlDQUFzQztBQUN0QyxtQ0FBbUM7QUFDbkMsbUNBQTJFO0FBQzNFLG1DQUF3QztBQUN4Qyx1Q0FBMkQ7QUFVM0QsTUFBYSxRQUFRO0lBQXJCO1FBRUksYUFBUSxHQUFhLElBQUksbUJBQVEsRUFBRSxDQUFDO1FBQ3BDLFVBQUssR0FBYSxJQUFJLGdCQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLGVBQVUsR0FBVyxPQUFPLENBQUMsT0FBTyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDOUUsa0JBQWEsR0FBWSxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBMFJ2QyxDQUFDO0lBeFJHLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBbUI7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHlCQUFNLEVBQUUsQ0FBQztRQUUzQixJQUFJLE9BQU8sVUFBVSxJQUFJLFdBQVcsRUFBRTtZQUNsQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztTQUNoQztRQUVELE1BQU0sQ0FBQyxHQUFHLE1BQU0seUJBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksZ0JBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUFBLENBQUM7SUFFRixLQUFLLENBQUMsSUFBYTtRQUNmLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFO1lB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