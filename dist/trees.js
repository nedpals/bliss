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
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
class TreeList {
    constructor(parser) {
        this.trees = {};
        this.parser = parser;
    }
    new(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let tree;
            const parser = this.parser;
            const treePaths = TreeList.getTreePath(input.filepath);
            const dir = treePaths[0];
            const base = treePaths[1];
            if (typeof input.source != "undefined") {
                tree = parser.parse(input.source);
            }
            if (typeof tree !== "undefined") {
                if (Object.keys(this.trees).indexOf(dir) == -1) {
                    this.trees[dir] = {};
                }
                this.trees[dir][base] = tree;
            }
        });
    }
    update(filepath, source, ...changes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (changes.length == 0)
                return;
            const old = this.get(filepath);
            const treePaths = TreeList.getTreePath(filepath);
            const dir = treePaths[0];
            const base = treePaths[1];
            for (const c of changes) {
                old.edit({
                    startIndex: c.startIndex,
                    startPosition: c.startPos,
                    oldEndIndex: c.old.endIndex,
                    oldEndPosition: c.old.endPos,
                    newEndIndex: c.new.endIndex,
                    newEndPosition: c.new.endPos
                });
            }
            const t = this.parser.parse(source, old);
            this.trees[dir][base] = t;
        });
    }
    get(filepath) {
        const treePaths = TreeList.getTreePath(filepath);
        const dir = treePaths[0];
        const base = treePaths[1];
        return this.trees[dir][base];
    }
    static getTreePath(filepath) {
        let { dir, base } = path_1.parse(filepath);
        if (dir.length == 0) {
            dir = '.';
        }
        return [dir, base];
    }
}
exports.TreeList = TreeList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHJlZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSwrQkFBMkM7QUFxQjNDLE1BQWEsUUFBUTtJQUlqQixZQUFZLE1BQWM7UUFIbEIsVUFBSyxHQUFnQixFQUFFLENBQUM7UUFJNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVLLEdBQUcsQ0FBQyxLQUEyQzs7WUFDakQsSUFBSSxJQUFJLENBQUM7WUFFVCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzNCLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sR0FBRyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFMUIsSUFBSSxPQUFPLEtBQUssQ0FBQyxNQUFNLElBQUksV0FBVyxFQUFFO2dCQUNwQyxJQUFJLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDckM7WUFFRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsRUFBRTtnQkFDN0IsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7b0JBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUN4QjtnQkFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQzthQUNoQztRQUNMLENBQUM7S0FBQTtJQUVLLE1BQU0sQ0FBQyxRQUFnQixFQUFFLE1BQWMsRUFBRSxHQUFHLE9BQXlCOztZQUN2RSxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQztnQkFBRSxPQUFPO1lBQ2hDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0IsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqRCxNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTFCLEtBQUssTUFBTSxDQUFDLElBQUksT0FBTyxFQUFFO2dCQVdyQixHQUFHLENBQUMsSUFBSSxDQUFDO29CQUNMLFVBQVUsRUFBRSxDQUFDLENBQUMsVUFBVTtvQkFDeEIsYUFBYSxFQUFFLENBQUMsQ0FBQyxRQUFRO29CQUN6QixXQUFXLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRO29CQUMzQixjQUFjLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNO29CQUM1QixXQUFXLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRO29CQUMzQixjQUFjLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNO2lCQUMvQixDQUFDLENBQUM7YUFDTjtZQUNELE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixDQUFDO0tBQUE7SUFFRCxHQUFHLENBQUMsUUFBZ0I7UUFDaEIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxNQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekIsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFnQjtRQUMvQixJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLFlBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQztTQUFFO1FBRW5DLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkIsQ0FBQztDQUNKO0FBMUVELDRCQTBFQyJ9