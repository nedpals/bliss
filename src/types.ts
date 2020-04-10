import Parser, { SyntaxNode } from "web-tree-sitter";
import { buildFnSignature } from "./signatures";
import { Analyzer } from "./analyzer";
import { SymbolKind, CompletionItemKind } from "./symbols";
import { normalizePath } from "./utils";

export type Symbols = Map<string, Map<string, Symbol>>;

interface ParsedSymbol {
    name: string,
    sym: Symbol
}

export class Symbol {
    name: string;
    file: string;
    type: string;
    children: Map<string, Symbol> = new Map();
    parent: Symbol;
    node: Parser.SyntaxNode;
    returnType: string;
    symbolKind: SymbolKind;
    completionItemKind: CompletionItemKind;
    module: string;
    isMut: boolean = false;
    isPublic: boolean = false;

    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }
}

export class SymbolMap {
    private node: Parser.SyntaxNode;
    private filepath: string;
    symbols: Symbols = new Map();
    moduleName: string;
    
    constructor(filepath: string, node: Parser.SyntaxNode, autogenerate: boolean = true) {
        this.filepath = normalizePath(filepath);
        this.node = node;
        this.moduleName = Analyzer.getModuleNameFromNode(this.node.tree.rootNode);
        if (autogenerate) this.generate();
    }

    has = (moduleName: string): boolean => this.symbols.has(moduleName);
    setNode(node: Parser.SyntaxNode) { this.node = node; }
    setFile(filepath: string) { this.filepath = filepath; }
    get = (key: string): Symbol => this.symbols.get(this.moduleName).get(key);
    getFrom = (moduleName: string): Map<string, Symbol> => this.symbols.get(moduleName);
    getAll = (): Symbols => this.symbols;
    set = (key: string, sym: Symbol) => { this.symbols.get(this.moduleName).set(key, sym); }
    insertParent = (key: string, sym: Symbol) => { this.symbols.get(this.moduleName).get(key).parent = sym; }
 
    register({ name, sym }: ParsedSymbol): void {    
        sym.file = this.filepath;
        sym.module = this.moduleName;

        if (!this.symbols.has(this.moduleName)) {
            this.symbols.set(this.moduleName, new Map());
        }

        this.set(name, sym);
    }

    registerChild(pSym: ParsedSymbol, parent: string) {
        this.registerChildToProp(pSym, this.symbols.get(this.moduleName).get(parent));
    }

    registerChildToProp({name, sym}: ParsedSymbol, parent: Symbol) {
        sym.file = this.filepath;
        sym.module = this.moduleName;
        parent.children.set(name, sym);
    }

    getPublicSymbols(except?: string): Symbols {
        const filtered: Symbols = new Map();

        for (const moduleName of this.symbols.keys()) {
            filtered.set(moduleName, moduleName === except ? this.symbols.get(moduleName) : new Map());
            if (moduleName === except) continue; 
            for (const sym of this.symbols.get(moduleName)) {
                if (!sym[1].isPublic) continue;
                filtered.get(moduleName).set(...sym);
            }
        }

        return filtered;
    }

