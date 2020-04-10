import { sync as glob_sync } from "glob";
import { basename, dirname, join as path_join } from "path";
import which from "which";
import { Importer } from "../bliss";
import vdoc from './vdoc';

which('v')
    .then(vroot => {
        return path_join(dirname(vroot), 'vlib');
    })
    .then(vlib_path => {
        // console.log(vlib_path + '\\**\\*');
        console.log(glob_sync(vlib_path + '\\*'));

        return Promise.all(glob_sync(vlib_path + '\\**\\*').map(mod => {
            return Importer.resolveModuleFilepaths(basename(mod));
        }));
    })
    .then(modfiles => {
        const files = modfiles.map(mod => mod[0]).filter(Boolean);
        console.log(files);

        return Promise.all(files.map(f => vdoc(f)));
    })
    .then(() => {
        console.log('Success.');
    });