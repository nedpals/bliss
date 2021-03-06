"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../analyzer");
const web_tree_sitter_1 = __importDefault(require("web-tree-sitter"));
async function navigate() {
    let analyzer;
    try {
        await web_tree_sitter_1.default.init();
        analyzer = await analyzer_1.Analyzer.create();
    }
    catch (e) {
        console.log(e);
    }
    finally {
        const filename = "C:\\Users\\admin\\Documents\\Coding\\vlang\\vex\\picoserver\\middleware.v";
        try {
            await analyzer.open(filename);
        }
        catch (e) {
            console.log(e);
        }
        finally {
            const moduleName = analyzer.getModuleName(filename);
            let suggestions;
            try {
                await analyzer.getGlobalSuggestions(filename, true, true);
                suggestions = await analyzer.getLocalSuggestions(filename, { pos: { row: 54, column: 37 } });
                console.dir(analyzer.cachedSymbols);
                console.log(suggestions);
            }
            catch (e) {
                console.log(e);
            }
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
        }
    }
}
navigate();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXhhbXBsZXMvbmF2aWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwQ0FBdUM7QUFDdkMsc0VBQXFDO0FBR3JDLEtBQUssVUFBVSxRQUFRO0lBQ25CLElBQUksUUFBa0IsQ0FBQztJQUV2QixJQUFJO1FBQ0EsTUFBTSx5QkFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLFFBQVEsR0FBRyxNQUFNLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDdEM7SUFBQyxPQUFNLENBQUMsRUFBRTtRQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7WUFBUztRQUNOLE1BQU0sUUFBUSxHQUFHLDJFQUEyRSxDQUFDO1FBRTdGLElBQUk7WUFDQSxNQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDakM7UUFBQyxPQUFNLENBQUMsRUFBRTtZQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7Z0JBQVM7WUFDTixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BELElBQUksV0FBb0IsQ0FBQztZQUV6QixJQUFJO2dCQUNBLE1BQU0sUUFBUSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzFELFdBQVcsR0FBRyxNQUFNLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBRTdGLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQzVCO1lBQUMsT0FBTSxDQUFDLEVBQUU7Z0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNsQjtZQVNELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztZQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDO1NBQ25GO0tBQ0o7QUFDTCxDQUFDO0FBRUQsUUFBUSxFQUFFLENBQUMifQ==