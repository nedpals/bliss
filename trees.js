"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const util_1 = require("util");
exports.trees = {};
async function newTree(options, parser) {
    let tree;
    if (typeof options.filepath !== "undefined" && typeof options.source === "undefined") {
        const source = await util_1.promisify(fs.readFile)(path.resolve(options.filepath), { encoding: 'utf-8' });
        tree = parser.parse(source);
    }
    else {
        if (typeof options.source !== "undefined") {
            tree = parser.parse(options.source);
        }
    }
    if (typeof tree !== "undefined") {
        (options.tree || exports.trees)[options.filepath] = tree;
    }
}
exports.newTree = newTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvdHJlZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ0EsMkNBQTZCO0FBQzdCLHVDQUF5QjtBQUN6QiwrQkFBaUM7QUFFcEIsUUFBQSxLQUFLLEdBQW1DLEVBQUUsQ0FBQztBQUVqRCxLQUFLLFVBQVUsT0FBTyxDQUFDLE9BQXlGLEVBQUUsTUFBYztJQUNuSSxJQUFJLElBQUksQ0FBQztJQUVULElBQUksT0FBTyxPQUFPLENBQUMsUUFBUSxLQUFLLFdBQVcsSUFBSSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEtBQUssV0FBVyxFQUFFO1FBQ2xGLE1BQU0sTUFBTSxHQUFHLE1BQU0sZ0JBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNuRyxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMvQjtTQUFNO1FBQ0gsSUFBSSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQ3ZDLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2QztLQUNKO0lBRUQsSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXLEVBQUU7UUFDN0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLGFBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDcEQ7QUFDTCxDQUFDO0FBZkQsMEJBZUMifQ==