    generate(exclude: string[] = []): void {
        for (let i = 0; i < this.node.children.length; i++) {
            const node = this.node.children[i];

            switch (node.type) {
                case 'interface_declaration':
                    if (exclude.includes('interface')) continue;
                    const iface = this.parseInterface(node);
                    const iFaceMethods = this.parseInterfaceMethods(iface);
                    for (let i = 0; i < iFaceMethods.length; i++) {
                        iFaceMethods[i].sym.file = this.filepath;
                        iFaceMethods[i].sym.module = this.moduleName;
                        const params = this.parseFunctionParameters(iFaceMethods[i]);
                        for (let j = 0; i < params.length; j++) {
                            iFaceMethods[i].sym.children.set(params[j].name, params[j].sym);
                            this.registerChildToProp(params[j], iface.sym);
                        }
                    }
                    this.register(iface); break;
                case 'const_declaration':
                    if (exclude.includes('constant')) continue;
                    const constants = this.parseConstants(node);
                    for (let i = 0; i < constants.length; i++) {
                        this.register(constants[i]);
                    }
                    break;
                case 'type_declaration':
                    if (exclude.includes('typedef')) continue;
                    this.register(this.parseTypedef(node)); break;
                case 'short_var_declaration':
                    if (exclude.includes('variable')) continue;
                    this.register(this.parseVariable(node)); break;
                case 'struct_declaration':
                    if (exclude.includes('struct')) continue;
                    const struct = this.parseStruct(node);
                    const structMethods = this.parseStructFields(struct);
                    for (let i = 0; i < structMethods.length; i++) {
                        this.registerChildToProp(structMethods[i], struct.sym);
                    }
                    this.register(struct); break;
                case 'enum_declaration':
                    if (exclude.includes('enum')) continue;
                    const enm = this.parseEnum(node);
                    const enmMembers = this.parseEnumValues(enm);
                    for (let i = 0; i < enmMembers.length; i++) {
                        this.registerChildToProp(enmMembers[i], enm.sym);
                    }
                    this.register(enm); break;
                case 'method_declaration':
                    if (exclude.includes('method')) continue;
                    const [method, receiver] = this.parseMethod(this.parseFunction(node));
                    const mParams = this.parseFunctionParameters(method);
                    for (let i = 0; i < mParams.length; i++) {
                        this.registerChildToProp(mParams[i], method.sym);
                    }
                    this.registerChildToProp(receiver, method.sym);
                    this.register(method); break;
                case 'function_declaration':
                    if (exclude.includes('function')) continue;
                    const fn = this.parseFunction(node);
                    const fnParams = this.parseFunctionParameters(fn);
                    for (let i = 0; i < fnParams.length; i++) {
                        this.registerChildToProp(fnParams[i], fn.sym);
                    }
                    this.register(fn); break;
                default: break;
            }
        }
    }

    static get basicTypes() { return ['bool', 'string', 'rune', 'i8', 'byte', 'i16', 'u16', 'int', 'u32', 'i64', 'u64'] };

    static identify(node: Parser.SyntaxNode, customTypes: string[] = []): string {
        let type = '';
        
        const basicTypes = [...SymbolMap.basicTypes, new Set(customTypes)];
    
        switch (node?.type) {
            case 'pointer_type':
                let pointer_type = node?.children[0];
                type = SymbolMap.identify(pointer_type, customTypes);
                break;
            case 'interpreted_string_literal':
            case 'raw_string_literal':
                type = 'string'; break;
            case 'int_literal':
                type = 'int'; break;
            case 'float_literal':
                type = 'f32'; break;
            case 'rune_literal':
                type = 'rune'; break;
            case 'if_statement':
                let consequence = findChildByType(node, "consequence");
                type = SymbolMap.identify(consequence, customTypes);
                break;
            case 'binary_expression':
                type = SymbolMap.identify(node.children[0], customTypes);
                break;
            case 'slice_expression':
                // TODO: Slice
                type = ''; break;
            case 'array_type':
                let array_item = node.namedChildren[0];
                let array_type = SymbolMap.identify(array_item, customTypes);
                type = `[]${array_type}`; break;
            case 'map_type':
                let key = node?.childForFieldName('key');
                let key_type = SymbolMap.identify(key, customTypes);
                let value = node?.childForFieldName('value');
                let value_type = SymbolMap.identify(value, customTypes);
                type = `map[${key_type}]${value_type}`; break;
            case 'type_conversion_expression':
                let type_name = node?.childForFieldName('type');
                type = type_name?.text; break;
            case 'call_expression':
                const fnName = node?.childForFieldName('function');
                const _fnn = fnName?.text;
                type = fnName?.type === "selector_expression" ? 
                        SymbolMap.identify(fnName, customTypes) :
                        basicTypes.includes(_fnn) ? _fnn : 'void';
                break;
            case 'struct_declaration':
                type = 'struct'; break;
            case 'enum_declaration':
                type = 'enum'; break;    
            case 'option_type':
                let baseType = findChildByType(node, "type_identifier");
                type = `?${baseType?.text}`; break;
            case 'composite_literal':
                type = node?.childForFieldName('type')?.text;
                break;
            case 'function_declaration':
            case 'method_declaration':
                type = buildFnSignature(node, false); break;
            case 'selector_expression':
            case 'index_expression':
            case 'slice_expression':
                // TODO: Figure out the return type of the last selector expression.
                type = node.text; break;
            case 'false':
            case 'true':
                type = 'bool'; break;
            case 'qualified_type':
            case 'type_identifier':
                type = node?.text; break;
            case 'casting_expression':
            case 'type_conversion_expression':
                type = node?.childForFieldName('type').text;
                break;
            default:  
                type = 'unknown'; break;  
        }
    
        return type;
    }

