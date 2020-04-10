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
        const filename = "C:\\Users\\admin\\Documents\\Coding\\vlang\\vex\\mime\\mime.v";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXhhbXBsZXMvbmF2aWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwQ0FBdUM7QUFDdkMsc0VBQXFDO0FBR3JDLEtBQUssVUFBVSxRQUFRO0lBQ25CLElBQUksUUFBa0IsQ0FBQztJQUV2QixJQUFJO1FBQ0EsTUFBTSx5QkFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3BCLFFBQVEsR0FBRyxNQUFNLG1CQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDdEM7SUFBQyxPQUFNLENBQUMsRUFBRTtRQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7WUFBUztRQUNOLE1BQU0sUUFBUSxHQUFHLCtEQUErRCxDQUFDO1FBRWpGLElBQUk7WUFDQSxNQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDakM7UUFBQyxPQUFNLENBQUMsRUFBRTtZQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7Z0JBQVM7WUFDTixNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BELElBQUksV0FBb0IsQ0FBQztZQUV6QixJQUFJO2dCQUNBLE1BQU0sUUFBUSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzFELFdBQVcsR0FBRyxNQUFNLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBRzdGLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDNUI7WUFBQyxPQUFNLENBQUMsRUFBRTtnQkFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2xCO1lBU0QsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FDbkY7S0FDSjtBQUNMLENBQUM7QUFFRCxRQUFRLEVBQUUsQ0FBQyJ9