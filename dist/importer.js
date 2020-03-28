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
const analyzer_1 = require("./analyzer");
const which_1 = __importDefault(require("which"));
class Importer {
    constructor() {
        this.depGraph = {};
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
    static resolveModulePath(moduleName, excludeOSSuffixes = true) {
        return __awaiter(this, void 0, void 0, function* () {
            let resolved = [];
            const _module = moduleName.replace('.', '\\');
            const vPath = yield which_1.default('v');
            const importModulePaths = [
                path.join(path.dirname(vPath), 'vlib'),
                process.cwd(),
                path.join(process.cwd(), 'modules'),
                path.join(os_1.homedir(), '.vmodules')
            ];
            for (let p of importModulePaths) {
                if (resolved.length != 0) {
                    break;
                }
                let excludedFiles = `!(*_test|*_js|${utils_1.excludedOSSuffixes.map(o => '*' + o).join('|')}).v`;
                if (!excludeOSSuffixes) {
                    excludedFiles = `!(*_test|*_js).v`;
                }
                const modulePath = path.join(p, `@(${_module})`, excludedFiles);
                const matchedPaths = yield util_1.promisify(glob_1.default)(modulePath);
                if (matchedPaths.length >= 1) {
                    resolved = matchedPaths;
                }
            }
            return resolved;
        });
    }
    import(modules, analyzer) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let m of modules) {
                if (typeof this.depGraph[m] !== "undefined") {
                    continue;
                }
                let resolvedPaths = yield Importer.resolveModulePath(m);
                if (resolvedPaths.length == 0) {
                    continue;
                }
                for (let file of resolvedPaths) {
                    if (typeof this.depGraph[m] == "undefined" || this.depGraph[m].files.indexOf(file) == -1) {
                        yield analyzer.open(file);
                    }
                }
            }
        });
    }
    getAndResolve(filepath, analyzer) {
        return __awaiter(this, void 0, void 0, function* () {
            const tree = analyzer.trees.get(filepath);
            const rootNode = tree.rootNode;
            const resolvedModules = yield Importer.get(rootNode);
            const currentModuleName = analyzer_1.Analyzer.getModuleNameFromNode(rootNode);
            if (Object.keys(this.depGraph).indexOf(currentModuleName) == -1) {
                this.depGraph[currentModuleName] = {
                    files: [filepath],
                    dependencies: resolvedModules
                };
            }
            else {
                if (this.depGraph[currentModuleName].files.indexOf(filepath) == -1) {
                    this.depGraph[currentModuleName].files.push(filepath);
                }
                resolvedModules.forEach(mod => {
                    var _a, _b;
                    if (((_a = this.depGraph[currentModuleName].dependencies) === null || _a === void 0 ? void 0 : _a.indexOf(mod)) == -1) {
                        (_b = this.depGraph[currentModuleName].dependencies) === null || _b === void 0 ? void 0 : _b.push(mod);
                    }
                });
            }
            yield this.import(resolvedModules, analyzer);
        });
    }
}
exports.Importer = Importer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW1wb3J0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsZ0RBQXdCO0FBQ3hCLDJCQUE2QjtBQUM3QiwyQ0FBNkI7QUFDN0IsK0JBQWlDO0FBRWpDLG1DQUE2QztBQUM3Qyx5Q0FBc0M7QUFDdEMsa0RBQTBCO0FBVzFCLE1BQWEsUUFBUTtJQUFyQjtRQUNJLGFBQVEsR0FBYSxFQUFFLENBQUM7SUEySDVCLENBQUM7SUF6SEcsTUFBTSxDQUFPLEdBQUcsQ0FBQyxRQUEyQjs7WUFFeEMsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1lBRTdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUM5QixPQUFPLENBQUMsQ0FBQyxJQUFJLElBQUksb0JBQW9CLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFOztnQkFDWCxNQUFNLElBQUksU0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQywwQ0FBRSxJQUFJLENBQUM7Z0JBRWhFLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO29CQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN0QjtZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQzNCO1lBRUQsT0FBTyxPQUFPLENBQUM7UUFDbkIsQ0FBQztLQUFBO0lBRUQsTUFBTSxDQUFPLGlCQUFpQixDQUFDLFVBQWtCLEVBQUUsb0JBQTZCLElBQUk7O1lBQ2hGLElBQUksUUFBUSxHQUFhLEVB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