"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const utils_1 = require("./utils");
function buildFnSignature(node, withPub = true) {
    var _a;
    const isPublic = utils_1.isNodePublic(node);
    const receiver = (node === null || node === void 0 ? void 0 : node.type) === "method_declaration" ? ((_a = node.childForFieldName('receiver')) === null || _a === void 0 ? void 0 : _a.text) + ' ' : '';
    const name = node === null || node === void 0 ? void 0 : node.childForFieldName('name');
    const params = node === null || node === void 0 ? void 0 : node.childForFieldName('parameters');
    const result_t = node === null || node === void 0 ? void 0 : node.childForFieldName('result');
    return `${(isPublic && withPub) ? 'pub ' : ''}fn ${receiver}${name === null || name === void 0 ? void 0 : name.text}${params === null || params === void 0 ? void 0 : params.text} ${result_t !== null ? result_t === null || result_t === void 0 ? void 0 : result_t.text : 'void'}`;
}
exports.buildFnSignature = buildFnSignature;
function buildEnumSignature(node, withPub = true) {
    var _a, _b;
    const isPublic = utils_1.isNodePublic(node);
    const name = (_a = types_1.findChildByType(node, "type_identifier")) === null || _a === void 0 ? void 0 : _a.text;
    const declarationList = (_b = types_1.findChildByType(node, "enum_declaration_list")) === null || _b === void 0 ? void 0 : _b.children;
    const members = [];
    declarationList === null || declarationList === void 0 ? void 0 : declarationList.forEach(fd => {
        var _a;
        const memberName = (_a = fd.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
        if (typeof memberName == "undefined") {
            return;
        }
        members.push('    ' + memberName);
    });
    ;
    return `${(isPublic && withPub) ? 'pub ' : ''} enum ${name} {\n${members.join('\n')}\n}`;
}
exports.buildEnumSignature = buildEnumSignature;
function buildSignature(pType) {
    const node = pType.node;
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
exports.buildSignature = buildSignature;
function buildStructSignature(node, withPub = true) {
    var _a, _b;
    const isPublic = utils_1.isNodePublic(node);
    const name = (_a = types_1.findChildByType(node, "type_identifier")) === null || _a === void 0 ? void 0 : _a.text;
    const declarationList = (_b = types_1.findChildByType(node, "field_declaration_list")) === null || _b === void 0 ? void 0 : _b.children;
    const fields = [];
    declarationList === null || declarationList === void 0 ? void 0 : declarationList.forEach(fd => {
        var _a, _b;
        const fieldName = (_a = fd.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
        const fieldType = (_b = fd.childForFieldName('type')) === null || _b === void 0 ? void 0 : _b.text;
        if (typeof fieldName === "undefined") {
            return;
        }
        fields.push('    ' + fieldName + '   ' + fieldType);
    });
    return `${(isPublic && withPub) ? 'pub ' : ''} struct ${name} {\n${fields.join('\n')}\n}`;
}
exports.buildStructSignature = buildStructSignature;
function buildTypeSignature(name, type) {
    return `${name} ${type}`;
}
exports.buildTypeSignature = buildTypeSignature;
function buildComment(start_node, backwards = false) {
    const sibling_key = backwards ? 'previousSibling' : 'nextSibling';
    let comment_arrs = [];
    let curr_node = start_node;
    let continueC = true;
    if (start_node.type !== "comment") {
        curr_node = start_node[sibling_key];
    }
    do {
        const com = curr_node === null || curr_node === void 0 ? void 0 : curr_node.text;
        let multiline = com.split('\n').map(z => z.trim());
        multiline = backwards ? multiline.reverse() : multiline;
        comment_arrs.push(...multiline);
        curr_node = curr_node[sibling_key];
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
exports.buildComment = buildComment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmF0dXJlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQWtEO0FBQ2xELG1DQUF1QztBQUV2QyxTQUFnQixnQkFBZ0IsQ0FBQyxJQUF1QixFQUFFLFVBQW1CLElBQUk7O0lBQzdFLE1BQU0sUUFBUSxHQUFHLG9CQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsTUFBTSxRQUFRLEdBQUcsQ0FBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsSUFBSSxNQUFLLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxPQUFBLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsMENBQUUsSUFBSSxJQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzNHLE1BQU0sSUFBSSxHQUFHLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDckQsTUFBTSxRQUFRLEdBQUcsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRW5ELE9BQU8sR0FBRyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sUUFBUSxHQUFHLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxJQUFJLEdBQUcsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLElBQUksSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxN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