import Parser from "web-tree-sitter";
import { basename, join as path_join } from "path";
import fs from "fs";
import { 
    Analyzer,
    Importer,
    isNodePublic,
    buildComment, 
    buildFnSignature, 
    buildStructSignature, 
    buildEnumSignature
} from '../bliss';


async function vdoc(filepath: string) {
    let analyzer;

    try {
        await Parser.init();
    } catch(e) {
        console.log(e);
    } finally {
        analyzer = await Analyzer.create();
        await analyzer.open(filepath);

        console.log('[vdoc] Generating docs for \'' + analyzer.getModuleName(filepath) + '\'...');
        let modulePaths = await Importer.resolveModulePath(analyzer.getModuleName(filepath));
        const t = await analyzer.getTypeList(filepath, { includeModules: false });
        const fileContents: string[] = [];

        fileContents.push(`# ${analyzer.getModuleName(filepath)} module`);
        
        for (let file of modulePaths) {
            fileContents.push(`- ${basename(file)}`);
        }

        fileContents.push(`## Contents`);

        let modules = Object.keys(t);

        for (let mod of modules) {
            for (let type of Object.keys(t[mod])) {
                if (!isNodePublic(t[mod][type].node as Parser.SyntaxNode)) { continue; }
                if ((type.includes('~') || type.startsWith('C.')) || t[mod][type].parent?.name.startsWith('C.')) { continue; }
                const linkName = mod + '.' + type;

                fileContents.push(`- [${linkName}](#${linkName.replace(/[^a-zA-Z_]/g, '').toLowerCase()})`);
            }
        }

        fileContents.push('\n## Documentation');

        for (let mod of modules) {
            let keywords = Object.keys(t[mod]);

            for (let i = 0; i < keywords.length; i++) {
                let type = keywords[i];
                let props = t[mod][type];
                if (!isNodePublic(props.node as Parser.SyntaxNode)) { continue; }
                if ((type.includes('~') || type.startsWith('C.')) || props.parent?.name.startsWith('C.')) { continue; }
                const linkName = mod + '.' + type;
                
                fileContents.push('### ' + linkName);
                fileContents.push('```v');
                if (props.type == 'function' || props.type == 'method') {
                    fileContents.push(buildFnSignature(props.node as Parser.SyntaxNode));
                }

                if (props.type == 'struct') {
                    fileContents.push(buildStructSignature(props.node as Parser.SyntaxNode));
                }

                if (props.type == 'enum') {
                    fileContents.push(buildEnumSignature(props.node as Parser.SyntaxNode));
                }
                fileContents.push('```');

                if (t[mod][type].node?.previousSibling?.type === "comment") {
                    fileContents.push(buildComment(props.node as Parser.SyntaxNode, true) + '\n');
                }
            }
        }

        fs.writeFileSync(path_join(process.cwd(), 'vdoc-examples', `vdoc-${analyzer.getModuleName(filepath)}.md`), fileContents.join('\n'), { encoding: 'utf-8' });
    }
}

['readline/readline.v', 'term/term.v', 'time/time.v', 'strconv/atoi.v', 'regex/regex.v', 'math/math.v', 'flag/flag.v', 'os/os.v', 'sqlite/sqlite.v', 'fontstash/fontstash.v'].forEach(j => {
    vdoc(path_join(String.raw`C:\Users\admin\Documents\Coding\v\vlib`, j))
        .then(() => {});
});
