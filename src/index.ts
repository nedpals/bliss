import Parser from "web-tree-sitter";
import * as fs from "fs";
import * as path from "path";
import { Analyzer } from "./analyzer";

async function init() {
    let analyzer: Analyzer;
    let file = process.argv[2];

    try {
       await Parser.init();
    } catch(e) {
        //@ts-ignore
        console.log(e);
    } finally {
        analyzer = await Analyzer.create();
        const source = fs.readFileSync(path.join(__dirname, file), { encoding: 'utf-8' });
        await analyzer.open(path.basename(file), source);

        fs.writeFileSync(path.join(__dirname, '../vdoc.md'), Object.entries(analyzer.typemap.getAll()).map(([k, v]) => {
            return `# ${k}\n\`\`\`v\n${v.signature}\n\`\`\`\n${v.comment ?? ''}`
        }).join('\n'), { encoding: 'utf-8' })
    }
}

init();