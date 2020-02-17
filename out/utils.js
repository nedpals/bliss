"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
exports.os_suffix = (() => {
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
exports.exc_os_suffix = ['_win', '_windows', '_nix', '_lin', '_linux', '_mac', '_darwin', '_bsd', '_freebsd', '_solaris', '_haiku'].filter(s => !exports.os_suffix.includes(s));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBbUM7QUFFdEIsUUFBQSxTQUFTLEdBQWEsQ0FBQyxHQUFHLEVBQUU7SUFDckMsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFDO0lBRTVCLFFBQVEsa0JBQVEsRUFBRTtRQUNkLEtBQUssT0FBTztZQUNSLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDeEMsTUFBTTtRQUNWLEtBQUssU0FBUyxDQUFDO1FBQ2YsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLFNBQVM7WUFDVixRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDaEMsTUFBTTtRQUNWLEtBQUssUUFBUTtZQUNULFFBQVEsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvQixNQUFNO1FBQ1YsS0FBSyxPQUFPO1lBQ1IsUUFBUSxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLE1BQU07UUFDVixLQUFLLE9BQU87WUFDUixRQUFRLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QixNQUFNO1FBQ1Y7WUFDSSxNQUFNO0tBQ2I7SUFFRCxPQUFPLFFBQVEsQ0FBQztBQUNwQixDQUFDLENBQUMsRUFBRSxDQUFDO0FBRVEsUUFBQSxhQUFhLEdBQWEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxpQkFBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDIn0=