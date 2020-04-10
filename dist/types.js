"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signatures_1 = require("./signatures");
const analyzer_1 = require("./analyzer");
const symbols_1 = require("./symbols");
const utils_1 = require("./utils");
class Symbol {
    constructor(name, type) {
        this.children = new Map();
        this.isMut = false;
        this.isPublic = false;
        this.name = name;
        this.type = type;
    }
}
exports.Symbol = Symbol;
class SymbolMap {
    constructor(filepath, node, autogenerate = true) {
        this.symbols = new Map();
        this.has = (moduleName) => this.symbols.has(moduleName);
        this.get = (key) => this.symbols.get(this.moduleName).get(key);
        this.getFrom = (moduleName) => this.symbols.get(moduleName);
        this.getAll = () => this.symbols;
        this.set = (key, sym) => { this.symbols.get(this.moduleName).set(key, sym); };
        this.insertParent = (key, sym) => { this.symbols.get(this.moduleName).get(key).parent = sym; };
        this.filepath = utils_1.normalizePath(filepath);
        this.node = node;
        this.moduleName = analyzer_1.Analyzer.getModuleNameFromNode(this.node.tree.rootNode);
        if (autogenerate)
            this.generate();
    }
    setNode(node) { this.node = node; }
    setFile(filepath) { this.filepath = filepath; }
    register({ name, sym }) {
        sym.file = this.filepath;
        sym.module = this.moduleName;
        if (!this.symbols.has(this.moduleName)) {
            this.symbols.set(this.moduleName, new Map());
        }
        this.set(name, sym);
    }
    registerChild(pSym, parent) {
        this.registerChildToProp(pSym, this.symbols.get(this.moduleName).get(parent));
    }
    registerChildToProp({ name, sym }, parent) {
        sym.file = this.filepath;
        sym.module = this.moduleName;
        parent.children.set(name, sym);
    }
    getPublicSymbols(except) {
        const filtered = new Map();
        for (const moduleName of this.symbols.keys()) {
            filtered.set(moduleName, moduleName === except ? this.symbols.get(moduleName) : new Map());
            if (moduleName === except)
                continue;
            for (const sym of this.symbols.get(moduleName)) {
                if (!sym[1].isPublic)
                    continue;
                filtered.get(moduleName).set(...sym);
            }
        }
        return filtered;
    }
    generate(exclude = []) {
        for (let i = 0; i < this.node.children.length; i++) {
            const node = this.node.children[i];
            switch (node.type) {
                case 'interface_declaration':
                    if (exclude.includes('interface'))
                        continue;
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
                    this.register(iface);
                    break;
                case 'const_declaration':
                    if (exclude.includes('constant'))
                        continue;
                    const constants = this.parseConstants(node);
                    for (let i = 0; i < constants.length; i++) {
                        this.register(constants[i]);
                    }
                    break;
                case 'type_declaration':
                    if (exclude.includes('typedef'))
                        continue;
                    this.register(this.parseTypedef(node));
                    break;
                case 'short_var_declaration':
                    if (exclude.includes('variable'))
                        continue;
                    this.register(this.parseVariable(node));
                    break;
                case 'struct_declaration':
                    if (exclude.includes('struct'))
                        continue;
                    const struct = this.parseStruct(node);
                    const structMethods = this.parseStructFields(struct);
                    for (let i = 0; i < structMethods.length; i++) {
                        this.registerChildToProp(structMethods[i], struct.sym);
                    }
                    this.register(struct);
                    break;
                case 'enum_declaration':
                    if (exclude.includes('enum'))
                        continue;
                    const enm = this.parseEnum(node);
                    const enmMembers = this.parseEnumValues(enm);
                    for (let i = 0; i < enmMembers.length; i++) {
                        this.registerChildToProp(enmMembers[i], enm.sym);
                    }
                    this.register(enm);
                    break;
                case 'method_declaration':
                    if (exclude.includes('method'))
                        continue;
                    const [method, receiver] = this.parseMethod(this.parseFunction(node));
                    const mParams = this.parseFunctionParameters(method);
                    for (let i = 0; i < mParams.length; i++) {
                        this.registerChildToProp(mParams[i], method.sym);
                    }
                    this.registerChildToProp(receiver, method.sym);
                    this.register(method);
                    break;
                case 'function_declaration':
                    if (exclude.includes('function'))
                        continue;
                    const fn = this.parseFunction(node);
                    const fnParams = this.parseFunctionParameters(fn);
                    for (let i = 0; i < fnParams.length; i++) {
                        this.registerChildToProp(fnParams[i], fn.sym);
                    }
                    this.register(fn);
                    break;
                default: break;
            }
        }
    }
    static get basicTypes() { return ['bool', 'string', 'rune', 'i8', 'byte', 'i16', 'u16', 'int', 'u32', 'i64', 'u64']; }
    ;
    static identify(node, customTypes = []) {
        var _a;
        let type = '';
        const basicTypes = [...SymbolMap.basicTypes, new Set(customTypes)];
        switch (node === null || node === void 0 ? void 0 : node.type) {
            case 'pointer_type':
                let pointer_type = node === null || node === void 0 ? void 0 : node.children[0];
                type = SymbolMap.identify(pointer_type, customTypes);
                break;
            case 'interpreted_string_literal':
            case 'raw_string_literal':
                type = 'string';
                break;
            case 'int_literal':
                type = 'int';
                break;
            case 'float_literal':
                type = 'f32';
                break;
            case 'rune_literal':
                type = 'rune';
                break;
            case 'if_statement':
                let consequence = findChildByType(node, "consequence");
                type = SymbolMap.identify(consequence, customTypes);
                break;
            case 'binary_expression':
                type = SymbolMap.identify(node.children[0], customTypes);
                break;
            case 'slice_expression':
                type = '';
                break;
            case 'array_type':
                let array_item = node.namedChildren[0];
                let array_type = SymbolMap.identify(array_item, customTypes);
                type = `[]${array_type}`;
                break;
            case 'map_type':
                let key = node === null || node === void 0 ? void 0 : node.childForFieldName('key');
                let key_type = SymbolMap.identify(key, customTypes);
                let value = node === null || node === void 0 ? void 0 : node.childForFieldName('value');
                let value_type = SymbolMap.identify(value, customTypes);
                type = `map[${key_type}]${value_type}`;
                break;
            case 'type_conversion_expression':
                let type_name = node === null || node === void 0 ? void 0 : node.childForFieldName('type');
                type = type_name === null || type_name === void 0 ? void 0 : type_name.text;
                break;
            case 'call_expression':
                const fnName = node === null || node === void 0 ? void 0 : node.childForFieldName('function');
                const _fnn = fnName === null || fnName === void 0 ? void 0 : fnName.text;
                type = (fnName === null || fnName === void 0 ? void 0 : fnName.type) === "selector_expression" ?
                    SymbolMap.identify(fnName, customTypes) :
                    basicTypes.includes(_fnn) ? _fnn : 'void';
                break;
            case 'struct_declaration':
                type = 'struct';
                break;
            case 'enum_declaration':
                type = 'enum';
                break;
            case 'option_type':
                let baseType = findChildByType(node, "type_identifier");
                type = `?${baseType === null || baseType === void 0 ? void 0 : baseType.text}`;
                break;
            case 'composite_literal':
                type = (_a = node === null || node === void 0 ? void 0 : node.childForFieldName('type')) === null || _a === void 0 ? void 0 : _a.text;
                break;
            case 'function_declaration':
            case 'method_declaration':
                type = signatures_1.buildFnSignature(node, false);
                break;
            case 'selector_expression':
            case 'index_expression':
            case 'slice_expression':
                type = node.text;
                break;
            case 'false':
            case 'true':
                type = 'bool';
                break;
            case 'qualified_type':
            case 'type_identifier':
                type = node === null || node === void 0 ? void 0 : node.text;
                break;
            case 'casting_expression':
            case 'type_conversion_expression':
                type = node === null || node === void 0 ? void 0 : node.childForFieldName('type').text;
                break;
            default:
                type = 'unknown';
                break;
        }
        return type;
    }
    identifyType(node) {
        const customTypes = (() => {
            const filtered = [];
            for (const s in this.symbols.get(this.moduleName)) {
                if (this.getFrom(this.moduleName).has(s) && this.get(s).type === "function")
                    continue;
                filtered.push(s);
            }
            return filtered;
        })();
        return SymbolMap.identify(node, customTypes);
    }
    parseTypedef(node) {
        var _a;
        const spec = findChildByType(node, 'type_spec');
        const typeName = (_a = spec === null || spec === void 0 ? void 0 : spec.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
        const originalType = this.identifyType(spec === null || spec === void 0 ? void 0 : spec.childForFieldName('type'));
        const sym = new Symbol(typeName, originalType);
        sym.isPublic = node.firstNamedChild.type === "pub_keyword";
        sym.node = node;
        sym.returnType = typeName;
        sym.symbolKind = symbols_1.SymbolKind.Object;
        sym.completionItemKind = symbols_1.CompletionItemKind.Keyword;
        return { name: typeName, sym };
    }
    parseFunction(node) {
        var _a, _b;
        let functionName = (_a = node.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
        let functionReturnType = ((_b = node === null || node === void 0 ? void 0 : node.childForFieldName('result')) === null || _b === void 0 ? void 0 : _b.text) || 'void';
        let sym = new Symbol(functionName, 'function');
        sym.isPublic = node.firstNamedChild.type === "pub_keyword";
        sym.node = node;
        sym.returnType = functionReturnType;
        sym.symbolKind = symbols_1.SymbolKind.Function;
        sym.completionItemKind = symbols_1.CompletionItemKind.Function;
        return { name: functionName, sym };
    }
    parseMethod(pSym) {
        var _a, _b, _c;
        const node = pSym.sym.node;
        const receiver = node.childForFieldName('receiver');
        const receiverDeclList = findChildByType(receiver, 'parameter_declaration');
        const originalType = (_a = receiverDeclList.childForFieldName('type')) === null || _a === void 0 ? void 0 : _a.text;
        const receiverName = (_b = receiverDeclList.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
        const methodName = (_c = node.childForFieldName('name')) === null || _c === void 0 ? void 0 : _c.text;
        pSym.sym.type = "method";
        pSym.sym.symbolKind = symbols_1.SymbolKind.Method;
        pSym.name = originalType + '.' + methodName;
        pSym.sym.name = pSym.name;
        const receiverSym = new Symbol(receiverName, "method_receiver");
        receiverSym.node = receiver;
        receiverSym.returnType = originalType;
        receiverSym.symbolKind = symbols_1.SymbolKind.Variable;
        receiverSym.completionItemKind = symbols_1.CompletionItemKind.Variable;
        const receiverPSym = {
            name: receiverName,
            sym: receiverSym
        };
        return [pSym, receiverPSym];
    }
    parseFunctionParameters(pSym) {
        var _a, _b, _c;
        const node = pSym.sym.node;
        const parameterList = ((_a = node.childForFieldName('parameters')) === null || _a === void 0 ? void 0 : _a.children) || [];
        const parsedFnParameters = [];
        for (let pd of parameterList) {
            let paramName = (_b = pd.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
            if (typeof paramName == "undefined") {
                continue;
            }
            const paramDataType = (_c = pd.childForFieldName('type')) === null || _c === void 0 ? void 0 : _c.text;
            const sym = new Symbol(paramName, "parameter");
            sym.node = pd;
            sym.parent = pSym.sym;
            sym.returnType = paramDataType;
            sym.symbolKind = symbols_1.SymbolKind.Variable;
            sym.completionItemKind = symbols_1.CompletionItemKind.Variable;
            parsedFnParameters.push({ name: paramName, sym });
        }
        return parsedFnParameters;
    }
    parseFunctionBody(pSym) {
        var _a;
        const parsedFunctionBody = [];
        const node = pSym.sym.node;
        const body = (_a = node.childForFieldName('body')) === null || _a === void 0 ? void 0 : _a.children;
        if (typeof body == "undefined")
            return [];
        for (let i = 0; i < body.length; i++) {
            let e = body[i];
            if (typeof e === "undefined")
                continue;
            if ((e === null || e === void 0 ? void 0 : e.type) === "short_var_declaration")
                continue;
            parsedFunctionBody.push(this.parseVariable(e));
        }
        return parsedFunctionBody;
    }
    parseInterface(node) {
        var _a;
        const interfaceName = (_a = findChildByType(node, 'type_identifier')) === null || _a === void 0 ? void 0 : _a.text;
        const sym = new Symbol(interfaceName, "interface");
        sym.node = node;
        sym.returnType = "interface";
        sym.symbolKind = symbols_1.SymbolKind.Interface;
        sym.completionItemKind = symbols_1.CompletionItemKind.Interface;
        sym.isPublic = node.firstNamedChild.type === "pub_keyword";
        return { name: interfaceName, sym };
    }
    parseInterfaceMethods(pSym) {
        var _a, _b, _c;
        const methodSpecList = ((_a = findChildByType(pSym.sym.node, "method_spec_list")) === null || _a === void 0 ? void 0 : _a.children) || [];
        const parsedInterfaceMethods = [];
        for (let i = 0; i < methodSpecList.length; i++) {
            const ms = methodSpecList[i];
            const name = (_b = ms.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
            if (typeof name === "undefined") {
                continue;
            }
            const returnType = (_c = ms.childForFieldName('result')) === null || _c === void 0 ? void 0 : _c.text;
            const sym = new Symbol(name, "interface_method");
            sym.node = ms;
            sym.parent = pSym.sym;
            sym.returnType = returnType;
            sym.symbolKind = symbols_1.SymbolKind.Field;
            sym.completionItemKind = symbols_1.CompletionItemKind.Field;
            sym.isPublic = pSym.sym.isPublic;
            parsedInterfaceMethods.push({ name, sym });
        }
        return parsedInterfaceMethods;
    }
    parseConstants(node) {
        var _a, _b;
        const constants = [];
        for (let i = 0; i < node.namedChildren.length; i++) {
            const c = node.children[i];
            const name = (_a = c.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
            if (typeof name === "undefined") {
                continue;
            }
            const data = (_b = c.childForFieldName('value')) === null || _b === void 0 ? void 0 : _b.firstChild;
            const dataType = this.identifyType(data);
            const sym = new Symbol(name, "constant");
            sym.isPublic = node.firstNamedChild.type === "pub_keyword";
            sym.node = node;
            sym.returnType = dataType;
            sym.symbolKind = symbols_1.SymbolKind.Constant;
            sym.completionItemKind = symbols_1.CompletionItemKind.Constant;
            constants.push({ name, sym });
        }
        return constants;
    }
    parseStruct(node) {
        var _a;
        const structName = (_a = findChildByType(node, "type_identifier")) === null || _a === void 0 ? void 0 : _a.text;
        const sym = new Symbol(structName, "struct");
        sym.isPublic = node.firstNamedChild.type === "pub_keyword";
        sym.node = node;
        sym.returnType = structName;
        sym.symbolKind = symbols_1.SymbolKind.Struct;
        sym.completionItemKind = symbols_1.CompletionItemKind.Struct;
        return { name: structName, sym };
    }
    parseStructFields(pSym) {
        var _a, _b, _c;
        const declarationList = ((_a = findChildByType(pSym.sym.node, "field_declaration_list")) === null || _a === void 0 ? void 0 : _a.namedChildren) || [];
        const parsedStructFields = [];
        let isPublic = false;
        let isMutable = false;
        if (declarationList.length !== 0 && declarationList[0].type === "field_scopes") {
            const scopes = declarationList[0].namedChildren.map(c => c.type);
            const isGlobal = declarationList[0].children.map(c => c.text).includes('__global');
            if (scopes.includes('mut_keyword'))
                isMutable = true;
            if (scopes.includes('pub_keyword'))
                isPublic = true;
            if (isGlobal) {
                isMutable = true;
                isPublic = true;
            }
        }
        for (let i = 0; i < declarationList.length; i++) {
            const fd = declarationList[i];
            const name = (_b = fd.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
            const structFieldType = (_c = fd.childForFieldName('type')) === null || _c === void 0 ? void 0 : _c.text;
            if (typeof name === "undefined") {
                continue;
            }
            const sym = new Symbol(name, "struct_field");
            sym.node = fd;
            sym.parent = pSym.sym;
            sym.returnType = structFieldType;
            sym.symbolKind = symbols_1.SymbolKind.Field;
            sym.completionItemKind = symbols_1.CompletionItemKind.Field;
            sym.isMut = isMutable;
            sym.isPublic = isPublic;
            parsedStructFields.push({ name, sym });
        }
        return parsedStructFields;
    }
    parseVariable(node, pSym) {
        var _a;
        const varName = (_a = node.childForFieldName('left')) === null || _a === void 0 ? void 0 : _a.text;
        const dataNode = node.childForFieldName('right');
        const dataType = this.identifyType(dataNode);
        const sym = new Symbol(varName, "variable");
        sym.node = node;
        sym.returnType = dataType;
        sym.symbolKind = symbols_1.SymbolKind.Variable;
        sym.completionItemKind = symbols_1.CompletionItemKind.Variable;
        if (typeof pSym !== "undefined") {
            sym.parent = pSym.sym;
        }
        return { name: varName, sym };
    }
    parseEnum(node) {
        var _a;
        const enumName = (_a = findChildByType(node, "type_identifier")) === null || _a === void 0 ? void 0 : _a.text;
        const sym = new Symbol(enumName, "enum");
        sym.node = node;
        sym.returnType = "enum";
        sym.symbolKind = symbols_1.SymbolKind.Enum;
        sym.completionItemKind = symbols_1.CompletionItemKind.Enum;
        sym.isPublic = node.firstNamedChild.type === "pub_keyword";
        return { name: enumName, sym };
    }
    parseEnumValues(pSym) {
        var _a, _b;
        const parsedEnumValues = [];
        const declarationList = ((_a = findChildByType(pSym.sym.node, "enum_declaration_list")) === null || _a === void 0 ? void 0 : _a.children) || [];
        for (let i = 0; i < declarationList.length; i++) {
            const fd = declarationList[i];
            const name = (_b = fd.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
            const sym = new Symbol(name, "enum_member");
            sym.node = fd;
            sym.parent = pSym.sym;
            sym.returnType = "int";
            sym.symbolKind = symbols_1.SymbolKind.EnumMember;
            sym.isPublic = pSym.sym.isPublic;
            sym.completionItemKind = symbols_1.CompletionItemKind.EnumMember;
            parsedEnumValues.push({ name, sym });
        }
        return parsedEnumValues;
    }
}
exports.SymbolMap = SymbolMap;
function findChildByType(node, name) {
    const child = (node === null || node === void 0 ? void 0 : node.children.find(x => x.type === name)) || null;
    return child;
}
exports.findChildByType = findChildByType;
function filterChildrenByType(node, name) {
    var _a;
    return (_a = node === null || node === void 0 ? void 0 : node.children) === null || _a === void 0 ? void 0 : _a.filter(x => Array.isArray(name) ? name.includes(x.type) : x.type === name);
}
exports.filterChildrenByType = filterChildrenByType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw2Q0FBZ0Q7QUFDaEQseUNBQXNDO0FBQ3RDLHVDQUEyRDtBQUMzRCxtQ0FBd0M7QUFTeEMsTUFBYSxNQUFNO0lBY2YsWUFBWSxJQUFZLEVBQUUsSUFBWTtRQVZ0QyxhQUFRLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7UUFPMUMsVUFBSyxHQUFZLEtBQUssQ0FBQztRQUN2QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBR3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7Q0FDSjtBQWxCRCx3QkFrQkM7QUFFRCxNQUFhLFNBQVM7SUFNbEIsWUFBWSxRQUFnQixFQUFFLElBQXVCLEVBQUUsZUFBd0IsSUFBSTtRQUhuRixZQUFPLEdBQVksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQVU3QixRQUFHLEdBQUcsQ0FBQyxVQUFrQixFQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUdwRSxRQUFHLEdBQUcsQ0FBQyxHQUFXLEVBQVUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUUsWUFBTyxHQUFHLENBQUMsVUFBa0IsRUFBdUIsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BGLFdBQU0sR0FBRyxHQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3JDLFFBQUcsR0FBRyxDQUFDLEdBQVcsRUFBRSxHQUFXLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FB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