    identifyType(node: Parser.SyntaxNode): string {        
        const customTypes: string[] = (() => {
            const filtered = [];

            for (const s in this.symbols.get(this.moduleName)) {
                if (this.getFrom(this.moduleName).has(s) && this.get(s).type === "function") continue;
                filtered.push(s);   
            }

            return filtered;
        })();
        
        return SymbolMap.identify(node, customTypes);
    }

    // TODO: Parse Sum types
    parseTypedef(node: Parser.SyntaxNode): ParsedSymbol {
        const spec = findChildByType(node, 'type_spec');
        const typeName = spec?.childForFieldName('name')?.text;
        const originalType = this.identifyType(spec?.childForFieldName('type'));
        const sym = new Symbol(typeName, originalType);

        sym.isPublic = node.firstNamedChild.type === "pub_keyword";
        sym.node = node;
        sym.returnType = typeName;
        sym.symbolKind = SymbolKind.Object;
        sym.completionItemKind = CompletionItemKind.Keyword;

        return { name: typeName, sym };
    }
    
    parseFunction(node: Parser.SyntaxNode): ParsedSymbol {
        let functionName = node.childForFieldName('name')?.text as string;
        let functionReturnType = node?.childForFieldName('result')?.text || 'void';
        let sym: Symbol = new Symbol(functionName, 'function');

        sym.isPublic = node.firstNamedChild.type === "pub_keyword";
        sym.node = node;
        sym.returnType = functionReturnType;
        sym.symbolKind = SymbolKind.Function;
        sym.completionItemKind = CompletionItemKind.Function;
    
        return { name: functionName, sym };
    }
    
    parseMethod(pSym: ParsedSymbol): ParsedSymbol[] {
        const node = pSym.sym.node;
        const receiver = node.childForFieldName('receiver');
        const receiverDeclList = findChildByType(receiver, 'parameter_declaration');
        const originalType = receiverDeclList.childForFieldName('type')?.text;
        const receiverName = receiverDeclList.childForFieldName('name')?.text;
        const methodName = node.childForFieldName('name')?.text

        pSym.sym.type = "method";
        pSym.sym.symbolKind = SymbolKind.Method;
        pSym.name = originalType + '.' + methodName;
        pSym.sym.name = pSym.name;

        const receiverSym: Symbol = new Symbol(receiverName, "method_receiver");
        receiverSym.node = receiver;
        receiverSym.returnType = originalType;
        receiverSym.symbolKind = SymbolKind.Variable;
        receiverSym.completionItemKind = CompletionItemKind.Variable;
    
        const receiverPSym: ParsedSymbol = {
            name: receiverName,
            sym: receiverSym
        }

        return [pSym, receiverPSym];
    }

