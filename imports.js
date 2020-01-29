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
const types_1 = require("./types");
exports.cached_trees = {};
function getImports(rootNode) {
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
exports.getImports = getImports;
function resolveImports(modules, parser) {
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
                const mods = yield getImports(exports.cached_trees[p].rootNode);
                const resolved = yield resolveImports(mods, parser);
                const resolved_modnames = resolved_modules.map(r => r.name);
                const moduleName = types_1.getCurrentModule(exports.cached_trees[p].rootNode);
                types_1.insertTypes(exports.cached_trees[p].rootNode, moduleName);
                resolved_modules = resolved_modules.concat(resolved.filter(r => !resolved_modnames.includes(r.name)));
            }
        }
        return resolved_modules;
    });
}
exports.resolveImports = resolveImports;
function getAndResolveImports(rootNode, parser) {
    return __awaiter(this, void 0, void 0, function* () {
        const mods = yield getImports(rootNode);
        return yield resolveImports(mods, parser);
    });
}
exports.default = getAndResolveImports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGdEQUF3QjtBQUN4QiwyQkFBbUM7QUFDbkMsMkNBQTZCO0FBQzdCLCtCQUFpQztBQUVqQyxtQ0FBd0M7QUFDeEMsbUNBQWtDO0FBQ2xDLG1DQUEyRTtBQUc5RCxRQUFBLFlBQVksR0FBbUMsRUFBRSxDQUFDO0FBRS9ELFNBQXNCLFVBQVUsQ0FBQyxRQUEyQjs7UUFDeEQsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO1FBRzdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzlCLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxvQkFBb0IsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7O1lBQ1gsTUFBTSxJQUFJLFNBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsMENBQUUsSUFBSSxDQUFDO1lBRWhFLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO2dCQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3RCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMzQjtRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7Q0FBQTtBQW5CRCxnQ0FtQkM7QUFFRCxTQUFzQixjQUFjLENBQUMsT0FBaUIsRUFBRSxNQUFjOztRQUNsRSxJQUFJLGdCQUFnQixHQUF3QyxFQUFFLENBQUM7UUFDL0QsSUFBSSwwQkFBMEIsR0FBOEIsRUFBRSxD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