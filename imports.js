"use strict";
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
async function getImports(rootNode) {
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
}
exports.getImports = getImports;
async function resolveImports(modules, parser) {
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
            const matches = await util_1.promisify(glob_1.default)(modpath);
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
            await trees_1.newTree({ filepath: p, tree: exports.cached_trees }, parser);
            const mods = await getImports(exports.cached_trees[p].rootNode);
            const resolved = await resolveImports(mods, parser);
            const resolved_modnames = resolved_modules.map(r => r.name);
            for (let c of exports.cached_trees[p].rootNode.children) {
                if (c.type.length <= 1) {
                    continue;
                }
                types_1.declare(c);
            }
            resolved_modules = resolved_modules.concat(resolved.filter(r => !resolved_modnames.includes(r.name)));
        }
    }
    return resolved_modules;
}
exports.resolveImports = resolveImports;
async function getAndResolveImports(rootNode, parser) {
    const mods = await getImports(rootNode);
    return await resolveImports(mods, parser);
}
exports.default = getAndResolveImports;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUNBLGdEQUF3QjtBQUN4QiwyQkFBbUM7QUFDbkMsMkNBQTZCO0FBQzdCLCtCQUFpQztBQUVqQyxtQ0FBd0M7QUFDeEMsbUNBQWtDO0FBQ2xDLG1DQUFrQztBQUdyQixRQUFBLFlBQVksR0FBbUMsRUFBRSxDQUFDO0FBRXhELEtBQUssVUFBVSxVQUFVLENBQUMsUUFBMkI7SUFDeEQsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDO0lBRzdCLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzlCLE9BQU8sQ0FBQyxDQUFDLElBQUksSUFBSSxvQkFBb0IsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7O1FBQ1gsTUFBTSxJQUFJLFNBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsMENBQUUsSUFBSSxDQUFDO1FBRWhFLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEI7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzNCO0lBRUQsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQW5CRCxnQ0FtQkM7QUFFTSxLQUFLLFVBQVUsY0FBYyxDQUFDLE9BQWlCLEVBQUUsTUFBYztJQUNsRSxJQUFJLGdCQUFnQixHQUF3QyxFQUFFLENBQUM7SUFDL0QsSUFBSSwwQkFBMEIsR0FBOEIsRUFBRSxDQUFDO0lBRS9E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