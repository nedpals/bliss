import fs from "fs";
import { basename, join as path_join } from "path";
import Parser from "web-tree-sitter";
import { Analyzer, buildComment, buildSignature, Importer, isNodePublic } from '../bliss';


export default async function vdoc(filepath: string) {
    let analyzer;

    try {
        await Parser.init();
    } catch(e) {
        console.log(e);
    } finally {
        analyzer = await Analyzer.create();
        await analyzer.open(filepath);

        console.log('[vdoc] Generating docs for \'' + analyzer.getModuleName(filepath) + '\'...');
        let modulePaths = await Importer.resolveModuleFilepaths(analyzer.getModuleName(filepath));
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
                fileContents.push('```v\n' + buildSignature(props) + '\n```');

                if (t[mod][type].node?.previousSibling?.type === "comment") {
                    fileContents.push(buildComment(props.node as Parser.SyntaxNode, true) + '\n');
                }
            }
        }

        fs.writeFileSync(path_join(process.cwd(), 'vdoc-examples', `vdoc-${analyzer.getModuleName(filepath)}.md`), fileContents.join('\n'), { encoding: 'utf-8' });
    }
}

