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
        if (moduleName === 'main')
            return moduleName;
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
    open(filepath, source) {
        let fp = utils_1.normalizePath(filepath);
        if (this.trees.has(fp))
            return;
        const _source = typeof source === "undefined" ? fs.readFileSync(fp, { encoding: 'utf-8' }) : source;
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
        const node = tree.rootNode;
        let isParent = false;
        let fromFn = false;
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
        const node = tree.rootNode;
        const generateSuggestions = (fp, modName) => {
            suggestions.setFile(fp);
            suggestions.setNode(this.trees.get(fp).rootNode);
            suggestions.moduleName = modName;
            suggestions.generate();
        };
        if (typeof this.importer.depGraph[moduleName] === 'undefined')
            return;
        let suggestions = new types_1.SymbolMap(filepath, node, false);
        if (includeModules) {
            const deps = this.importer.depGraph[moduleName].dependencies;
            for (const mod of deps.values()) {
                if (typeof this.importer.depGraph[mod] === 'undefined')
                    continue;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYW5hbHl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXlCO0FBQ3pCLCtCQUF5QztBQUV6QyxzRUFBcUM7QUFDckMseUNBQXNDO0FBQ3RDLG1DQUFtQztBQUNuQyxtQ0FBMkU7QUFDM0UsbUNBQXdDO0FBQ3hDLHVDQUEyRDtBQVUzRCxNQUFhLFFBQVE7SUFBckI7UUFFSSxhQUFRLEdBQWEsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFDcEMsVUFBSyxHQUFhLElBQUksZ0JBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsZUFBVSxHQUFXLE9BQU8sQ0FBQyxPQUFPLENBQUMsdUNBQXVDLENBQUMsQ0FBQztRQUM5RSxrQkFBYSxHQUFZLElBQUksR0FBRyxFQUFFLENBQUM7SUE2UnZDLENBQUM7SUEzUkcsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFtQjtRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUkseUJBQU0sRUFBRSxDQUFDO1FBRTNCLElBQUksT0FBTyxVQUFVLElBQUksV0FBVyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1NBQ2hDO1FBRUQsTUFBTSxDQUFDLEdBQUcsTUFBTSx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxnQkFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQUEsQ0FBQztJQUVGLEtBQUssQ0FBQyxJQUFhO1FBQ2YsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDNUIsSUFBSSxDQUFD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