import Parser, { SyntaxNode } from "web-tree-sitter";
import { buildComment, buildTypeSignature, buildFnSignature } from "./signatures";
import { type } from "os";

interface TypeProperties {
    type: string,
    signature: string,
    comment?: string | null,
    fields?: TypeMap,
    [f: string]: any 
}

interface TypeMap {
    [x: string]: TypeProperties
}

export let typesmap: TypeMap = {};

export function declare(node: Parser.SyntaxNode | null) {
    switch (node?.type) {
        case 'type_declaration':
            declareTypedef(node);
            break;
        case 'short_var_declaration':
            declareVar(node);
            break;
        case 'struct_declaration':
            declareStruct(node);
            break;
        case 'enum_declaration':
            declareEnum(node);
            break;
        case 'method_declaration':
        case 'function_declaration':
            declareFunction(node);
            break;
        default:
            break;
    }
}

export function identifyType(node: Parser.SyntaxNode | null): string {
    let type = '';
    let nType = node?.type ?? 'unknown';
    switch (node?.type) {
        case 'pointer_type':
            let pointer_type = node?.children[0];
            type = identifyType(pointer_type as SyntaxNode);
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
            type = identifyType(consequence);
            break;
        case 'binary_expression':
            type = 'bool';
            break;
        case 'slice_expression':
            type = '';
            break;
        case 'array_type':
            let array_item = findChildByType(node, "item");
            let array_type = identifyType(array_item as SyntaxNode);
            type = `[]${array_type}`
            break;
        case 'map_type':
            let key = node?.childForFieldName('key');
            let key_type = identifyType(key as SyntaxNode);
            let value = node?.childForFieldName('value');
            let value_type = identifyType(value as SyntaxNode);
            type = `map[${key_type}]${value_type}`;
            break;
        case 'type_conversion_expression':
            let type_name = node?.childForFieldName('type');
            type = type_name?.text || '';
            break;
        case 'call_expression':
            const basic_types = ['bool', 'string', 'i8', 'byte', 'i16', 'u16', 'int', 'u32', 'i64', 'u64', ...new Set(Object.values(typesmap).map(t => t.type))];
            const fn_name = node?.childForFieldName('function')?.text as string;
            type = basic_types.includes(fn_name) ? fn_name : typesmap[fn_name].type;
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
        case 'function_declaration':
        case 'method_declaration':
            type = buildFnSignature(node, false);
            break;
        case 'selector_expression':
            let s_name = node?.childForFieldName('operand')?.text as string;
            let f_name = node?.childForFieldName('field')?.text as string;
            //@ts-ignore
            type = typesmap[s_name].fields[f_name];
            break;
        case 'false':
        case 'true':
            type = 'bool';
            break;
        case 'type_identifier':
            type = node?.type as string;
        default:  
            type = 'unknown';
            break;  
    }

    return type;
}

export function findChildByType(node: Parser.SyntaxNode | null, name: string): Parser.SyntaxNode | null {
    return node?.children.find(x => x.type === name) || null;
}

export function filterChildrenByType(node: Parser.SyntaxNode | null, name: string | string[]): Parser.SyntaxNode[] | undefined {
    return node?.children?.filter(x => Array.isArray(name) ? name.includes(x.type) : x.type === name);
}

export function declareTypedef(node: Parser.SyntaxNode) {
    const spec = findChildByType(node, 'type_spec');
    const type_name = spec?.childForFieldName('name')?.text as string;
    const orig_type = identifyType(spec?.childForFieldName('type') as SyntaxNode);

    typesmap[type_name as string] = {
        type: orig_type,
        signature: buildTypeSignature(`alias ${type_name}`, orig_type)
    }
}

export function declareFunction(node: Parser.SyntaxNode) {
    const fn_name = node.childForFieldName('name')?.text;
    const declaration_list = node.childForFieldName('parameters')?.children;
    const fn_body = node.childForFieldName('body');
    let comment;

    if (node.previousSibling?.type === "comment") {
        comment = buildComment(node, true);
    }

    const locals: TypeMap = {};
    const params: TypeMap = {};

    declaration_list?.forEach(pd => {
        const param_name = pd.childForFieldName('name')?.text;
        if (typeof param_name == "undefined") { return; }

        const param_type = identifyType(pd.childForFieldName('type'));

        params[param_name as string] = {
            type: param_type,
            signature: buildTypeSignature(param_name as string, param_type)
        };
    });

    // fn_body?.children.forEach((e, i) => {
    //     if (typeof e === "undefined") { return; }
    //     if (e?.type !== "short_var_declaration") { return; }
    //     const var_name = e.childForFieldName('left')?.text;
    //     const var_content = e.childForFieldName('right');
    //     const var_type = identifyType(var_content);

    //     // console.log(var_type);

    //     locals[var_name as string] = {
    //         type: '',
    //         signature: buildTypeSignature(var_name as string, '')
    //     }
    // });

    typesmap[fn_name as string] = {
        type: `function`,
        signature: buildFnSignature(node),
        comment: comment,
        parameters: params,
        locals
    }

    // console.log(locals);
}

export function getCurrentModule(node: Parser.SyntaxNode): string {
    const module_clause = filterChildrenByType(node, 'module_clause');
    if (typeof module_clause === "undefined") { return 'main'; }

    //@ts-ignore
    const module_name = filterChildrenByType(module_clause[0], 'module_identifier')[0].text;
    return module_name;
}

export function declareStruct(node: Parser.SyntaxNode) {
    const struct_name = findChildByType(node, "type_identifier")?.text as string;
    const declaration_list = findChildByType(node, "field_declaration_list")?.children;

    const fields: TypeMap = {};

    declaration_list?.forEach(fd => {
        const field_name = fd.childForFieldName('name')?.text as string;
        if (typeof field_name === "undefined") { return; }
        const field_type = identifyType(fd.childForFieldName('type') as SyntaxNode);

        fields[field_name] = {
            type: field_type,
            signature: buildTypeSignature(field_name, field_type)
        } 
    });

    const dec = Object.keys(fields).map(f => fields[f].signature);

    typesmap[struct_name] = {
        type: 'struct',
        signature: buildTypeSignature(`${struct_name} {${dec.join(', ')}}`, 'struct'),
        fields
    };
}

export function declareVar(node: Parser.SyntaxNode) {
    const var_name = node.childForFieldName('left')?.text;
    const content = node.childForFieldName('right');
    const var_type = identifyType(content as SyntaxNode);
    let comment;

    if (node.previousSibling?.type === "comment") {
        comment = buildComment(node);
    }

    typesmap[var_name as string] = {
        type: var_type,
        signature: buildTypeSignature(var_name as string, var_type),
        comment: comment
    }
}

export function declareEnum(node: Parser.SyntaxNode) {
    const enum_name = findChildByType(node, "type_identifier")?.text as string;
    const declaration_list = findChildByType(node, "enum_declaration_list")?.children;

    const fields: TypeMap = {};

    declaration_list?.forEach(fd => {
        const field_name = fd.childForFieldName('name')?.text as string;

        fields[field_name] = {
            type: 'int',
            signature: buildTypeSignature(field_name, 'int')
        } 
    });

    const dec = Object.keys(fields).map(f => fields[f].signature);

    typesmap[enum_name] = {
        type: 'enum',
        signature: buildTypeSignature(`${enum_name} {${dec.join(', ')}}`, 'enum'),
        fields
    };
}