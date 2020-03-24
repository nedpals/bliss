import { platform } from "process";

export const osSuffixes: string[] = (() => {
    let included: string[] = [];

    switch (platform) {
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

export const excludedOSSuffixes: string[] = [
    '_win', '_windows', '_nix', 
    '_lin', '_linux', 
    '_mac', '_darwin', 
    '_bsd', '_freebsd', 
    '_solaris', '_haiku'
].filter(s => !osSuffixes.includes(s));
