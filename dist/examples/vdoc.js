"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const web_tree_sitter_1 = __importDefault(require("web-tree-sitter"));
const bliss_1 = require("../bliss");
async function vdoc(filepath) {
    var _a, _b, _c, _d;
    let analyzer;
    try {
        await web_tree_sitter_1.default.init();
    }
    catch (e) {
        console.log(e);
    }
    finally {
        analyzer = await bliss_1.Analyzer.create();
        await analyzer.open(filepath);
        console.log('[vdoc] Generating docs for \'' + analyzer.getModuleName(filepath) + '\'...');
        let modulePaths = await bliss_1.Importer.resolveModuleFilepaths(analyzer.getModuleName(filepath));
        const t = await analyzer.getTypeList(filepath, { includeModules: false });
        const fileContents = [];
        fileContents.push(`# ${analyzer.getModuleName(filepath)} module`);
        for (let file of modulePaths) {
            fileContents.push(`- ${path_1.basename(file)}`);
        }
        fileContents.push(`## Contents`);
        let modules = Object.keys(t);
        for (let mod of modules) {
            for (let type of Object.keys(t[mod])) {
                if (!bliss_1.isNodePublic(t[mod][type].node)) {
                    continue;
                }
                if ((type.includes('~') || type.startsWith('C.')) || ((_a = t[mod][type].parent) === null || _a === void 0 ? void 0 : _a.name.startsWith('C.'))) {
                    continue;
                }
                const linkName = mod + '.' + type;
                fileContents.push(`- [${linkName}](#${linkName.replace(/[^a-zA-Z_]/g, '').toLowerCase()})`);
            }
        }
        fileContents.push('\n## Documentation');
        for (let mod of modules) {
            let keywords = Object.keys(t[mod]);
            for (let i = 0; i < keywords.length; i++) {
                let type = keywords[i];
                let props = t[mod][type];
                if (!bliss_1.isNodePublic(props.node)) {
                    continue;
                }
                if ((type.includes('~') || type.startsWith('C.')) || ((_b = props.parent) === null || _b === void 0 ? void 0 : _b.name.startsWith('C.'))) {
                    continue;
                }
                const linkName = mod + '.' + type;
                fileContents.push('### ' + linkName);
                fileContents.push('```v\n' + bliss_1.buildSignature(props) + '\n```');
                if (((_d = (_c = t[mod][type].node) === null || _c === void 0 ? void 0 : _c.previousSibling) === null || _d === void 0 ? void 0 : _d.type) === "comment") {
                    fileContents.push(bliss_1.buildComment(props.node, true) + '\n');
                }
            }
        }
        fs_1.default.writeFileSync(path_1.join(process.cwd(), 'vdoc-examples', `vdoc-${analyzer.getModuleName(filepath)}.md`), fileContents.join('\n'), { encoding: 'utf-8' });
    }
}
exports.default = vdoc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmRvYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leGFtcGxlcy92ZG9jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLCtCQUFtRDtBQUNuRCxzRUFBcUM7QUFDckMsb0NBQTBGO0FBRzNFLEtBQUssVUFBVSxJQUFJLENBQUMsUUFBZ0I7O0lBQy9DLElBQUksUUFBUSxDQUFDO0lBRWIsSUFBSTtRQUNBLE1BQU0seUJBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN2QjtJQUFDLE9BQU0sQ0FBQyxFQUFFO1FBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQjtZQUFTO1FBQ04sUUFBUSxHQUFHLE1BQU0sZ0JBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNuQyxNQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQzFGLElBQUksV0FBVyxHQUFHLE1BQU0sZ0JBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDMUYsTUFBTSxDQUFDLEdBQUcsTUFBTSxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sWUFBWSxHQUFhLEVBQUUsQ0FBQztRQUVsQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFbEUsS0FBSyxJQUFJLElBQUksSUFBSSxXQUFXLEVBQUU7WUFDMUIsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLGVBQVEsQ0FBQyxJQUFJLENBQUMsRUFB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