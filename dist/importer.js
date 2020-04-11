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
const which_1 = __importDefault(require("which"));
const slash_1 = __importDefault(require("slash"));
class Importer {
    constructor() {
        this.depGraph = {};
    }
    findModuleName(name) {
        for (const mod in this.depGraph) {
            if (mod.includes(name))
                return mod;
        }
        return name;
    }
    static async get(rootNode) {
        var _a;
        const modules = new Set();
        for (let i = 0; i < rootNode.namedChildren.length; i++) {
            const child = rootNode.namedChildren[i];
            if (child.type !== 'import_declaration')
                continue;
            const name = (_a = child.namedChildren[0].childForFieldName('path')) === null || _a === void 0 ? void 0 : _a.text;
            if (typeof name === "undefined")
                continue;
            modules.add(name);
        }
        if (!modules.has('builtin'))
            modules.add('builtin');
        return modules;
    }
    static async importModulePaths(additionalPaths = []) {
        const vPath = await which_1.default('v');
        const importModulePaths = [
            ...additionalPaths,
            process.cwd(),
            path.join(process.cwd(), 'modules'),
            path.join(path.dirname(vPath), 'vlib'),
            path.join(os_1.homedir(), '.vmodules')
        ];
        return importModulePaths;
    }
    static async resolveModuleFilepaths(moduleName, excludeOSSuffixes = true, paths = []) {
        let resolved = [];
        const _module = moduleName.split('.');
        const importModulePaths = await Importer.importModulePaths();
        for (let i = 0; i < importModulePaths.length; i++) {
            const p = slash_1.default(importModulePaths[i]);
            const excludedFiles = (() => {
                const prefixes = ['*_test', '*_js'];
                if (excludeOSSuffixes)
                    prefixes.push(...utils_1.excludedOSSuffixes.map(o => '*' + o));
                return `!(${prefixes.join('|')}).v`;
            })();
            const matchedPaths = await util_1.promisify(glob_1.default)(path.join(p, ..._module, excludedFiles));
            if (matchedPaths.length >= 1)
                resolved = matchedPaths;
            if (resolved.length !== 0)
                break;
        }
        return resolved;
    }
    static async resolveFromFilepath(filepath, excludeOSSuffixes = true) {
        let resolved = [];
        let fp = utils_1.normalizePath(filepath);
        const base = path.dirname(fp);
        const excludedFiles = (() => {
            const prefixes = ['*_test', '*_js', path.basename(fp, '.v')];
            if (excludeOSSuffixes)
                prefixes.push(...utils_1.excludedOSSuffixes.map(o => '*' + o));
            return `!(${prefixes.join('|')}).v`;
        })();
        const modulePath = path.join(base, excludedFiles);
        const matchedPaths = await util_1.promisify(glob_1.default)(modulePath);
        if (matchedPaths.length >= 1) {
            resolved = matchedPaths;
        }
        return resolved;
    }
    async import(modules, analyzer, paths = []) {
        for (let m of modules.values()) {
            if (typeof this.depGraph[m] !== "undefined")
                continue;
            const resolvedPaths = await (async () => {
                const unique = [];
                try {
                    const filepaths = await Importer.resolveModuleFilepaths(m, true, paths);
                    if (filepaths.length == 0)
                        return unique;
                    for (const file of filepaths) {
                        if (analyzer.trees.has(file))
                            continue;
                        unique.push(analyzer.open(file));
                    }
                }
                catch (e) {
                    console.error(e);
                }
                return unique;
            })();
            if (resolvedPaths.length === 0)
                continue;
            await Promise.all(resolvedPaths);
        }
    }
    static async getOtherFiles(filepath, analyzer) {
        const relatedFiles = await Importer.resolveFromFilepath(filepath);
        const toBeResolved = new Map();
        for (let i = 0; i < relatedFiles.length; i++) {
            if (analyzer.trees.has(relatedFiles[i]))
                continue;
            toBeResolved.set(relatedFiles[i], analyzer.open(relatedFiles[i]));
        }
        await Promise.all(toBeResolved.values());
        return Array.from(toBeResolved.keys());
    }
    async getAndResolve(filepath, analyzer) {
        const fp = utils_1.normalizePath(filepath);
        const tree = analyzer.trees.get(fp);
        const rootNode = tree.rootNode;
        const currentModuleName = await analyzer.getFullModuleName(fp);
        if (typeof this.depGraph[currentModuleName] !== "undefined" && this.depGraph[currentModuleName].files.has(fp))
            return;
        const resolvedModules = await Importer.get(rootNode);
        if (typeof this.depGraph[currentModuleName] === "undefined") {
            this.depGraph[currentModuleName] = { files: new Set(), dependencies: new Set() };
        }
        this.depGraph[currentModuleName].files.add(fp);
        for (const mod of resolvedModules.values()) {
            if (this.depGraph[currentModuleName].dependencies.has(mod))
                continue;
            this.depGraph[currentModuleName].dependencies.add(mod);
        }
        await Importer.getOtherFiles(fp, analyzer);
        await this.import(resolvedModules, analyzer, [path.dirname(filepath), path.dirname(path.dirname(filepath))]);
    }
}
exports.Importer = Importer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW1wb3J0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsZ0RBQXdCO0FBQ3hCLDJCQUE2QjtBQUM3QiwyQ0FBNkI7QUFDN0IsK0JBQWlDO0FBRWpDLG1DQUE0RDtBQUU1RCxrREFBMEI7QUFDMUIsa0RBQTBCO0FBVzFCLE1BQWEsUUFBUTtJQUFyQjtRQUNJLGFBQVEsR0FBYSxFQUFFLENBQUM7SUF1SjVCLENBQUM7SUFySkcsY0FBYyxDQUFDLElBQVk7UUFDdkIsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQzdCLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQUUsT0FBTyxHQUFHLENBQUM7U0FDdEM7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBMkI7O1FBRXhDLE1BQU0sT0FBTyxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRXZDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxvQkFBb0I7Z0JBQUUsU0FBUztZQUNsRCxNQUFNLElBQUksU0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQywwQ0FBRSxJQUFJLENBQUM7WUFDcEUsSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXO2dCQUFFLFNBQVM7WUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyQjtRQUVE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