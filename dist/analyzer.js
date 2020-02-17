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
const path = __importStar(require("path"));
const imports_1 = require("./imports");
const trees_1 = require("./trees");
const types_1 = require("./types");
const symbols_1 = require("./symbols");
class Analyzer {
    constructor() {
        this.parser = new web_tree_sitter_1.default;
        this.typemap = new types_1.TypeMap('');
        this.files = {};
        this.trees = {};
        this.importer = new imports_1.Importer(this);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const v = yield web_tree_sitter_1.default.Language.load(path.join(__dirname, '..', '/src/tree-sitter-v.wasm'));
            this.parser.setLanguage(v);
        });
    }
    ;
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            const an = new Analyzer();
            yield an.init();
            return an;
        });
    }
    static getCurrentModule(node) {
        const module_clause = types_1.filterChildrenByType(node, 'module_clause');
        if (typeof module_clause === "undefined") {
            return 'main';
        }
        const module_name = types_1.filterChildrenByType(module_clause[0], 'module_identifier')[0].text;
        return module_name;
    }
    open(filename, source) {
        return __awaiter(this, void 0, void 0, function* () {
            yield trees_1.newTree({ filepath: filename, source }, this.parser);
            yield this.importer.getAndResolve(trees_1.trees[filename].rootNode, this.parser);
            Object.keys(trees_1.trees).forEach(p => {
                const tree = trees_1.trees[p].rootNode;
                const moduleName = Analyzer.getCurrentModule(tree);
                this.typemap.setModuleName(moduleName);
                this.typemap.insertTypeFromTree(tree);
            });
            return -1;
        });
    }
    generateSymbols(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const tree = trees_1.trees[filename].rootNode;
            const typemap = new types_1.TypeMap(Analyzer.getCurrentModule(tree));
            typemap.insertTypeFromTree(tree);
            return Object.keys(typemap.getAll()).map(id => {
                const type = typemap.get(id);
                return {
                    name: id,
                    detail: type.signature,
                    kind: symbols_1.SymbolKind.Variable,
                    range: {
                        start: { line: type.range.start[0], character: type.range.start[1] },
                        end: { line: type.range.end[0], character: type.range.end[1] },
                    },
                    selectionRange: {
                        start: { line: type.range.start[0], character: type.range.start[1] },
                        end: { line: type.range.end[0], character: type.range.end[1] },
                    }
                };
            });
        });
    }
}
exports.Analyzer = Analyzer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5hbHl6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYW5hbHl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXFDO0FBQ3JDLDJDQUE2QjtBQUU3Qix1Q0FBcUM7QUFDckMsbUNBQXlDO0FBQ3pDLG1DQUF3RTtBQUN4RSx1Q0FBdUM7QUFZdkMsTUFBYSxRQUFRO0lBQXJCO1FBQ0ksV0FBTSxHQUFXLElBQUkseUJBQU0sQ0FBQztRQUM1QixZQUFPLEdBQVksSUFBSSxlQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkMsVUFBSyxHQUFrQixFQUFFLENBQUM7UUFDMUIsVUFBSyxHQUFvQyxFQUFFLENBQUM7UUFDNUMsYUFBUSxHQUFhLElBQUksa0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQTZENUMsQ0FBQztJQTNEUyxJQUFJOztZQUNOLE1BQU0sQ0FBQyxHQUFHLE1BQU0seUJBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7WUFDNUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQztLQUFBO0lBQUEsQ0FBQztJQUVGLE1BQU0sQ0FBTyxNQUFNOztZQUNmLE1BQU0sRUFBRSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7WUFDMUIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFaEIsT0FBTyxFQUFFLENBQUM7UUFDZCxDQUFDO0tBQUE7SUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBdUI7UUFDM0MsTUFBTSxhQUFhLEdBQUcsNEJBQW9CLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ2xFLElBQUksT0FBTyxhQUFhLEtBQUssV0FBVyxFQUFFO1lBQUUsT0FBTyxNQUFNLENB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