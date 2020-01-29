import Parser from "web-tree-sitter";

export function buildFnSignature(node: Parser.SyntaxNode | null, withPub: boolean = true): string {
    const isPublic = node?.children.findIndex(x => x.type === "pub_keyword") !== -1;
    const receiver = node?.type === "method_declaration" ? node.childForFieldName('receiver')?.text + ' ' : '';
    const name = node?.childForFieldName('name');
    const params = node?.childForFieldName('parameters');
    const result_t = node?.childForFieldName('result');

    return `${(isPublic && withPub) ? 'pub ' : ''}fn ${receiver}${name?.text}${params?.text} ${result_t !== null ? result_t?.text : 'void'}`
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