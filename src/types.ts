import Parser, { SyntaxNode } from "web-tree-sitter";
import { buildComment, buildTypeSignature, buildFnSignature } from "./signatures";
import { Module } from "./imports";

export interface TypeProperties {
    type: string,
    signature: string,
    comment?: string | null,
    fields?: TypeMap,
    module?: Module,
    methods?: TypeMap | undefined,
    locals?: TypeMap | undefined,
    [f: string]: any 
}

export class TypeMap {
    private types: { [x: string]: TypeProperties } = {};
    private moduleName: string;
    
    constructor(moduleName: string) {
        this.moduleName = moduleName;
    }

    getAll(): { [x: string]: TypeProperties } {
        return this.types;
    }

    get(key: string): TypeProperties {
        return this.types[key];
    }

    set(key: string, props: TypeProperties) {
        this.types[key] = props;
    }

    setModuleName(name: string) {
        this.moduleName = name;
    }

    insertType(root: Parser.SyntaxNode): void {
        root.children?.forEach(async n => {
            const [name, props] = await this.declare(n);
            if (name.length >= 1 && typeof this.moduleName !== "undefined") {
                props.module = this.moduleName;
                this.types[this.moduleName === "main" ? name : `${this.moduleName}.${name}`] = props;
            }
        });
    }

    identifyType(node: Parser.SyntaxNode | null): string {
        let type = '';
        const custom_types = Object.keys(this.types).filter((s, i, a) => this.types[s].type !== "function");
        const basic_types = ['bool', 'string', 'i8', 'byte', 'i16', 'u16', 'int', 'u32', 'i64', 'u64', ...new Set(custom_types)];
    
        switch (node?.type) {
            case 'pointer_type':
                let pointer_type = node?.children[0];
                type = this.identifyType(pointer_type as SyntaxNode);
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
                type = 'bool';
                break;
            case 'slice_expression':
                type = '';
                break;
            case 'array_type':
                let array_item = node.namedChildren[0];
                let array_type = this.identifyType(array_item as SyntaxNode);
                type = `[]${array_type}`
                break;
            case 'map_type':
                let key = node?.childForFieldName('key');
                let key_type = this.identifyType(key as SyntaxNode);
                let value = node?.childForFieldName('value');
                let value_type = this.identifyType(value as SyntaxNode);
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
            // case undefined:
            //     type = 'undefined';
            //     break;
            default:  
                type = 'unknown';
                break;  
        }
    
        return type;
    }

    declare(node: Parser.SyntaxNode | null): [string, TypeProperties] {    
        switch (node?.type) {
            case 'type_declaration':
                return this.declareTypedef(node);
            case 'short_var_declaration':
                return this.declareVar(node);
            case 'struct_declaration':
                return this.declareStruct(node);
            case 'enum_declaration':
                return this.declareEnum(node);
            case 'method_declaration':
            case 'function_declaration':
                return this.declareFunction(node);
            default:
                return ['', {
                    signature: '',
                    type: '',
                }]
        }
    }

    declareTypedef(node: Parser.SyntaxNode): [string, TypeProperties] {
        const spec = findChildByType(node, 'type_spec');
        const type_name = spec?.childForFieldName('name')?.text as string;
        const orig_type = this.identifyType(spec?.childForFieldName('type') as SyntaxNode);
    
        return [type_name as string, {
            type: orig_type,
            signature: buildTypeSignature(`(alias) ${type_name}`, orig_type)
        }]
    }
    
