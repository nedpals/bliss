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
const imports_1 = __importDefault(require("./imports"));
const trees_1 = require("./trees");
const types_1 = require("./types");
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield web_tree_sitter_1.default.init();
        const parser = new web_tree_sitter_1.default;
        const v = yield web_tree_sitter_1.default.Language.load(__dirname + '/src/tree-sitter-v.wasm');
        parser.setLanguage(v);
        const source = `
    module main

    import log

    type Hello string

    struct Person {
        name string
        age string
    }

    /** this is a comment
    * @return something
    */
    pub fn (d Dog) hello(name string) {
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
        yield trees_1.newTree({ filepath: 'Untitled-1', source }, parser);
        yield imports_1.default(trees_1.trees['Untitled-1'].rootNode, parser);
        Object.keys(trees_1.trees).forEach(p => {
            const tree = trees_1.trees[p].rootNode;
            const moduleName = types_1.getCurrentModule(tree);
            types_1.insertTypes(tree, moduleName);
        });
        console.log(types_1.typesmap);
    });
}
init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzRUFBcUM7QUFFckMsd0RBQTZDO0FBQzdDLG1DQUF5QztBQUN6QyxtQ0FBb0Y7QUFrQnBGLFNBQWUsSUFBSTs7UUFFZixNQUFNLHlCQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFcEIsTUFBTSxNQUFNLEdBQUcsSUFBSSx5QkFBTSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxHQUFHLE1BQU0seUJBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdEIsTUFBTSxNQUFNLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBMEJkLENBQUM7UUFFRixNQUFNLGVBQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDMUQsTUFBTSxpQkFBb0IsQ0FBQyxhQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWpFLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzNCLE1BQU0sSUFBSSxHQUFHLGFBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFDL0IsTUFBTSxVQUFVLEdBQUcsd0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsbUJBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFRLENBQUMsQ0FBQztJQUMxQixDQUFDO0NBQUE7QUFDRCxJQUFJLEVBQUUsQ0FBQyJ9