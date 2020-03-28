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
Object.defineProperty(exports, "__esModule", { value: true });
const web_tree_sitter_1 = __importDefault(require("web-tree-sitter"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const bliss_1 = require("../bliss");
function vdoc(filepath) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        let analyzer;
        try {
            yield web_tree_sitter_1.default.init();
        }
        catch (e) {
            console.log(e);
        }
        finally {
            analyzer = yield bliss_1.Analyzer.create();
            yield analyzer.open(filepath);
            console.log('[vdoc] Generating docs for \'' + analyzer.getModuleName(filepath) + '\'...');
            let modulePaths = yield bliss_1.Importer.resolveModulePath(analyzer.getModuleName(filepath));
            const t = yield analyzer.getTypeList(filepath, { includeModules: false });
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
                    fileContents.push('```v');
                    if (props.type == 'function' || props.type == 'method') {
                        fileContents.push(bliss_1.buildFnSignature(props.node));
                    }
                    if (props.type == 'struct') {
                        fileContents.push(bliss_1.buildStructSignature(props.node));
                    }
                    if (props.type == 'enum') {
                        fileContents.push(bliss_1.buildEnumSignature(props.node));
                    }
                    fileContents.push('```');
                    if (((_d = (_c = t[mod][type].node) === null || _c === void 0 ? void 0 : _c.previousSibling) === null || _d === void 0 ? void 0 : _d.type) === "comment") {
                        fileContents.push(bliss_1.buildComment(props.node, true) + '\n');
                    }
                }
            }
            fs_1.default.writeFileSync(path_1.join(process.cwd(), 'vdoc-examples', `vdoc-${analyzer.getModuleName(filepath)}.md`), fileContents.join('\n'), { encoding: 'utf-8' });
        }
    });
}
['readline/readline.v', 'term/term.v', 'time/time.v', 'strconv/atoi.v', 'regex/regex.v', 'math/math.v', 'flag/flag.v', 'os/os.v', 'sqlite/sqlite.v', 'fontstash/fontstash.v'].forEach(j => {
    vdoc(path_1.join(String.raw `C:\Users\admin\Documents\Coding\v\vlib`, j))
        .then(() => { });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmRvYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leGFtcGxlcy92ZG9jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXFDO0FBQ3JDLCtCQUFtRDtBQUNuRCw0Q0FBb0I7QUFDcEIsb0NBUWtCO0FBR2xCLFNBQWUsSUFBSSxDQUFDLFFBQWdCOzs7UUFDaEMsSUFBSSxRQUFRLENBQUM7UUFFYixJQUFJO1lBQ0EsTUFBTSx5QkFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3ZCO1FBQUMsT0FBTSxDQUFDLEVBQUU7WUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO2dCQUFTO1lBQ04sUUFBUSxHQUFHLE1BQU0sZ0JBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNuQyxNQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1lBQzFGLElBQUksV0FBVyxHQUFHLE1BQU0sZ0JBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDckYsTUFBTSxDQUFDLEdBQUcsTUFBTSxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQzFFLE1BQU0sWUFBWSxHQUFhLEVBQUUsQ0FBQztZQUVsQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFbEUsS0FBSyxJQUFJLElBQUksSUFBSSxXQUFXLEVBQUU7Z0JBQzFCLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxlQUFRLENBQUMsSUFBSSxD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