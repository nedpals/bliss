import { Analyzer } from '../analyzer';
import Parser from "web-tree-sitter";
import { basename, join as path_join } from "path";
import fs from "fs";
import { buildComment, buildFnSignature } from '../signatures';
import { Importer } from '../importer';

async function vdoc(filepath: string) {
    let analyzer;

    try {
        await Parser.init();
    } catch(e) {
        console.log(e);
    } finally {
        analyzer = await Analyzer.create();
        await analyzer.open(filepath);

        console.log('[vdoc] Generating docs for ' + filepath + '...');

        let modulePaths = await Importer.resolveModulePath(Analyzer.getCurrentModule(analyzer.getTree(filepath).rootNode));
        const t = await analyzer.getTypeList(filepath, { modules: false });
        const fileContents: string[] = [];

        fileContents.push(`# ${basename(filepath)}`);
        
        for (let file of modulePaths) {
            fileContents.push(`- ${basename(file)}`);
        }

        fileContents.push(`## Contents`);

        let modules = Object.keys(t);

        for (let mod of modules) {
            for (let type of Object.keys(t[mod])) {
                if ((type.includes('~') || type.startsWith('C.')) || (t[mod][type].parent?.name.startsWith('C.') || (t[mod][type].type != 'function' && typeof t[mod][type].parent != "undefined"))) { continue; }
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
                if ((type.includes('~') || type.startsWith('C.')) || (t[mod][type].parent?.name.startsWith('C.') || (t[mod][type].type != 'function' && typeof t[mod][type].parent != "undefined"))) { continue; }
                const linkName = mod + '.' + type;
                
                fileContents.push('### ' + linkName);
                fileContents.push('```v');
                if (props.type == 'function') {
                    fileContents.push(buildFnSignature(t[mod][type].node as Parser.SyntaxNode));
                }

                if (props.type == 'struct') {
                    let signature = 'pub struct ' + type + ' {\n';

                    // fields
                    keywords.filter(kw => t[mod][kw].parent?.name == type && t[mod][kw].type != 'function')
                        .forEach(kw => {
                            signature += `    ${kw.substring((type + '.').length)}  ${t[mod][kw].type}\n`;
                        });

                    signature += '}';    

                    fileContents.push(signature);
                }

                if (props.type == 'enum') {
                    let signature = 'pub enum ' + type + ' {\n';

                    // fields
                    keywords.filter(kw => t[mod][kw].parent?.name == type && t[mod][kw].type === 'enum_value')
                        .forEach(kw => {
                            signature += `    ${kw.substring((type + '.').length)}\n`;
                        });

                    signature += '}';    

                    fileContents.push(signature);
                }
                fileContents.push('```');

                if (t[mod][type].node?.previousSibling?.type === "comment") {
                    fileContents.push(buildComment(t[mod][type].node as Parser.SyntaxNode, true) + '\n');
                }
            }
        }

        fs.writeFileSync(path_join(process.cwd(), 'vdoc-examples', `vdoc-${Analyzer.getCurrentModule(analyzer.getTree(filepath).rootNode)}.md`), fileContents.join('\n'), { encoding: 'utf-8' });
    }
}

['readline/readline.v', 'term/term.v', 'time/time.v', 'strconv/atoi.v', 'regex/regex.v', 'math/math.v', 'flag/flag.v', 'os/os.v', 'sqlite/sqlite.v', 'fontstash/fontstash.v'].forEach(j => {
    vdoc(path_join(String.raw`C:\Users\admin\Documents\Coding\v\vlib`, j))
        .then(() => {});
});
