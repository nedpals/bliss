"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_tree_sitter_1 = __importDefault(require("web-tree-sitter"));
const imports_1 = __importDefault(require("./imports"));
const trees_1 = require("./trees");
const types_1 = require("./types");
async function init() {
    await web_tree_sitter_1.default.init();
    const parser = new web_tree_sitter_1.default;
    const v = await web_tree_sitter_1.default.Language.load(__dirname + '/src/tree-sitter-v.wasm');
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
        name := 'Ned'
        println('Hello World!')
    }
    `;
    await trees_1.newTree({ filepath: 'Untitled-1', source }, parser);
    await imports_1.default(trees_1.trees['Untitled-1'].rootNode, parser);
    Object.keys(trees_1.trees).forEach(p => {
        var _a;
        const tree = trees_1.trees[p].rootNode;
        (_a = tree.children) === null || _a === void 0 ? void 0 : _a.forEach(n => {
            types_1.declare(n);
        });
    });
    console.log(types_1.typesmap);
}
init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzRUFBcUM7QUFFckMsd0RBQTZDO0FBQzdDLG1DQUF5QztBQUN6QyxtQ0FBOEQ7QUFHOUQsS0FBSyxVQUFVLElBQUk7SUFFZixNQUFNLHlCQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7SUFFcEIsTUFBTSxNQUFNLEdBQUcsSUFBSSx5QkFBTSxDQUFDO0lBQzFCLE1BQU0sQ0FBQyxHQUFHLE1BQU0seUJBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEIsTUFBTSxNQUFNLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBMEJkLENBQUM7SUFFRixNQUFNLGVBQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUQsTUFBTSxpQkFBb0IsQ0FBQyxhQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRWpFLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFOztRQUMzQixNQUFNLElBQUksR0FBRyxhQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1FBQy9CLE1BQUEsSUFBSSxDQUFDLFFBQVEsMENBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3ZCLGVBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVmLENBQUMsRUFBRTtJQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBUSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUNELElBQUksRUFBRSxDQUFDIn0=