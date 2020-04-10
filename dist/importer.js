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
    static async resolveModuleFilepaths(moduleName, excludeOSSuffixes = true, paths = []) {
        let resolved = [];
        const _module = moduleName.split('.');
        const vPath = await which_1.default('v');
        let importModulePaths = [
            ...paths,
            process.cwd(),
            path.join(process.cwd(), 'modules'),
            path.join(path.dirname(vPath), 'vlib'),
            path.join(os_1.homedir(), '.vmodules')
        ];
        for (let i = 0; i < importModulePaths.length; i++) {
            const p = importModulePaths[i];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW1wb3J0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0EsZ0RBQXdCO0FBQ3hCLDJCQUE2QjtBQUM3QiwyQ0FBNkI7QUFDN0IsK0JBQWlDO0FBRWpDLG1DQUE0RDtBQUU1RCxrREFBMEI7QUFXMUIsTUFBYSxRQUFRO0lBQXJCO1FBQ0ksYUFBUSxHQUFhLEVBQUUsQ0FBQztJQWlKNUIsQ0FBQztJQS9JRyxjQUFjLENBQUMsSUFBWTtRQUN2QixLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDN0IsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFBRSxPQUFPLEdBQUcsQ0FBQztTQUN0QztRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUEyQjs7UUFFeEMsTUFBTSxPQUFPLEdBQWdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFFdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLG9CQUFvQjtnQkFBRSxTQUFTO1lBQ2xELE1BQU0sSUFBSSxTQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLDBDQUFFLElBQUksQ0FBQztZQUNwRSxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVc7Z0JBQUUsU0FBUztZQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxDQUFDLE9B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