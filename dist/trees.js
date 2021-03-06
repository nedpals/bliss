"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const utils_1 = require("./utils");
class TreeList {
    constructor(parser) {
        this.trees = new Map();
        this.parser = parser;
    }
    new(filepath, source) {
        const parser = this.parser;
        const [dir, base] = TreeList.getTreePath(filepath);
        const tree = parser.parse(source);
        if (!this.trees.has(dir)) {
            this.trees.set(dir, new Map());
        }
        this.trees.get(dir).set(base, tree);
    }
    update(filepath, source, ...changes) {
        if (changes.length == 0)
            return;
        const old = this.get(filepath);
        const [dir, base] = TreeList.getTreePath(filepath);
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
        this.trees.get(dir).set(base, t);
    }
    has(filepath) {
        const [dir, base] = TreeList.getTreePath(filepath);
        return this.trees.has(dir) && this.trees.get(dir).has(base);
    }
    get(filepath) {
        const [dir, base] = TreeList.getTreePath(filepath);
        return this.trees.get(dir).get(base);
    }
    delete(filepath) {
        let [dir, base] = TreeList.getTreePath(filepath);
        this.trees.get(dir).delete(base);
        if (this.trees.get(dir).size === 0) {
            this.trees.delete(dir);
        }
    }
    static getTreePath(filepath) {
        let { dir, base } = path_1.parse(utils_1.normalizePath(filepath));
        if (dir.length == 0) {
            dir = '.';
        }
        return [dir, base];
    }
}
exports.TreeList = TreeList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHJlZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrQkFBMkM7QUFDM0MsbUNBQXdDO0FBaUJ4QyxNQUFhLFFBQVE7SUFJakIsWUFBWSxNQUFjO1FBSGxCLFVBQUssR0FBZ0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUluQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRUQsR0FBRyxDQUFDLFFBQWdCLEVBQUUsTUFBYztRQUNoQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWxDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQWdCLEVBQUUsTUFBYyxFQUFFLEdBQUcsT0FBeUI7UUFDakUsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUM7WUFBRSxPQUFPO1FBQ2hDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRW5ELEtBQUssTUFBTSxDQUFDLElBQUksT0FBTyxFQUFFO1lBQ3JCLEdBQUcsQ0FBQyxJQUFJLENBQUM7Z0JBQ0wsVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVO2dCQUN4QixhQUFhLEVBQUUsQ0FBQyxDQUFDLFFBQVE7Z0JBQ3pCLFdBQVcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVE7Z0JBQzNCLGNBQWMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07Z0JBQzVCLFdBQVcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVE7Z0JBQzNCLGNBQWMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07YUFDL0IsQ0FBQyxDQUFDO1NBQ047UUFDRCxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsR0FBRyxDQUFDLFFBQWdCO1FBQ2hCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVuRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsR0FBRyxDQUFDLFFBQWdCO1FBQ2hCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVuRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQWdCO1FBQ25CLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzFCO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBZ0I7UUFDL0IsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxZQUFVLENBQUMscUJBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDO1NBQUU7UUFFbkMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2QixDQUFDO0NBQ0o7QUFsRUQsNEJBa0VDIn0=