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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmF0dXJlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zaWduYXR1cmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQTBEO0FBQzFELG1DQUF1QztBQUV2QyxTQUFnQixnQkFBZ0IsQ0FBQyxJQUE4QixFQUFFLFVBQW1CLElBQUk7O0lBQ3BGLE1BQU0sUUFBUSxHQUFHLG9CQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsTUFBTSxRQUFRLEdBQUcsQ0FBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsSUFBSSxNQUFLLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxPQUFBLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsMENBQUUsSUFBSSxJQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzNHLE1BQU0sSUFBSSxHQUFHLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDckQsTUFBTSxRQUFRLEdBQUcsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRW5ELE9BQU8sR0FBRyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sUUFBUSxHQUFHLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxJQUFJLEdBQUcsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLElBQUksSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxN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