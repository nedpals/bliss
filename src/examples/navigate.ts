import { Analyzer } from "../analyzer";
import Parser from "web-tree-sitter";
import { Symbols } from "../bliss";

async function navigate() {
    let analyzer: Analyzer;

    try {
        await Parser.init();
        analyzer = await Analyzer.create();
    } catch(e) {
        console.log(e);
    } finally {
        const filename = "C:\\Users\\admin\\Documents\\Coding\\vlang\\vex\\mime\\mime.v";

        try {
            await analyzer.open(filename);
        } catch(e) {
            console.log(e);
        } finally {
            const moduleName = analyzer.getModuleName(filename);
            let suggestions: Symbols;
            // console.log(analyzer.importer.depGraph);
            try {
                await analyzer.getGlobalSuggestions(filename, true, true);
                suggestions = await analyzer.getLocalSuggestions(filename, { pos: { row: 54, column: 37 } });
                // console.log(analyzer.cachedSymbols.get('builtin').get('string'));
                // console.dir(analyzer.cachedSymbols);
                console.log(suggestions);
            } catch(e) {
                console.log(e);
            }
            // console.log(analyzer.importer.depGraph); 

            // console.log(analyzer.cachedSymbols['api'].get('Vpkg').children.get('run'));

            // console.log(analyzer.trees.get(filename).rootNode.descendantForPosition({ row: 12, column: 8 }).type);
            // console.log(analyzer.cachedSymbols['builtin'].keys());
            // console.log(analyzer.cachedTypes['main']);
            // console.dir(analyzer.cachedSymbols.get('builtin'));
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        }
    }
}

navigate();