    parseFunctionParameters(pSym: ParsedSymbol): ParsedSymbol[] {
        const node = pSym.sym.node as Parser.SyntaxNode;
        const parameterList = node.childForFieldName('parameters')?.children || [];
        const parsedFnParameters: ParsedSymbol[] = [];

        for (let pd of parameterList) {
            let paramName = pd.childForFieldName('name')?.text;
            if (typeof paramName == "undefined") { continue; }
            // TODO: Use `this.identifyType` for locating types
            const paramDataType = pd.childForFieldName('type')?.text;
            const sym: Symbol = new Symbol(paramName, "parameter");
            sym.node = pd;
            sym.parent = pSym.sym;
            sym.returnType = paramDataType;
            sym.symbolKind = SymbolKind.Variable;
            sym.completionItemKind = CompletionItemKind.Variable;

            parsedFnParameters.push({ name: paramName, sym });
        }

        return parsedFnParameters;
    }

    parseFunctionBody(pSym: ParsedSymbol): ParsedSymbol[] {
        const parsedFunctionBody: ParsedSymbol[] = [];
        const node = pSym.sym.node as Parser.SyntaxNode;
        const body = node.childForFieldName('body')?.children;
        if (typeof body == "undefined") return [];

        for (let i = 0; i < body.length; i++) {
            let e = body[i];
            if (typeof e === "undefined") continue;
            if (e?.type === "short_var_declaration") continue;
            
            parsedFunctionBody.push(this.parseVariable(e));
        }

        return parsedFunctionBody;
    }

    parseInterface(node: Parser.SyntaxNode): ParsedSymbol {
        const interfaceName = findChildByType(node, 'type_identifier')?.text as string;
        const sym: Symbol = new Symbol(interfaceName, "interface");
        sym.node = node;
        sym.returnType = "interface";
        sym.symbolKind = SymbolKind.Interface;
        sym.completionItemKind = CompletionItemKind.Interface;
        sym.isPublic = node.firstNamedChild.type === "pub_keyword";

        return { name: interfaceName, sym };
    }

    parseInterfaceMethods(pSym: ParsedSymbol): ParsedSymbol[] {
        const methodSpecList = findChildByType(pSym.sym.node as Parser.SyntaxNode, "method_spec_list")?.children || [];
        const parsedInterfaceMethods: ParsedSymbol[] = [];

        for (let i = 0; i < methodSpecList.length; i++) {
            const ms = methodSpecList[i];
            const name = ms.childForFieldName('name')?.text;
            if (typeof name === "undefined") { continue; }
            const returnType = ms.childForFieldName('result')?.text;
            const sym: Symbol = new Symbol(name, "interface_method");
            sym.node = ms;
            sym.parent = pSym.sym;
            sym.returnType = returnType;
            sym.symbolKind = SymbolKind.Field;
            sym.completionItemKind = CompletionItemKind.Field;
            sym.isPublic = pSym.sym.isPublic;

            parsedInterfaceMethods.push({ name, sym });
        }

        return parsedInterfaceMethods;
    }

    parseConstants(node: Parser.SyntaxNode): ParsedSymbol[] {
        const constants: ParsedSymbol[] = [];

        for (let i = 0; i < node.namedChildren.length; i++) {
            const c = node.children[i];
            const name = c.childForFieldName('name')?.text;
            if (typeof name === "undefined") { continue; }
            const data = c.childForFieldName('value')?.firstChild;
            const dataType = this.identifyType(data as Parser.SyntaxNode);
            const sym: Symbol = new Symbol(name, "constant");
            sym.isPublic = node.firstNamedChild.type === "pub_keyword";
            sym.node = node;
            sym.returnType = dataType;
            sym.symbolKind = SymbolKind.Constant;
            sym.completionItemKind = CompletionItemKind.Constant;

            constants.push({ name, sym });
        }

        return constants;
    }

    parseStruct(node: Parser.SyntaxNode): ParsedSymbol {
        const structName = findChildByType(node, "type_identifier")?.text as string;   
        const sym: Symbol = new Symbol(structName, "struct");
        sym.isPublic = node.firstNamedChild.type === "pub_keyword";
        sym.node = node;
        sym.returnType = structName;
        sym.symbolKind = SymbolKind.Struct;
        sym.completionItemKind = CompletionItemKind.Struct;
        
        return { name: structName, sym };
    }

