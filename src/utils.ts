import { platform } from "process";

export const os_suffix: string[] = (() => {
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

export const exc_os_suffix: string[] = ['_win', '_windows', '_nix', '_lin', '_linux', '_mac', '_darwin', '_bsd', '_freebsd', '_solaris', '_haiku'].filter(s => !os_suffix.includes(s));
