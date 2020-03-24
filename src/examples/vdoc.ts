import { Analyzer } from '../analyzer';
import Parser from "web-tree-sitter";
import { basename, join as path_join } from "path";
import fs from "fs";
import { buildComment, buildFnSignature } from '../signatures';

async function vdoc() {
    let analyzer;

    try {
        await Parser.init();
    } catch(e) {
        console.log(e);
    } finally {
        analyzer = await Analyzer.create();
        const filepath = String.raw`C:\Users\admin\Documents\Coding\v\vlib\os\os.v`;
        await analyzer.open(filepath);

        const t = await analyzer.getTypeList(filepath, { modules: false });
        const fileContents: string[] = [];
        
        fileContents.push(`# ${basename(filepath)}\n## Contents`);
        let modules = Object.keys(t);

        for (let mod of modules) {
            for (let type of Object.keys(t[mod])) {
                if (type.includes('~') || type.startsWith('C.')) { continue; }
                const linkName = mod + '.' + type;

                fileContents.push(`- [${linkName}](#${linkName})`);
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
                    let signature = 'struct ' + type + ' {\n';

                    // fields
                    keywords.filter(kw => t[mod][kw].parent?.name == type && t[mod][kw].type != 'function')
                        .forEach(kw => {
                            signature += `    ${kw.substring((type + '.').length)}  ${t[mod][kw].type}\n`;
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

        fs.writeFileSync(path_join(process.cwd(), 'vdoc-os.md'), fileContents.join('\n'), { encoding: 'utf-8' });
    }
}

vdoc();