    parseStructFields(pSym: ParsedSymbol): ParsedSymbol[] {
        const declarationList = findChildByType(pSym.sym.node, "field_declaration_list")?.namedChildren || [];
        const parsedStructFields: ParsedSymbol[] = [];
        let isPublic = false;
        let isMutable = false;

        if (declarationList.length !== 0 && declarationList[0].type === "field_scopes") {
            const scopes = declarationList[0].namedChildren.map(c => c.type);
            const isGlobal = declarationList[0].children.map(c => c.text).includes('__global');

            if (scopes.includes('mut_keyword')) isMutable = true;
            if (scopes.includes('pub_keyword')) isPublic = true;
            if (isGlobal) {
                isMutable = true;
                isPublic = true;
            }
        }


        for (let i = 0; i < declarationList.length; i++) {
            const fd = declarationList[i];
            const name = fd.childForFieldName('name')?.text;
            const structFieldType = fd.childForFieldName('type')?.text;
            if (typeof name === "undefined") { continue; }
            const sym: Symbol = new Symbol(name, "struct_field");
            sym.node = fd;
            sym.parent = pSym.sym;
            sym.returnType = structFieldType;
            sym.symbolKind = SymbolKind.Field;
            sym.completionItemKind = CompletionItemKind.Field;
            sym.isMut = isMutable;
            sym.isPublic = isPublic;

            parsedStructFields.push({ name, sym });
        }

        return parsedStructFields;
    }
    
    parseVariable(node: Parser.SyntaxNode, pSym?: ParsedSymbol): ParsedSymbol {
        const varName = node.childForFieldName('left')?.text;
        const dataNode = node.childForFieldName('right');
        const dataType = this.identifyType(dataNode);
        const sym: Symbol = new Symbol(varName, "variable");
        sym.node = node;
        sym.returnType = dataType;
        sym.symbolKind = SymbolKind.Variable;
        sym.completionItemKind = CompletionItemKind.Variable;
    
        if (typeof pSym !== "undefined") {
            sym.parent = pSym.sym;
        }

        return { name: varName, sym };
    }
    
    parseEnum(node: Parser.SyntaxNode) : ParsedSymbol {
        const enumName = findChildByType(node, "type_identifier")?.text;
        const sym: Symbol = new Symbol(enumName, "enum");
        sym.node = node;
        sym.returnType = "enum";
        sym.symbolKind = SymbolKind.Enum;
        sym.completionItemKind = CompletionItemKind.Enum;
        sym.isPublic = node.firstNamedChild.type === "pub_keyword";

        return { name: enumName, sym };
    }

    parseEnumValues(pSym: ParsedSymbol): ParsedSymbol[] {
        const parsedEnumValues: ParsedSymbol[] = [];
        const declarationList = findChildByType(pSym.sym.node, "enum_declaration_list")?.children || [];

        for (let i = 0; i < declarationList.length; i++) {
            const fd = declarationList[i];
            const name = fd.childForFieldName('name')?.text;
            const sym: Symbol = new Symbol(name, "enum_member");
            sym.node = fd;
            sym.parent = pSym.sym;
            sym.returnType = "int";
            sym.symbolKind = SymbolKind.EnumMember;
            sym.isPublic = pSym.sym.isPublic;
            sym.completionItemKind = CompletionItemKind.EnumMember;

            parsedEnumValues.push({ name, sym });
        }

        return parsedEnumValues;
    }
}
 

export function findChildByType(node: Parser.SyntaxNode | null, name: string): Parser.SyntaxNode | null {
    const child = node?.children.find(x => x.type === name) || null;
    return child;
}

export function filterChildrenByType(node: Parser.SyntaxNode | null, name: string | string[]): Parser.SyntaxNode[] | undefined {
    return node?.children?.filter(x => Array.isArray(name) ? name.includes(x.type) : x.type === name);
}