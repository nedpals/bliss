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
const path = __importStar(require("path"));
const analyzer_1 = require("./analyzer");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let analyzer;
        let file = process.argv[2];
        try {
            yield web_tree_sitter_1.default.init();
        }
        catch (e) {
            console.log(e);
        }
        finally {
            analyzer = yield analyzer_1.Analyzer.create();
            const source = fs.readFileSync(path.join(__dirname, file), { encoding: 'utf-8' });
            yield analyzer.open(path.basename(file), source);
            fs.writeFileSync(path.join(__dirname, '../vdoc.md'), Object.entries(analyzer.typemap.getAll()).map(([k, v]) => {
                var _a;
                return `# ${k}\n\`\`\`v\n${v.signature}\n\`\`\`\n${_a = v.comment, (_a !== null && _a !== void 0 ? _a : '')}`;
            }).join('\n'), { encoding: 'utf-8' });
        }
    });
}
init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0VBQXFDO0FBQ3JDLHVDQUF5QjtBQUN6QiwyQ0FBNkI7QUFDN0IseUNBQXNDO0FBRXRDLFNBQWUsSUFBSTs7UUFDZixJQUFJLFFBQWtCLENBQUM7UUFDdkIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUzQixJQUFJO1lBQ0QsTUFBTSx5QkFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3RCO1FBQUMsT0FBTSxDQUFDLEVBQUU7WUFFUCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO2dCQUFTO1lBQ04sUUFBUSxHQUFHLE1BQU0sbUJBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNuQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDbEYsTUFBTSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFakQsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFOztnQkFDMUcsT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxhQUFhLEtBQUEsQ0FBQyxDQUFDLE9BQU8sdUNBQUksRUFBRSxDQUFBLEVBQUUsQ0FBQTtZQUN4RSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtTQUN4QztJQUNMLENBQUM7Q0FBQTtBQUVELElBQUksRUFBRSxDQUFDIn0=