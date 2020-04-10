import Parser from "web-tree-sitter";
import { findChildByType, Symbol } from "./types";
import { isNodePublic } from "./utils";

export function buildFnSignature(node: Parser.SyntaxNode, withPub: boolean = true): string {
    const isPublic = isNodePublic(node);
    const receiver = node?.type === "method_declaration" ? node.childForFieldName('receiver')?.text + ' ' : '';
    const name = node?.childForFieldName('name');
    const params = node?.childForFieldName('parameters');
    const result_t = node?.childForFieldName('result');

    return `${(isPublic && withPub) ? 'pub ' : ''}fn ${receiver}${name?.text}${params?.text} ${result_t !== null ? result_t?.text : 'void'}`
}

export function buildEnumSignature(node: Parser.SyntaxNode | null, withPub: boolean = true): string {
    const isPublic = isNodePublic(node);
    const name = findChildByType(node, "type_identifier")?.text as string;
    const declarationList = findChildByType(node, "enum_declaration_list")?.children;
    const members: string[] = [];

    declarationList?.forEach(fd => {
        const memberName = fd.childForFieldName('name')?.text as string;
        if (typeof memberName == "undefined") { return; }
        members.push('    ' + memberName);
    });;

    return `${(isPublic && withPub) ? 'pub ' : ''} enum ${name} {\n${members.join('\n')}\n}`
}

export function buildSignature(pType: Symbol): string {
    const node = pType.node as Parser.SyntaxNode;

    switch (pType.type) {
        case 'struct':
            return buildStructSignature(node, false);
        case 'enum':
            return buildEnumSignature(node, false);
        case 'function':
        case 'method':
            return buildFnSignature(node, false);
        case 'struct_field':
        case 'enum_member':
        case 'variable':
        case 'parameter':
            return buildTypeSignature(pType.name, pType.returnType);
        default:
            return '';
    }
}

export function buildStructSignature(node: Parser.SyntaxNode | null, withPub: boolean = true): string {
    const isPublic = isNodePublic(node);
    const name = findChildByType(node, "type_identifier")?.text as string;
    const declarationList = findChildByType(node, "field_declaration_list")?.children;

    const fields: string[] = [];

    declarationList?.forEach(fd => {
        const fieldName = fd.childForFieldName('name')?.text as string;
        const fieldType = fd.childForFieldName('type')?.text;
        if (typeof fieldName === "undefined") { return; }
    
        fields.push('    ' + fieldName + '   ' + fieldType);
    });

    return `${(isPublic && withPub) ? 'pub ' : ''} struct ${name} {\n${fields.join('\n')}\n}`
}

export function buildTypeSignature(name: string, type: string): string {
    return `${name} ${type}`;
}

export function buildComment(start_node: Parser.SyntaxNode, backwards: boolean = false): string {
    const sibling_key = backwards ? 'previousSibling' : 'nextSibling';
    let comment_arrs: string[] = [];
    let curr_node: Parser.SyntaxNode = start_node;
    let continueC = true;

    if (start_node.type !== "comment") {
        curr_node = start_node[sibling_key] as Parser.SyntaxNode;
    }

    do {
        // thank you - https://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline
        const com = curr_node?.text;
        let multiline = com.split('\n').map(z => z.trim());
        multiline = backwards ? multiline.reverse() : multiline;
        comment_arrs.push(...multiline);

        curr_node = curr_node[sibling_key] as Parser.SyntaxNode;

        if (curr_node.type !== "comment") {
            continueC = false;
        }
    } while (continueC);

    if (backwards) {
        comment_arrs = comment_arrs.reverse();
    }

    comment_arrs = comment_arrs.map(c => {
        
        if (c.startsWith('*/')) {
            return c.replace('*/', '');
        }
        
        if (c.startsWith('/*')) {
            return c.substring('/* '.length, c.length);
        }

        if (c.startsWith('/**')) {
            return c.substring('/** '.length, c.length);
        }

        if (c.startsWith('**')) {
            return c.substring('**'.length, c.length);
        }

        if (c.startsWith('*')) {
            return c.trim().substring('*'.length, c.length);
        }

        if (c.startsWith('//')) {
            return c.substring('// '.length, c.length);
        }
        return c;
    });

    return comment_arrs.join(' \n').trim();
}