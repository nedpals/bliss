"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const slash_1 = __importDefault(require("slash"));
exports.osSuffixes = (() => {
    let included = [];
    switch (process_1.platform) {
        case 'win32':
            included = ['_windows', '_nix'];
            break;
        case 'freebsd':
        case 'netbsd':
        case 'openbsd':
            included = ['_bsd', '_freebsd'];
            break;
        case 'darwin':
            included = ['_darwin', '_mac'];
            break;
        case 'linux':
            included = ['_lin', '_linux'];
            break;
        case 'sunos':
            included = ['_solaris'];
            break;
        default:
            break;
    }
    return included;
})();
exports.excludedOSSuffixes = [
    '_win', '_windows', '_nix',
    '_lin', '_linux',
    '_mac', '_darwin',
    '_bsd', '_freebsd',
    '_solaris', '_haiku'
].filter(s => !exports.osSuffixes.includes(s));
function isNodePublic(node) {
    return (node === null || node === void 0 ? void 0 : node.children.findIndex(x => x.type === "pub_keyword")) !== -1;
}
exports.isNodePublic = isNodePublic;
function isPositionAtRange(pos, node) {
    const withinCol = pos.column > node.startPosition.column && pos.column < node.endPosition.column;
    const withinRow = pos.row > node.startPosition.row && pos.row < node.endPosition.row;
    return withinCol && withinRow;
}
exports.isPositionAtRange = isPositionAtRange;
function normalizePath(filepath) {
    let newFilepath = slash_1.default(filepath);
    if (filepath.substring(0, 2).endsWith(':')) {
        newFilepath = newFilepath.substring(0, 2).toUpperCase() + newFilepath.substring(2);
    }
    return newFilepath;
}
exports.normalizePath = normalizePath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxQ0FBbUM7QUFFbkMsa0RBQTBCO0FBRWIsUUFBQSxVQUFVLEdBQWEsQ0FBQyxHQUFHLEVBQUU7SUFDdEMsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFDO0lBRTVCLFFBQVEsa0JBQVEsRUFBRTtRQUNkLEtBQUssT0FBTztZQUNSLFFBQVEsR0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNoQyxNQUFNO1FBQ1YsS0FBSyxTQUFTLENBQUM7UUFDZixLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssU0FBUztZQUNWLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNoQyxNQUFNO1FBQ1YsS0FBSyxRQUFRO1lBQ1QsUUFBUSxHQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQy9CLE1BQU07UUFDVixLQUFLLE9BQU87WUFDUixRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDOUIsTUFBTTtRQUNWLEtBQUssT0FBTztZQUNSLFFBQVEsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hCLE1BQU07UUFDVjtZQUNJLE1BQU07S0FDYjtJQUVELE9BQU8sUUFBUSxDQUFDO0FBQ3BCLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFUSxRQUFBLGtCQUFrQixHQUFhO0lBQ3hDLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTTtJQUMxQixNQUFNLEVBQUUsUUFBUTtJQUNoQixNQUFNLEVBQUUsU0FBUztJQUNqQixNQUFNLEVBQUUsVUFBVTtJQUNsQixVQUFVLEVBQUUsUUFBUTtDQUN2QixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUV2QyxTQUFnQixZQUFZLENBQUMsSUFBdUI7SUFDaEQsT0FBTyxDQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxhQUFhLE9BQU0sQ0FBQyxDQUFDLENBQUM7QUFDMUUsQ0FBQztBQUZELG9DQUVDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQUMsR0FBVSxFQUFFLElBQWdCO0lBQzFELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQUNqRyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7SUFFckYsT0FBTyxTQUFTLElBQUksU0FBUyxDQUFDO0FBQ2xDLENBQUM7QUFMRCw4Q0FLQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxRQUFnQjtJQUMxQyxJQUFJLFdBQVcsR0FBRyxlQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbEMsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEMsV0FBVyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEY7SUFFRCxPQUFPLFdBQVcsQ0FBQztBQUN2QixDQUFDO0FBUkQsc0NBUUMifQ==