    declareFunction(node: Parser.SyntaxNode): [string, TypeProperties] {
        const fn_receiver = node.childForFieldName('receiver');
        const fn_name = node.childForFieldName('name')?.text;
        const declaration_list = node.childForFieldName('parameters')?.children;
        const fn_body = node.childForFieldName('body');
        let comment;
    
        if (node.previousSibling?.type === "comment") {
            comment = buildComment(node, true);
        }
    
        const locals: TypeMap = new TypeMap(this.moduleName);
        const params: TypeMap = new TypeMap(this.moduleName);
    
        declaration_list?.forEach(pd => {
            const param_name = pd.childForFieldName('name')?.text;
            if (typeof param_name == "undefined") { return; }
    
            const param_type = this.identifyType(pd.childForFieldName('type'));
    
            params.set(param_name, {
                type: param_type,
                signature: buildTypeSignature(param_name as string, param_type)
            });
        });
    
        if (typeof fn_body?.children !== "undefined" && fn_body?.children.length !== 0) {
            fn_body?.children.forEach((e, i) => {
                if (typeof e === "undefined") { return; }
                if (e?.type !== "short_var_declaration") { return; }
                const var_name = e.childForFieldName('left')?.text;
                const var_content = e.childForFieldName('right');
                const var_type = this.identifyType(var_content);
        
                // console.log(var_name, var_type);
                // locals[var_name as string] = {
                //     type: var_type,
                //     signature: buildTypeSignature(var_name as string, var_type)
                // }
                locals.set(var_name as string, {
                    type: var_type,
                    signature: buildTypeSignature(var_name as string, var_type)
                })
            });
        }

        if (fn_receiver !== null) {
            const receiver_decl_list = findChildByType(fn_receiver, 'parameter_declaration');
            const orig_type = receiver_decl_list?.childForFieldName('type');
            let orig_type_name = orig_type?.text as string;
            
            if (this.moduleName !== "main") {
                orig_type_name = this.moduleName + '.' + (orig_type?.text as string);
            }
            
            if (orig_type?.type === 'qualified_type') {
                orig_type_name = orig_type.text;
            }
            
            if (typeof this.get(orig_type_name) !== "undefined") {
                this.get(orig_type_name).methods?.set(fn_name as string, {
                    type: `function`,
                    signature: buildFnSignature(node),
                    comment: comment,
                    parameters: params,
                    locals
                });

            }
        }
    
        return [fn_name as string, {
            type: `function`,
            signature: buildFnSignature(node),
            comment: comment,
            parameters: params,
            locals
        }];
    }
    
    declareStruct(node: Parser.SyntaxNode): [string, TypeProperties] {
        const struct_name = findChildByType(node, "type_identifier")?.text as string;
        const declaration_list = findChildByType(node, "field_declaration_list")?.children;
    
        const fields: TypeMap = new TypeMap(this.moduleName);
        const methods: TypeMap = new TypeMap(this.moduleName);

        declaration_list?.forEach(fd => {
            const field_name = fd.childForFieldName('name')?.text as string;
            if (typeof field_name === "undefined") { return; }
            const field_type = this.identifyType(fd.childForFieldName('type') as SyntaxNode);
    
            fields.set(field_name, {
                type: field_type,
                signature: buildTypeSignature(field_name, field_type)
            });
        });
    
        const dec = Object.keys(fields.types).map(f => fields.types[f].signature);
    
        return [struct_name, {
            type: 'struct',
            signature: buildTypeSignature(`${struct_name} {${dec.join(', ')}}`, 'struct'),
            fields,
            methods
        }];
    }
    
    declareVar(node: Parser.SyntaxNode): [string, TypeProperties] {
        const var_name = node.childForFieldName('left')?.text;
        const content = node.childForFieldName('right');
        const var_type = this.identifyType(content as SyntaxNode);
        let comment;
    
        if (node.previousSibling?.type === "comment") {
            comment = buildComment(node);
        }
    
        return [var_name as string, {
            type: var_type,
            signature: buildTypeSignature(var_name as string, var_type),
            comment: comment
        }]
    }
    
    declareEnum(node: Parser.SyntaxNode): [string, TypeProperties] {
        const enum_name = findChildByType(node, "type_identifier")?.text as string;
        const declaration_list = findChildByType(node, "enum_declaration_list")?.children;
    
        const fields: TypeMap = new TypeMap(this.moduleName);
    
        declaration_list?.forEach(fd => {
            const field_name = fd.childForFieldName('name')?.text as string;
    
            fields.set(field_name, {
                type: 'int',
                signature: buildTypeSignature(field_name, 'int')
            });
        });
    
        const dec = Object.keys(fields.types).map(f => fields.types[f].signature);
    
        return [enum_name, {
            type: 'enum',
            signature: buildTypeSignature(`${enum_name} {${dec.join(', ')}}`, 'enum'),
            fields
        }];
    }
}
 

export function findChildByType(node: Parser.SyntaxNode | null, name: string): Parser.SyntaxNode | null {
    return node?.children.find(x => x.type === name) || null;
}

export function filterChildrenByType(node: Parser.SyntaxNode | null, name: string | string[]): Parser.SyntaxNode[] | undefined {
    return node?.children?.filter(x => Array.isArray(name) ? name.includes(x.type) : x.type === name);
}