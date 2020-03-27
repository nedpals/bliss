import Parser, { SyntaxNode } from "web-tree-sitter";
import { buildFnSignature } from "./signatures";
import { Analyzer } from "./analyzer";
import { SymbolKind } from "./symbols";

export interface TypeProperties {
    type: string,
    name: string,
    file?: string,
    children?: { 
        [name: string]: TypeProperties
    },
    parent?: TypeProperties,
    node?: Parser.SyntaxNode,
    returnType: string,
    symbolKind: SymbolKind
}

export interface Types { 
    [moduleName: string]: { 
        [name: string]: TypeProperties
    }
}

interface ParsedType {
    name: string,
    props: TypeProperties
}

export class TypeMap {
    private node: Parser.SyntaxNode;
    private filepath: string;
    private types: Types = {};
    moduleName: string;
    
    constructor(filepath: string, node: Parser.SyntaxNode) {
        this.filepath = filepath;
        this.node = node;
        this.moduleName = Analyzer.getModuleNameFromNode(this.node.tree.rootNode);
    }

    setNode(node: Parser.SyntaxNode) {
        this.node = node;
    }

    getAll(): Types {
        return this.types;
    }

    get(key: string): TypeProperties {
        return this.types[this.moduleName][key];
    }

    set(key: string, props: TypeProperties) {
        this.types[this.moduleName][key] = props;
    }

    insertParent(key: string, prop: TypeProperties) {
        const type = this.get(key);

        if (typeof type.parent == "undefined") {
            //@ts-ignore
            this.types[this.moduleName][key].parent = {};
        }

        //@ts-ignore
        this.types[this.moduleName][key].parent[prop.name] = prop;
    }
 
    register(pType: ParsedType): void {    
        const {name, props} = pType;
        props.file = this.filepath;

        if (typeof props.children == "undefined") {
            props.children = {};
        }
        
        if (Object.keys(this.types).indexOf(this.moduleName) == -1) {
            this.types[this.moduleName] = {};
        }

        this.types[this.moduleName][name] = props;
    }

    registerChild(pType: ParsedType, parent: string) {
        const {name, props} = pType;
        props.file = this.filepath;

        (this.types[this.moduleName][parent].children as { [name: string]: TypeProperties })[name] = props;
    }

