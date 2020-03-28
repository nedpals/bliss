"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
exports.osSuffixes = (() => {
    let included = [];
    switch (process_1.platform) {
        case 'win32':
            included = ['_win', '_windows', '_nix'];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBbUM7QUFJdEIsUUFBQSxVQUFVLEdBQWEsQ0FBQyxHQUFHLEVBQUU7SUFDdEMsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFDO0lBRTVCLFFBQVEsa0JBQVEsRUFBRTtRQUNkLEtBQUssT0FBTztZQUNSLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDeEMsTUFBTTtRQUNWLEtBQUssU0FBUyxDQUFDO1FBQ2YsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLFNBQVM7WUFDVixRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDaEMsTUFBTTtRQUNWLEtBQUssUUFBUTtZQUNULFFBQVEsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvQixNQUFNO1FBQ1YsS0FBSyxPQUFPO1lBQ1IsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLE1BQU07UUFDVixLQUFLLE9BQU87WUFDUixRQUFRLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QixNQUFNO1FBQ1Y7WUFDSSxNQUFNO0tBQ2I7SUFFRCxPQUFPLFFBQVEsQ0FBQztBQUNwQixDQUFDLENBQUMsRUFBRSxDQUFDO0FBRVEsUUFBQSxrQkFBa0IsR0FBYTtJQUN4QyxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU07SUFDMUIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsTUFBTSxFQUFFLFNBQVM7SUFDakIsTUFBTSxFQUFFLFVBQVU7SUFDbEIsVUFBVSxFQUFFLFFBQVE7Q0FDdkIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGtCQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFdkMsU0FBZ0IsWUFBWSxDQUFDLElBQXVCO0lBQ2hELE9BQU8sQ0FBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssYUFBYSxPQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUFGRCxvQ0FFQztBQUVELFNBQWdCLGlCQUFpQixDQUFDLEdBQVUsRUFBRSxJQUFnQjtJQUMxRCxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDakcsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO0lBRXJGLE9BQU8sU0FBUyxJQUFJLFNBQVMsQ0FBQztBQUNsQyxDQUFDO0FBTEQsOENBS0MifQ==