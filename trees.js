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
function newTree(options, parser) {
    return __awaiter(this, void 0, void 0, function* () {
        let tree;
        if (typeof options.filepath !== "undefined" && typeof options.source === "undefined") {
            const source = yield util_1.promisify(fs.readFile)(path.resolve(options.filepath), { encoding: 'utf-8' });
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
    });
}
exports.newTree = newTree;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvdHJlZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMkNBQTZCO0FBQzdCLHVDQUF5QjtBQUN6QiwrQkFBaUM7QUFFcEIsUUFBQSxLQUFLLEdBQW1DLEVBQUUsQ0FBQztBQUV4RCxTQUFzQixPQUFPLENBQUMsT0FBeUYsRUFBRSxNQUFjOztRQUNuSSxJQUFJLElBQUksQ0FBQztRQUVULElBQUksT0FBTyxPQUFPLENBQUMsUUFBUSxLQUFLLFdBQVcsSUFBSSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQ2xGLE1BQU0sTUFBTSxHQUFHLE1BQU0sZ0JBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNuRyxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMvQjthQUFNO1lBQ0gsSUFBSSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEtBQUssV0FBVyxFQUFFO2dCQUN2QyxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDdkM7U0FDSjtRQUVELElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQzdCLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3BEO0lBQ0wsQ0FBQztDQUFBO0FBZkQsMEJBZUMifQ==