    generate(log: boolean = false): void {
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
                                    (n.props.children as { [n: string]: TypeProperties })[p.name] = p.props;
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
                    this.parseStructFields(structProp).forEach(n => { this.registerChild(n, structProp.name) });
                    break;
                case 'enum_declaration':
                    const enumProp = this.parseEnum(node);
                    this.register(enumProp);
                    this.parseEnumValues(enumProp).forEach(n => { this.registerChild(n, enumProp.name) });
                    break;
                case 'method_declaration':
                    const methodProp = this.parseFunction(node);
                    this.parseMethodReceiver(methodProp);
                    break;
                case 'function_declaration':
                    const functionProp = this.parseFunction(node);
                    this.register(functionProp);
                    this.parseFunctionParameters(functionProp).forEach(n => {
                        this.registerChild(n, functionProp.name)
                    });
                    break;
                // case ' ':
                //     break;
                default:
                    break;
            }
        }
    }

    identifyType(node: Parser.SyntaxNode | null): string {
        
        let type = '';
        
        const custom_types = Object.keys(this.types).filter(s => {
            return typeof this.types[this.moduleName][s] !== "undefined" && this.types[this.moduleName][s].type !== "function";
        });
        const basic_types = ['bool', 'string', 'rune', 'i8', 'byte', 'i16', 'u16', 'int', 'u32', 'i64', 'u64', ...new Set(custom_types)];
    
        switch (node?.type) {
            case 'pointer_type':
                let pointer_type = node?.children[0];
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
                type = this.identifyType(consequence as Parser.SyntaxNode);
                break;
            case 'binary_expression':
                type = this.identifyType(node.children[0] as Parser.SyntaxNode);
                break;
            case 'slice_expression':
                type = '';
                break;
            case 'array_type':
                let array_item = node.namedChildren[0];
                let array_type = this.identifyType(array_item);
                type = `[]${array_type}`
                break;
            case 'map_type':
                let key = node?.childForFieldName('key');
                let key_type = this.identifyType(key as Parser.SyntaxNode);
                let value = node?.childForFieldName('value');
                let value_type = this.identifyType(value as Parser.SyntaxNode);
                type = `map[${key_type}]${value_type}`;
                break;
            case 'type_conversion_expression':
                let type_name = node?.childForFieldName('type');
                type = type_name?.text as string;
                break;
            case 'call_expression':
                const fn_name = node?.childForFieldName('function');
                const _fnn = fn_name?.text as string;
                // // console.log(fn_name?.startIndex + ': ' + fn_name?.type);
                if (fn_name?.type === "selector_expression") {
                    type = this.identifyType(fn_name);
                } else {
                    type = basic_types.includes(_fnn) ? _fnn : 'void';
                    // typesmap[_fnn].type ??
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
                type = `?${base_type?.text}`;
                break;
            case 'composite_literal':
                type = node?.childForFieldName('type')?.text as string;
                break;
            case 'function_declaration':
            case 'method_declaration':
                type = buildFnSignature(node, false);
                break;
            case 'selector_expression':
                let s_name = node?.childForFieldName('operand')?.text as string;
                let f_name = node?.childForFieldName('field')?.text as string;
                //@ts-ignore
                // type = typesmap[s_name].fields[f_name] || 'undefined';
                // // console.log(s_name + ': ' + f_name);
                type = 'void';
                break;
            case 'false':
            case 'true':
                type = 'bool';
                break;
            case 'qualified_type':
            case 'type_identifier':
                type = node?.text as string;
                break;
            // case ' ':
            //     type = 'undefined';
            //     break;
            default:  
                type = 'unknown';
                break;  
        }
    
        return type;
    }

    // TODO: Parse Sum types
    parseTypedef(node: Parser.SyntaxNode): ParsedType {
        const spec = findChildByType(node, 'type_spec');
        const typeName = spec?.childForFieldName('name')?.text as string;
        const originalType = this.identifyType(spec?.childForFieldName('type') as SyntaxNode);
    
        return {
            name: typeName, 
            props: {
                type: 'alias_' + originalType,
                name: typeName,
                node,
                returnType: typeName,
                symbolKind: SymbolKind.Object
            }
        };
    }
    
    parseFunction(node: Parser.SyntaxNode): ParsedType {
        let functionName = node.childForFieldName('name')?.text as string;
        let functionReturnType = node?.childForFieldName('result')?.text as string || 'void';

        let functionProps: TypeProperties = {
            type: `function`,
            name: functionName,
            node,
            returnType: functionReturnType,
            symbolKind: SymbolKind.Function,
            children: {}
        };
    
        return {
            name: functionName,
            props: functionProps
        };
    }
    
    parseMethodReceiver(pType: ParsedType): void {
        const node = pType.props.node as Parser.SyntaxNode;
        const receiver = node.childForFieldName('receiver');
        const receiverDeclList = findChildByType(receiver, 'parameter_declaration');
        const originalType = receiverDeclList?.childForFieldName('type')?.text as string;
        const methodName = node.childForFieldName('name')?.text

        pType.props.type = "method";
        pType.props.symbolKind = SymbolKind.Method;

        // TODO: How to store struct methods
        pType.name = originalType + '.' + methodName;
        pType.props.name = pType.name; 
        
        if (typeof this.types[this.moduleName] !== "undefined" && typeof this.get(originalType) !== "undefined") {
            pType.props.parent = this.get(originalType);
        }
        
        this.register(pType);
        this.parseFunctionParameters(pType).forEach(n => {
            this.registerChild(n, pType.name)
        });
    }

    // parseMethodParameters(pType: ParsedType): ParsedType[] {
    //     const node = pType.props.node as Parser.SyntaxNode;
    //     const receiver = node.childForFieldName('receiver');
    //     const declarationList = findChildByType(receiver, 'parameter_declaration');
    //     const originalType = declarationList?.childForFieldName('type');
    //     let originalTypeName = originalType?.text as string;
        
    //     // if (this.moduleName !== "main") {
    //     //     orig_type_name = this.moduleName + '.' + (orig_type?.text as string);
    //     // }
        
    //     if (originalType?.type === 'qualified_type') {
    //         originalTypeName = originalType.text;
    //     }
        
    //     if (typeof this.get(originalTypeName) !== "undefined") {
    //         this.get(orig_type_name).methods?.set(fn_name as string, fn_props)
    //     }
    // }

    parseFunctionParameters(pType: ParsedType): ParsedType[] {
        const node = pType.props.node as Parser.SyntaxNode;
        const parameterList = node.childForFieldName('parameters')?.children || [];
        const parsedFnParameters: ParsedType[] = [];

        for (let pd of parameterList) {
            let paramName = pd.childForFieldName('name')?.text as string;
            if (typeof paramName == "undefined") { continue; }
            // TODO: Use `this.identifyType` for locating types
            const paramDataType = pd.childForFieldName('type')?.text as string;
            paramName = pType.name + '~' + paramName;
            const props: TypeProperties = {
                name: paramName,
                type: "parameter",
                node: pd,
                parent: pType.props,
                returnType: paramDataType,
                symbolKind: SymbolKind.Variable
            }

            parsedFnParameters.push({ name: paramName, props });
        }

        return parsedFnParameters;
    }

    parseFunctionBody(pType: ParsedType): ParsedType[] {
        const parsedFunctionBody: ParsedType[] = [];
        const node = pType.props.node as Parser.SyntaxNode;
        const body = node.childForFieldName('body')?.children;

        if (typeof body == "undefined") {
            return parsedFunctionBody;
        }

        for (let i = 0; i < body.length; i++) {
            let e = body[i];

            if (typeof e === "undefined" || e?.type !== "short_var_declaration") { 
                continue;
            }
            
            parsedFunctionBody.push(this.parseVariable(e));
        }

        return parsedFunctionBody;
    }

    parseInterface(node: Parser.SyntaxNode): ParsedType {
        const interfaceName = findChildByType(node, 'type_identifier')?.text as string;
        const interfaceProp: TypeProperties = {
            type: 'interface',
            name: interfaceName,
            node,
            returnType: 'interface',
            symbolKind: SymbolKind.Interface
        }

        return {
            name: interfaceName,
            props: interfaceProp
        }
    }

    parseInterfaceMethods(pType: ParsedType): ParsedType[] {
        const methodSpecList = findChildByType(pType.props.node as Parser.SyntaxNode, "method_spec_list")?.children || [];
        const parsedInterfaceMethods: ParsedType[] = [];

        for (let ms of methodSpecList) {
            // console.log(ms.text);
            let name = ms.childForFieldName('name')?.text;
            if (typeof name === "undefined") { continue; }
            const returnType = ms.childForFieldName('result')?.text as string;

            let props: TypeProperties = {
                name,
                type: 'interface_method',
                node: ms,
                parent: pType.props,
                returnType: returnType,
                symbolKind: SymbolKind.Field,
                children: {}
            };

            parsedInterfaceMethods.push({ name, props });
        }

        return parsedInterfaceMethods;
    }

    parseConstants(node: Parser.SyntaxNode): ParsedType[] {
        const constants: ParsedType[] = [];

        node.children.forEach(c => {
            const name = c.childForFieldName('name')?.text as string;
            if (typeof name === "undefined") { return; }
            const data = c.childForFieldName('value')?.firstChild;
            const dataType = this.identifyType(data as Parser.SyntaxNode);
            const constProps: TypeProperties = {
                type: 'constant',
                name,
                node,
                returnType: dataType as string,
                symbolKind: SymbolKind.Constant
            };

            constants.push({ name, props: constProps });
        });

        return constants;
    }

    parseStruct(node: Parser.SyntaxNode): ParsedType {
        const structName = findChildByType(node, "type_identifier")?.text as string;    
        return {
            name: structName, 
            props: {
                name: structName,
                type: 'struct',
                node,
                returnType: structName,
                symbolKind: SymbolKind.Struct,
                children: {}
            }
        };
    }

    parseStructFields(pType: ParsedType): ParsedType[] {
        const declarationList = findChildByType(pType.props.node as Parser.SyntaxNode, "field_declaration_list")?.children || [];
        const parsedStructFields: ParsedType[] = [];

        // TODO: Register struct fields
        for (let fd of declarationList) {
            let name = fd.childForFieldName('name')?.text;
            // const structFieldType = this.identifyType(fd.childForFieldName('type') as Parser.SyntaxNode);
            const structFieldType = fd.childForFieldName('type')?.text as string;
            if (typeof name === "undefined") { continue; }
            // // console.log('[parseStructFields] parent of field '+ name +' is ' + pType.props.name);

            const props: TypeProperties = {
                name,
                type: 'struct_field',
                node: fd,
                parent: pType.props,
                returnType: structFieldType,
                symbolKind: SymbolKind.Field
            };

            parsedStructFields.push({ name, props });
        }

        return parsedStructFields;
    }
    
    parseVariable(node: Parser.SyntaxNode, pType?: ParsedType): ParsedType {
        let variableName = node.childForFieldName('left')?.text as string;
        const data = node.childForFieldName('right');
        const dataType = this.identifyType(data as Parser.SyntaxNode);
        const variableProps: TypeProperties = {
            type: 'variable',
            name: variableName,
            node,
            returnType: dataType as string,
            symbolKind: SymbolKind.Variable
        };
    
        if (typeof pType !== "undefined") {
            variableProps.parent = pType.props;
        }

        return {
            name: variableName, 
            props: variableProps
        };
    }
    
    parseEnum(node: Parser.SyntaxNode) : ParsedType {
        const enum_name = findChildByType(node, "type_identifier")?.text as string;

        return {
            name: enum_name, 
            props: {
                name: enum_name,
                type: 'enum',
                node,
                returnType: 'enum',
                symbolKind: SymbolKind.Enum,
                children: {}
            }
        };
    }

    parseEnumValues(pType: ParsedType): ParsedType[] {
        const parsedEnumValues: ParsedType[] = [];
        const declarationList = findChildByType(pType.props.node as Parser.SyntaxNode, "enum_declaration_list")?.children || [];

        for (let fd of declarationList) {
            let name = fd.childForFieldName('name')?.text as string;

            const props: TypeProperties = {
                name,
                type: 'enum_member',
                node: fd,
                parent: pType.props,
                returnType: 'int',
                symbolKind: SymbolKind.EnumMember
            };

            parsedEnumValues.push({ name, props });
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