"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signatures_1 = require("./signatures");
const analyzer_1 = require("./analyzer");
const symbols_1 = require("./symbols");
class TypeMap {
    constructor(filepath, node) {
        this.types = {};
        this.filepath = filepath;
        this.node = node;
        this.moduleName = analyzer_1.Analyzer.getModuleNameFromNode(this.node.tree.rootNode);
    }
    setNode(node) {
        this.node = node;
    }
    getAll() {
        return this.types;
    }
    get(key) {
        return this.types[this.moduleName][key];
    }
    set(key, props) {
        this.types[this.moduleName][key] = props;
    }
    insertParent(key, prop) {
        const type = this.get(key);
        if (typeof type.parent == "undefined") {
            this.types[this.moduleName][key].parent = {};
        }
        this.types[this.moduleName][key].parent[prop.name] = prop;
    }
    register(pType) {
        const { name, props } = pType;
        props.file = this.filepath;
        if (typeof props.children == "undefined") {
            props.children = {};
        }
        if (Object.keys(this.types).indexOf(this.moduleName) == -1) {
            this.types[this.moduleName] = {};
        }
        this.types[this.moduleName][name] = props;
    }
    registerChild(pType, parent) {
        const { name, props } = pType;
        props.file = this.filepath;
        this.types[this.moduleName][parent].children[name] = props;
    }
    generate(log = false) {
        for (let node of this.node.children) {
            if (log == true) {
                console.log(node.type);
            }
            switch (node.type) {
                case 'interface_declaration':
                    const ifaceProp = this.parseInterface(node);
                    this.register(ifaceProp);
                    this.parseInterfaceMethods(ifaceProp)
                        .map(n => {
                        this.parseFunctionParameters(n)
                            .forEach(p => {
                            console.log(p);
                            n.props.file = this.filepath;
                            n.props.children[p.name] = p.props;
                        });
                        return n;
                    })
                        .forEach(n => {
                        this.registerChild(n, ifaceProp.name);
                    });
                case 'const_declaration':
                    this.parseConstants(node)
                        .forEach(n => {
                        this.register(n);
                    });
                    break;
                case 'type_declaration':
                    this.register(this.parseTypedef(node));
                    break;
                case 'short_var_declaration':
                    this.register(this.parseVariable(node));
                    break;
                case 'struct_declaration':
                    const structProp = this.parseStruct(node);
                    this.register(structProp);
                    this.parseStructFields(structProp).forEach(n => { this.registerChild(n, structProp.name); });
                    break;
                case 'enum_declaration':
                    const enumProp = this.parseEnum(node);
                    this.register(enumProp);
                    this.parseEnumValues(enumProp).forEach(n => { this.registerChild(n, enumProp.name); });
                    break;
                case 'method_declaration':
                    const methodProp = this.parseFunction(node);
                    this.parseMethodReceiver(methodProp);
                    break;
                case 'function_declaration':
                    const functionProp = this.parseFunction(node);
                    this.register(functionProp);
                    this.parseFunctionParameters(functionProp).forEach(n => {
                        this.registerChild(n, functionProp.name);
                    });
                    break;
                default:
                    break;
            }
        }
    }
    identifyType(node) {
        var _a, _b, _c;
        let type = '';
        const custom_types = Object.keys(this.types).filter(s => {
            return typeof this.types[this.moduleName][s] !== "undefined" && this.types[this.moduleName][s].type !== "function";
        });
        const basic_types = ['bool', 'string', 'rune', 'i8', 'byte', 'i16', 'u16', 'int', 'u32', 'i64', 'u64', ...new Set(custom_types)];
        switch (node === null || node === void 0 ? void 0 : node.type) {
            case 'pointer_type':
                let pointer_type = node === null || node === void 0 ? void 0 : node.children[0];
                type = this.identifyType(pointer_type);
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
                type = this.identifyType(consequence);
                break;
            case 'binary_expression':
                type = this.identifyType(node.children[0]);
                break;
            case 'slice_expression':
                type = '';
                break;
            case 'array_type':
                let array_item = node.namedChildren[0];
                let array_type = this.identifyType(array_item);
                type = `[]${array_type}`;
                break;
            case 'map_type':
                let key = node === null || node === void 0 ? void 0 : node.childForFieldName('key');
                let key_type = this.identifyType(key);
                let value = node === null || node === void 0 ? void 0 : node.childForFieldName('value');
                let value_type = this.identifyType(value);
                type = `map[${key_type}]${value_type}`;
                break;
            case 'type_conversion_expression':
                let type_name = node === null || node === void 0 ? void 0 : node.childForFieldName('type');
                type = type_name === null || type_name === void 0 ? void 0 : type_name.text;
                break;
            case 'call_expression':
                const fn_name = node === null || node === void 0 ? void 0 : node.childForFieldName('function');
                const _fnn = fn_name === null || fn_name === void 0 ? void 0 : fn_name.text;
                if ((fn_name === null || fn_name === void 0 ? void 0 : fn_name.type) === "selector_expression") {
                    type = this.identifyType(fn_name);
                }
                else {
                    type = basic_types.includes(_fnn) ? _fnn : 'void';
                }
                break;
            case 'struct_declaration':
                type = 'struct';
                break;
            case 'enum_declaration':
                type = 'enum';
                break;
            case 'option_type':
                let base_type = findChildByType(node, "type_identifier");
                type = `?${base_type === null || base_type === void 0 ? void 0 : base_type.text}`;
                break;
            case 'composite_literal':
                type = (_a = node === null || node === void 0 ? void 0 : node.childForFieldName('type')) === null || _a === void 0 ? void 0 : _a.text;
                break;
            case 'function_declaration':
            case 'method_declaration':
                type = signatures_1.buildFnSignature(node, false);
                break;
            case 'selector_expression':
                let s_name = (_b = node === null || node === void 0 ? void 0 : node.childForFieldName('operand')) === null || _b === void 0 ? void 0 : _b.text;
                let f_name = (_c = node === null || node === void 0 ? void 0 : node.childForFieldName('field')) === null || _c === void 0 ? void 0 : _c.text;
                type = 'void';
                break;
            case 'false':
            case 'true':
                type = 'bool';
                break;
            case 'qualified_type':
            case 'type_identifier':
                type = node === null || node === void 0 ? void 0 : node.text;
                break;
            default:
                type = 'unknown';
                break;
        }
        return type;
    }
    parseTypedef(node) {
        var _a;
        const spec = findChildByType(node, 'type_spec');
        const typeName = (_a = spec === null || spec === void 0 ? void 0 : spec.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
        const originalType = this.identifyType(spec === null || spec === void 0 ? void 0 : spec.childForFieldName('type'));
        return {
            name: typeName,
            props: {
                type: 'alias_' + originalType,
                name: typeName,
                node,
                returnType: typeName,
                symbolKind: symbols_1.SymbolKind.Object
            }
        };
    }
    parseFunction(node) {
        var _a, _b;
        let functionName = (_a = node.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
        let functionReturnType = ((_b = node === null || node === void 0 ? void 0 : node.childForFieldName('result')) === null || _b === void 0 ? void 0 : _b.text) || 'void';
        let functionProps = {
            type: `function`,
            name: functionName,
            node,
            returnType: functionReturnType,
            symbolKind: symbols_1.SymbolKind.Function,
            children: {}
        };
        return {
            name: functionName,
            props: functionProps
        };
    }
    parseMethodReceiver(pType) {
        var _a, _b;
        const node = pType.props.node;
        const receiver = node.childForFieldName('receiver');
        const receiverDeclList = findChildByType(receiver, 'parameter_declaration');
        const originalType = (_a = receiverDeclList === null || receiverDeclList === void 0 ? void 0 : receiverDeclList.childForFieldName('type')) === null || _a === void 0 ? void 0 : _a.text;
        const methodName = (_b = node.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
        pType.props.type = "method";
        pType.props.symbolKind = symbols_1.SymbolKind.Method;
        pType.name = originalType + '.' + methodName;
        pType.props.name = pType.name;
        if (typeof this.types[this.moduleName] !== "undefined" && typeof this.get(originalType) !== "undefined") {
            pType.props.parent = this.get(originalType);
        }
        this.register(pType);
        this.parseFunctionParameters(pType).forEach(n => {
            this.registerChild(n, pType.name);
        });
    }
    parseFunctionParameters(pType) {
        var _a, _b, _c;
        const node = pType.props.node;
        const parameterList = ((_a = node.childForFieldName('parameters')) === null || _a === void 0 ? void 0 : _a.children) || [];
        const parsedFnParameters = [];
        for (let pd of parameterList) {
            let paramName = (_b = pd.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
            if (typeof paramName == "undefined") {
                continue;
            }
            const paramDataType = (_c = pd.childForFieldName('type')) === null || _c === void 0 ? void 0 : _c.text;
            paramName = pType.name + '~' + paramName;
            const props = {
                name: paramName,
                type: "parameter",
                node: pd,
                parent: pType.props,
                returnType: paramDataType,
                symbolKind: symbols_1.SymbolKind.Variable
            };
            parsedFnParameters.push({ name: paramName, props });
        }
        return parsedFnParameters;
    }
    parseFunctionBody(pType) {
        var _a;
        const parsedFunctionBody = [];
        const node = pType.props.node;
        const body = (_a = node.childForFieldName('body')) === null || _a === void 0 ? void 0 : _a.children;
        if (typeof body == "undefined") {
            return parsedFunctionBody;
        }
        for (let i = 0; i < body.length; i++) {
            let e = body[i];
            if (typeof e === "undefined" || (e === null || e === void 0 ? void 0 : e.type) !== "short_var_declaration") {
                continue;
            }
            parsedFunctionBody.push(this.parseVariable(e));
        }
        return parsedFunctionBody;
    }
    parseInterface(node) {
        var _a;
        const interfaceName = (_a = findChildByType(node, 'type_identifier')) === null || _a === void 0 ? void 0 : _a.text;
        const interfaceProp = {
            type: 'interface',
            name: interfaceName,
            node,
            returnType: 'interface',
            symbolKind: symbols_1.SymbolKind.Interface
        };
        return {
            name: interfaceName,
            props: interfaceProp
        };
    }
    parseInterfaceMethods(pType) {
        var _a, _b, _c;
        const methodSpecList = ((_a = findChildByType(pType.props.node, "method_spec_list")) === null || _a === void 0 ? void 0 : _a.children) || [];
        const parsedInterfaceMethods = [];
        for (let ms of methodSpecList) {
            let name = (_b = ms.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
            if (typeof name === "undefined") {
                continue;
            }
            const returnType = (_c = ms.childForFieldName('result')) === null || _c === void 0 ? void 0 : _c.text;
            let props = {
                name,
                type: 'interface_method',
                node: ms,
                parent: pType.props,
                returnType: returnType,
                symbolKind: symbols_1.SymbolKind.Field,
                children: {}
            };
            parsedInterfaceMethods.push({ name, props });
        }
        return parsedInterfaceMethods;
    }
    parseConstants(node) {
        const constants = [];
        node.children.forEach(c => {
            var _a, _b;
            const name = (_a = c.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
            if (typeof name === "undefined") {
                return;
            }
            const data = (_b = c.childForFieldName('value')) === null || _b === void 0 ? void 0 : _b.firstChild;
            const dataType = this.identifyType(data);
            const constProps = {
                type: 'constant',
                name,
                node,
                returnType: dataType,
                symbolKind: symbols_1.SymbolKind.Constant
            };
            constants.push({ name, props: constProps });
        });
        return constants;
    }
    parseStruct(node) {
        var _a;
        const structName = (_a = findChildByType(node, "type_identifier")) === null || _a === void 0 ? void 0 : _a.text;
        return {
            name: structName,
            props: {
                name: structName,
                type: 'struct',
                node,
                returnType: structName,
                symbolKind: symbols_1.SymbolKind.Struct,
                children: {}
            }
        };
    }
    parseStructFields(pType) {
        var _a, _b, _c;
        const declarationList = ((_a = findChildByType(pType.props.node, "field_declaration_list")) === null || _a === void 0 ? void 0 : _a.children) || [];
        const parsedStructFields = [];
        for (let fd of declarationList) {
            let name = (_b = fd.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
            const structFieldType = (_c = fd.childForFieldName('type')) === null || _c === void 0 ? void 0 : _c.text;
            if (typeof name === "undefined") {
                continue;
            }
            const props = {
                name,
                type: 'struct_field',
                node: fd,
                parent: pType.props,
                returnType: structFieldType,
                symbolKind: symbols_1.SymbolKind.Field
            };
            parsedStructFields.push({ name, props });
        }
        return parsedStructFields;
    }
    parseVariable(node, pType) {
        var _a;
        let variableName = (_a = node.childForFieldName('left')) === null || _a === void 0 ? void 0 : _a.text;
        const data = node.childForFieldName('right');
        const dataType = this.identifyType(data);
        const variableProps = {
            type: 'variable',
            name: variableName,
            node,
            returnType: dataType,
            symbolKind: symbols_1.SymbolKind.Variable
        };
        if (typeof pType !== "undefined") {
            variableProps.parent = pType.props;
        }
        return {
            name: variableName,
            props: variableProps
        };
    }
    parseEnum(node) {
        var _a;
        const enum_name = (_a = findChildByType(node, "type_identifier")) === null || _a === void 0 ? void 0 : _a.text;
        return {
            name: enum_name,
            props: {
                name: enum_name,
                type: 'enum',
                node,
                returnType: 'enum',
                symbolKind: symbols_1.SymbolKind.Enum,
                children: {}
            }
        };
    }
    parseEnumValues(pType) {
        var _a, _b;
        const parsedEnumValues = [];
        const declarationList = ((_a = findChildByType(pType.props.node, "enum_declaration_list")) === null || _a === void 0 ? void 0 : _a.children) || [];
        for (let fd of declarationList) {
            let name = (_b = fd.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
            const props = {
                name,
                type: 'enum_member',
                node: fd,
                parent: pType.props,
                returnType: 'int',
                symbolKind: symbols_1.SymbolKind.EnumMember
            };
            parsedEnumValues.push({ name, props });
        }
        return parsedEnumValues;
    }
}
exports.TypeMap = TypeMap;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw2Q0FBZ0Q7QUFDaEQseUNBQXNDO0FBQ3RDLHVDQUF1QztBQTBCdkMsTUFBYSxPQUFPO0lBTWhCLFlBQVksUUFBZ0IsRUFBRSxJQUF1QjtRQUg3QyxVQUFLLEdBQVUsRUFBRSxDQUFDO1FBSXRCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsbUJBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBRUQsT0FBTyxDQUFDLElBQXVCO1FBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxNQUFNO1FBQ0YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBVztRQUNYLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELEdBQUcsQ0FBQyxHQUFXLEVBQUUsS0FBcUI7UUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQzdDLENBQUM7SUFFRCxZQUFZLENBQUMsR0FBVyxFQUFFLElBQW9CO1FBQzFDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFM0IsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksV0FBVyxFQUFFO1lBRW5DLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUs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