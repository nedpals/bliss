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
const imports_1 = require("./imports");
const trees_1 = require("./trees");
const types_1 = require("./types");
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
            const v = yield web_tree_sitter_1.default.Language.load(__dirname + '/src/tree-sitter-v.wasm');
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
                this.typemap.insertType(tree);
            });
            return -1;
        });
    }
}
exports.Analyzer = Analyzer;
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        let analyzer;
        try {
            yield web_tree_sitter_1.default.init();
        }
        catch (e) {
            console.log(e);
        }
        finally {
            analyzer = yield Analyzer.create();
            const source = `
        module main

        type Hello string

        struct Person {
            name string
            age string
        }

        /** this is a comment
        * @return something
        */
        pub fn (d Person) hello(name string) {
            print('Hello $name')
        }

        // cant lee
        // canledudebudebu
        // # Hello World!
        fn main() {
            hello := Hello{}
            woo := hello.world('hey')
        }
        `;
            yield analyzer.open('Untitled-1', source);
            console.log(analyzer.typemap.getAll());
        }
    });
}
init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBcUM7QUFFckMsdUNBQXFDO0FBQ3JDLG1DQUF5QztBQUN6QyxtQ0FBd0U7QUFXeEUsTUFBYSxRQUFRO0lBT2pCO1FBTkEsV0FBTSxHQUFXLElBQUkseUJBQU0sQ0FBQztRQUM1QixZQUFPLEdBQVksSUFBSSxlQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkMsVUFBSyxHQUFrQixFQUFFLENBQUM7UUFDMUIsVUFBSyxHQUFvQyxFQUFFLENBQUM7UUFDNUMsYUFBUSxHQUFhLElBQUksa0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV6QixDQUFDO0lBRVYsSUFBSTs7WUFDTixNQUFNLENBQUMsR0FBRyxNQUFNLHlCQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcseUJBQXlCLENBQUMsQ0FBQztZQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixDQUFDO0tBQUE7SUFBQSxDQUFDO0lBRUYsTUFBTSxDQUFPLE1BQU07O1lBQ2YsTUFBTSxFQUFFLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUMxQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUVoQixPQUFPLEVBQUUsQ0FBQztRQUNkLENBQUM7S0FBQTtJQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUF1QjtRQUMzQyxNQUFNLGFBQWEsR0FBRyw0QkFBb0IsQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDbEUsSUFBSSxPQUFPLGFBQWEsS0FBSyxXQUFXLEVBQUU7WUFBRSxPQUFPLE1BQU0sQ0FBQztTQUFFO1FBRzVELE1BQU0sV0FBVyxHQUFHLDRCQUFvQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUN4RixPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBRUssSUFBSSxDQUFDLFFBQWdCLEVBQUUsTUFBYzs7WUFDdkMsTUFBTSxlQUFPLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMzRCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLGFBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXpFLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUMzQixNQUFNLElBQUksR0FBRyxhQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO2dCQUMvQixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDZCxDQUFDO0tBQUE7Q0FDSjtBQTNDRCw0QkEyQ0M7QUFFRCxTQUFlLElBQUk7O1FBQ2YsSUFBSSxRQUFrQixDQUFDO1FBRXZCLElBQUk7WUFDRCxNQUFNLHlCQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDdEI7UUFBQyxPQUFNLENBQUMsRUFBRTtZQUVQLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7Z0JBQVM7WUFDTixRQUFRLEdBQUcsTUFBTSxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7WUFFbkMsTUFBTSxNQUFNLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQXdCZCxDQUFDO1lBRUYsTUFBTSxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUMxQztJQUNMLENBQUM7Q0FBQTtBQUVELElBQUksRUFBRSxDQUFDIn0=