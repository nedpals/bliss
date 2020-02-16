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
const glob_1 = __importDefault(require("glob"));
const os_1 = require("os");
const path = __importStar(require("path"));
const util_1 = require("util");
const utils_1 = require("./utils");
const trees_1 = require("./trees");
const index_1 = require("./index");
exports.cached_trees = {};
class Importer {
    constructor(analyzer) {
        this.analyzer = analyzer;
    }
    static get(rootNode) {
        return __awaiter(this, void 0, void 0, function* () {
            const modules = [];
            rootNode.namedChildren.filter(x => {
                return x.type == 'import_declaration';
            }).forEach(x => {
                var _a;
                const name = (_a = x.namedChildren[0].childForFieldName('path')) === null || _a === void 0 ? void 0 : _a.text;
                if (typeof name !== "undefined") {
                    modules.push(name);
                }
            });
            if (modules.indexOf('builtin') === -1) {
                modules.push('builtin');
            }
            return modules;
        });
    }
    resolve(modules, parser) {
        return __awaiter(this, void 0, void 0, function* () {
            let resolved_modules = [];
            let resolved_imports_filepaths = {};
            const paths = [
                String.raw `C:\Users\admin\Documents\Coding\v\vlib`,
                __dirname,
                path.join(__dirname, 'modules'),
                path.join(os_1.homedir(), '.vmodules')
            ];
            for (let m of modules) {
                const mod = m.replace('.', '\\');
                let found;
                for (let p of paths) {
                    if (typeof found !== "undefined") {
                        break;
                    }
                    const modpath = path.join(p, `@(${mod})`, `!(*_test|${utils_1.exc_os_suffix.map(o => '*' + o).join('|')}).v`);
                    const matches = yield util_1.promisify(glob_1.default)(modpath);
                    if (matches.length >= 1) {
                        found = matches;
                        if (Object.keys(resolved_imports_filepaths).indexOf(mod) !== -1) {
                            continue;
                        }
                        resolved_imports_filepaths[mod] = found;
                        resolved_modules.push({ name: mod, files: found });
                    }
                }
                if (typeof found === "undefined") {
                    console.log(`Module ${mod}: not found.`);
                }
            }
            for (let modfiles of Object.keys(resolved_imports_filepaths)) {
                for (let p of resolved_imports_filepaths[modfiles]) {
                    if (Object.keys(exports.cached_trees).indexOf(p) !== -1) {
                        continue;
                    }
                    yield trees_1.newTree({ filepath: p, tree: exports.cached_trees }, parser);
                    const mods = yield Importer.get(exports.cached_trees[p].rootNode);
                    const resolved = yield this.resolve(mods, parser);
                    const resolved_modnames = resolved_modules.map(r => r.name);
                    const moduleName = index_1.Analyzer.getCurrentModule(exports.cached_trees[p].rootNode);
                    this.analyzer.typemap.setModuleName(moduleName);
                    yield this.analyzer.typemap.insertType(exports.cached_trees[p].rootNode);
                    resolved_modules = resolved_modules.concat(resolved.filter(r => !resolved_modnames.includes(r.name)));
                }
            }
            return resolved_modules;
        });
    }
    getAndResolve(rootNode, parser) {
        return __awaiter(this, void 0, void 0, function* () {
            const mods = yield Importer.get(rootNode);
            return yield this.resolve(mods, parser);
        });
    }
}
exports.Importer = Importer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGdEQUF3QjtBQUN4QiwyQkFBNkI7QUFDN0IsMkNBQTZCO0FBQzdCLCtCQUFpQztBQUVqQyxtQ0FBd0M7QUFDeEMsbUNBQWtDO0FBQ2xDLG1DQUFtQztBQUd0QixRQUFBLFlBQVksR0FBbUMsRUFBRSxDQUFDO0FBRS9ELE1BQWEsUUFBUTtJQUdqQixZQUFZLFFBQWtCO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxNQUFNLENBQU8sR0FBRyxDQUFDLFFBQTJCOztZQUN4QyxNQUFNLE9BQU8sR0FBYSxFQUFFLENBQUM7WUFFN0IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQzlCLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxvQkFBb0IsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7O2dCQUNYLE1BQU0sSUFBSSxTQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLDBDQUFFLElBQUksQ0FBQztnQkFFaEUsSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXLEVBQUU7b0JBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3RCO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDM0I7WUFFRCxPQUFPLE9BQU8sQ0FBQztRQUNuQixDQUFDO0tBQUE7SUFFSyxPQUFPLENBQUMsT0FBaUIsRUFBRSxN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