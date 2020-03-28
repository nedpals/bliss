"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../analyzer");
const types_1 = require("../types");
const web_tree_sitter_1 = __importDefault(require("web-tree-sitter"));
function getLocal(filepath, node, analyzer) {
    return __awaiter(this, void 0, void 0, function* () {
        let parentNode = node;
        let isParent = false;
        let localTypemap = new types_1.TypeMap(filepath, parentNode);
        localTypemap.generate(true);
        let list = localTypemap.getAll();
        const globalTypemap = yield analyzer.getTypeList(filepath);
        while (!isParent) {
            if (['struct', 'struct_declaration'].includes(parentNode.type)) {
                parentNode = parentNode.parent;
                continue;
            }
            if (['expression_list', 'identifier', 'short_var_declaration'].includes(parentNode.type)) {
                parentNode = parentNode.parent;
                continue;
            }
            if (['enum', 'enum_declaration'].includes(parentNode.type)) {
                parentNode = parentNode.parent;
                continue;
            }
            if (['const', 'const_declaration'].includes(parentNode.type)) {
                parentNode = parentNode.parent;
                continue;
            }
            if (['block', 'source_file'].includes(parentNode.type)) {
                isParent = true;
                localTypemap.setNode(parentNode);
                localTypemap.generate();
                list = Object.assign(Object.assign({}, list), localTypemap.getAll());
                continue;
            }
            isParent = true;
            break;
        }
        Object.keys(localTypemap.getAll()[localTypemap.moduleName]).forEach(typName => {
            const origType = localTypemap.get(typName).returnType;
            if (typeof globalTypemap[localTypemap.moduleName][origType] !== "undefined") {
                localTypemap.insertParent(typName, globalTypemap[localTypemap.moduleName][origType]);
            }
        });
        return { list };
    });
}
function navigate() {
    return __awaiter(this, void 0, void 0, function* () {
        let analyzer;
        try {
            yield web_tree_sitter_1.default.init();
        }
        catch (e) {
            console.log(e);
        }
        finally {
            analyzer = yield analyzer_1.Analyzer.create();
            const source = `
        module main

        const (
            name = 'Ned'
            age = 18
        )

        enum PersonType {
            regular
            alien
            executive
        }

        struct Person {
            name string
            age int
            typ PersonType
        }

        interface Speaker {
            say_hello() string
        }

        fn (p Person) say_hello() {
            println('Hello, $name! You are $age years old.')
        }

        fn main() {
            three := 1+3
            person := Person{'Ned', 19}
            person.say_hello()
        }
        `;
            const filename = 'hello.v';
            try {
                yield analyzer.open(filename, source);
            }
            catch (e) {
                console.log(e);
            }
            finally {
                const moduleName = analyzer.getModuleName(filename);
                const typelist = yield analyzer.getTypeList(filename, {
                    includeModules: false,
                    pos: { row: 28, column: 8 }
                });
                console.log(typelist);
            }
        }
    });
}
navigate();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXhhbXBsZXMvbmF2aWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBdUM7QUFFdkMsb0NBQTBEO0FBRTFELHNFQUFxRDtBQUVyRCxTQUFlLFFBQVEsQ0FBQyxRQUFnQixFQUFFLElBQWdCLEVBQUUsUUFBa0I7O1FBQzFFLElBQUksVUFBVSxHQUFlLElBQUksQ0FBQztRQUNsQyxJQUFJLFFBQVEsR0FBWSxLQUFLLENBQUM7UUFDOUIsSUFBSSxZQUFZLEdBQUcsSUFBSSxlQUFPLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3JELFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pDLE1BQU0sYUFBYSxHQUFHLE1BQU0sUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUzRCxPQUFPLENBQUMsUUFBUSxFQUFFO1lBSWQsSUFBSSxDQUFDLFFBQVEsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzVELFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBb0IsQ0FBQztnQkFDN0MsU0FBUzthQUNaO1lBR0QsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFlBQVksRUFBRSx1QkFBdUIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3RGLFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBb0IsQ0FBQztnQkFDN0MsU0FBUzthQUNaO1lBR0QsSUFBSSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3hELFVBQVUsR0FBRyxVQUFVLENBQUMsTUFB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