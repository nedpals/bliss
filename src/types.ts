import Parser, { SyntaxNode } from "web-tree-sitter";
import { buildFnSignature } from "./signatures";
import { Analyzer } from "./analyzer";

export interface TypeProperties {
    type: string,
    name: string,
    file?: string,
    methods?: TypeMap,
    locals?: TypeMap,
    parent?: TypeProperties,
    node?: Parser.SyntaxNode
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
    private moduleName: string;
    
    constructor(filepath: string, node: Parser.SyntaxNode) {
        this.filepath = filepath;
        this.node = node;
        this.moduleName = Analyzer.getCurrentModule(this.node);
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

    generate(): Types {
        for (let node of this.node.children) {
            switch (node.type) {
                case 'type_declaration':
                    this.register(this.parseTypedef(node));
                    break;
                case 'short_var_declaration':
                    this.register(this.parseVariable(node));
                    break;
                case 'struct_declaration':
                    const structProp = this.parseStruct(node);
                    this.register(structProp);
                    this.parseStructFields(structProp).forEach(n => { this.register(n) });
                    break;
                case 'enum_declaration':
                    const enumProps = this.parseEnum(node);
                    this.register(this.parseEnum(node));
                    this.parseEnumValues(enumProps).forEach(n => { this.register(n) });
                    break;
                case 'method_declaration':
                    const methodProps = this.parseFunction(node);
                    this.parseMethodReceiver(methodProps);
                    this.register(methodProps);
                    this.parseFunctionParameters(methodProps).forEach(n => { this.register(n) });
                    break;
                case 'function_declaration':
                    const functionProps = this.parseFunction(node);
                    this.register(functionProps);
                    this.parseFunctionParameters(functionProps).forEach(n => { this.register(n) });
                    break;
                // case ' ':
                //     break;
                default:
                    break;
            }
        }

        return this.getAll();
    }

    identifyType(node: Parser.SyntaxNode | null): string {
        let type = '';
        const custom_types = Object.keys(this.types).filter((s, i, a) => this.types[this.moduleName][s].type !== "function");
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
                type = 'bool';
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
                // console.log(fn_name?.startIndex + ': ' + fn_name?.type);
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
                // console.log(s_name + ': ' + f_name);
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

    register(pType: ParsedType): void {    
        const {name, props} = pType;
        props.file = this.filepath;
        
        if (Object.keys(this.types).indexOf(this.moduleName) == -1) {
            this.types[this.moduleName] = {};
        }

        this.types[this.moduleName][name] = props;
    }

    parseTypedef(node: Parser.SyntaxNode): ParsedType {
        const spec = findChildByType(node, 'type_spec');
        const typeName = spec?.childForFieldName('name')?.text as string;
        const originalType = this.identifyType(spec?.childForFieldName('type') as SyntaxNode);
    
        return {
            name: typeName, 
            props: {
                type: 'alias_' + originalType,
                name: typeName,
                node
            }
        };
    }
    
    parseFunction(node: Parser.SyntaxNode): ParsedType {
        let functionName = node.childForFieldName('name')?.text as string;

        let functionProps: TypeProperties = {
            type: `function`,
            name: functionName,
            node
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

        pType.name = originalType + '.' + node.childForFieldName('name')?.text;

        if (!['f64'].includes(originalType)) {
            pType.props.parent = this.get(originalType);
        }
        pType.props.name = pType.name;
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
                type: paramDataType,
                node: pd,
                parent: pType.props
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

    parseStruct(node: Parser.SyntaxNode): ParsedType {
        const structName = findChildByType(node, "type_identifier")?.text as string;    
        return {
            name: structName, 
            props: {
                name: structName,
                type: 'struct',
                node
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
            // console.log('[parseStructFields] parent of field '+ name +' is ' + pType.props.name);
            name = pType.name + '.' + name;

            const props: TypeProperties = {
                name,
                type: structFieldType,
                node: fd,
                parent: pType.props
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
            type: dataType,
            name: dataType as string,
            node
        };
    
        if (typeof pType !== "undefined") {
            variableName = pType.name + '~' + variableName;
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
                node
            }
        };
    }

    parseEnumValues(pType: ParsedType): ParsedType[] {
        const parsedEnumValues: ParsedType[] = [];
        const declarationList = findChildByType(pType.props.node as Parser.SyntaxNode, "enum_declaration_list")?.children || [];

        for (let fd of declarationList) {
            const name = fd.childForFieldName('name')?.text as string;
            const props: TypeProperties = {
                name: pType.name + '.' + name,
                type: 'enum_value',
                node: fd,
                parent: pType.props
            };

            parsedEnumValues.push({ name, props });
        }

        return parsedEnumValues;
    }
}
 

export function findChildByType(node: Parser.SyntaxNode | null, name: string): Parser.SyntaxNode | null {
    return node?.children.find(x => x.type === name) || null;
}

export function filterChildrenByType(node: Parser.SyntaxNode | null, name: string | string[]): Parser.SyntaxNode[] | undefined {
    return node?.children?.filter(x => Array.isArray(name) ? name.includes(x.type) : x.type === name);
}