"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_tree_sitter_1 = __importDefault(require("web-tree-sitter"));
const fs = __importStar(require("fs"));
const util_1 = require("util");
const importer_1 = require("./importer");
const trees_1 = require("./trees");
const types_1 = require("./types");
const signatures_1 = require("./signatures");
const utils_1 = require("./utils");
class Analyzer {
    constructor() {
        this.importer = new importer_1.Importer();
        this.trees = new trees_1.TreeList(this.parser);
        this.parserPath = require.resolve('tree-sitter-v/wasm/tree-sitter-v.wasm');
    }
    init(parserPath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.parser = new web_tree_sitter_1.default();
            if (typeof parserPath != 'undefined') {
                this.parserPath = parserPath;
            }
            const v = yield web_tree_sitter_1.default.Language.load(this.parserPath);
            this.parser.setLanguage(v);
            this.trees = new trees_1.TreeList(this.parser);
        });
    }
    ;
    static create(parserPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const an = new Analyzer();
            yield an.init(parserPath);
            return an;
        });
    }
    getModuleName(filepath) {
        const tree = this.trees.get(filepath);
        return Analyzer.getModuleNameFromTree(tree);
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
        return __awaiter(this, void 0, void 0, function* () {
            const _source = typeof source == "undefined" ? yield util_1.promisify(fs.readFile)(filepath, { encoding: 'utf-8' }) : source;
            try {
                yield this.trees.new({ filepath, source: _source });
                yield this.importer.getAndResolve(filepath, this);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    provideInfo(filepath, pos, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const typelists = yield this.getTypeList(filepath, { includeModules: false, pos });
            const treePath = (path) => {
                const paths = path.split('.');
                return { parent: paths[0], child: paths[1] };
            };
            if (typelists !== {}) {
                let selectedChildName;
                for (let s of Object.keys(typelists[this.getModuleName(filepath)])) {
                    const childName = Object.keys(typelists[this.getModuleName(filepath)][s].children).find(c => {
                        const child = typelists[this.getModuleName(filepath)][c];
                        return c === name || utils_1.isPositionAtRange(pos, child.node);
                    });
                    if (typeof childName !== 'undefined') {
                        selectedChildName = `${s}.${childName || name}`;
                        console.log(selectedChildName);
                        break;
                    }
                }
                const selectedChild = (() => {
                    const { parent, child } = treePath(selectedChildName);
                    return typelists[this.getModuleName(filepath)][parent].children[child];
                })();
                const selected = typelists[this.getModuleName(filepath)][name] || selectedChild;
                return {
                    name,
                    comment: signatures_1.buildComment(selected.node, true),
                    prop: selected,
                    returnType: selected.returnType,
                    signature: signatures_1.buildSignature(selected)
                };
            }
            switch (name) {
                case 'fn': return { name, comment: 'A string.' };
                case 'pub': return { name, comment: 'Exposed to the public.' };
                case 'i8':
                case 'i16':
                case 'i64':
                case 'int': return { name, comment: 'An integer.' };
                case 'rune': return { name, comment: 'A rune.' };
                case 'byte': return { name, comment: 'A byte.' };
                case 'u16':
                case 'u32': return { name, comment: 'An unsigned integer.' };
                default: return { name, comment: 'Unknown' };
            }
        });
    }
    getTypeList(filepath, options = { includeModules: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            let generatedTypeLists = {};
            const tree = this.trees.get(filepath);
            const moduleName = Analyzer.getModuleNameFromTree(tree);
            let node = tree.rootNode;
            let typemap = new types_1.TypeMap(filepath, node);
            typemap.generate();
            if (options.includeModules) {
                for (let mod of this.importer.depGraph[moduleName].dependencies) {
                    const modFiles = this.importer.depGraph[mod].files;
                    for (let modFilepath of modFiles) {
                        const modTree = this.trees.get(modFilepath);
                        let modTypemap = new types_1.TypeMap(modFilepath, modTree.rootNode);
                        modTypemap.generate();
                        generatedTypeLists = Object.assign(Object.assign({}, generatedTypeLists), modTypemap.getAll());
                    }
                }
            }
            if (typeof options.pos !== 'undefined') {
                let parentNode = node.descendantForPosition(options.pos);
                let isParent = false;
                let list = typemap.getAll();
                let locals = new types_1.TypeMap(filepath, node);
                while (!isParent) {
                    console.log(parentNode.type);
                    if (['struct', 'struct_declaration'].includes(parentNode.type)) {
                        parentNode = parentNode.parent;
                        continue;
                    }
                    if (['expression_list', 'identifier', 'short_var_declaration'].includes(parentNode.type)) {
                        parentNode = parentNode.parent;
                        continue;
                    }
                    if (['fn', 'enum', 'enum_declaration'].includes(parentNode.type)) {
                        parentNode = parentNode.parent;
                        continue;
                    }
                    if (parentNode.type == 'function_declaration') {
                        parentNode = parentNode.childForFieldName('body');
                        continue;
                    }
                    if (['const', 'const_declaration'].includes(parentNode.type)) {
                        parentNode = parentNode.parent;
                        continue;
                    }
                    if (['block', 'source_file'].includes(parentNode.type)) {
                        isParent = true;
                        locals.setNode(parentNode);
                        locals.generate();
                        list = Object.assign(Object.assign({}, list), locals.getAll());
                        continue;
                    }
                    isParent = true;
                    break;
                }
                Object.keys(locals.getAll()[locals.moduleName]).forEach(typName => {
                    const origType = locals.get(typName).returnType;
                    if (typeof typemap.getAll()[locals.moduleName][origType] !== "undefined") {
                        locals.insertParent(typName, typemap.getAll()[locals.moduleName][origType]);
                    }
                });
                generatedTypeLists = Object.assign(Object.assign({}, generatedTypeLists), list);
            }
            else {
                generatedTypeLists = Object.assign(Object.assign({}, generatedTypeLists), typemap.getAll());
            }
            return generatedTypeLists;
        });
    }
}
exports.Analyzer = Analyzer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYW5hbHl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXFDO0FBQ3JDLHVDQUF5QjtBQUN6QiwrQkFBaUM7QUFFakMseUNBQXNDO0FBQ3RDLG1DQUFtQztBQUNuQyxtQ0FBK0U7QUFDL0UsNkNBQTREO0FBQzVELG1DQUE0QztBQVU1QyxNQUFhLFFBQVE7SUFBckI7UUFFSSxhQUFRLEdBQWEsSUFBSSxtQkFBUSxFQUFFLENBQUM7UUFDcEMsVUFBSyxHQUFhLElBQUksZ0JBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsZUFBVSxHQUFXLE9BQU8sQ0FBQyxPQUFPLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQStNbEYsQ0FBQztJQTdNUyxJQUFJLENBQUMsVUFBbUI7O1lBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx5QkFBTSxFQUFFLENBQUM7WUFFM0IsSUFBSSxPQUFPLFVBQVUsSUFBSSxXQUFXLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO2FBQ2hDO1lBRUQsTUFBTSxDQUFDLEdBQUcsTUFBTSx5QkFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxnQkFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQyxDQUFDO0tBQUE7SUFBQSxDQUFDO0lBRUYsTUFBTSxDQUFPLE1BQU0sQ0FBQyxVQUFtQjs7WUFDbkMsTUFBTSxFQUFFLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUMxQixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENB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