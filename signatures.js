"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildFnSignature(node, withPub = true) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const isPublic = ((_a = node) === null || _a === void 0 ? void 0 : _a.children.findIndex(x => x.type === "pub_keyword")) !== -1;
    const receiver = ((_b = node) === null || _b === void 0 ? void 0 : _b.type) === "method_declaration" ? ((_c = node.childForFieldName('receiver')) === null || _c === void 0 ? void 0 : _c.text) + ' ' : '';
    const name = (_d = node) === null || _d === void 0 ? void 0 : _d.childForFieldName('name');
    const params = (_e = node) === null || _e === void 0 ? void 0 : _e.childForFieldName('parameters');
    const result_t = (_f = node) === null || _f === void 0 ? void 0 : _f.childForFieldName('result');
    return `${(isPublic && withPub) ? 'pub ' : ''}fn ${receiver}${(_g = name) === null || _g === void 0 ? void 0 : _g.text}${(_h = params) === null || _h === void 0 ? void 0 : _h.text} ${result_t !== null ? (_j = result_t) === null || _j === void 0 ? void 0 : _j.text : 'void'}`;
}
exports.buildFnSignature = buildFnSignature;
function buildTypeSignature(name, type) {
    return `${name} ${type}`;
}
exports.buildTypeSignature = buildTypeSignature;
function buildComment(start_node, backwards = false) {
    var _a;
    const sibling_key = backwards ? 'previousSibling' : 'nextSibling';
    let comment_arrs = [];
    let curr_node = start_node;
    let continueC = true;
    if (start_node.type !== "comment") {
        curr_node = start_node[sibling_key];
    }
    do {
        const com = (_a = curr_node) === null || _a === void 0 ? void 0 : _a.text;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbmF0dXJlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9zaWduYXR1cmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsU0FBZ0IsZ0JBQWdCLENBQUMsSUFBOEIsRUFBRSxVQUFtQixJQUFJOztJQUNwRixNQUFNLFFBQVEsR0FBRyxPQUFBLElBQUksMENBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssYUFBYSxPQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLE1BQU0sUUFBUSxHQUFHLE9BQUEsSUFBSSwwQ0FBRSxJQUFJLE1BQUssb0JBQW9CLENBQUMsQ0FBQyxDQUFDLE9BQUEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQywwQ0FBRSxJQUFJLElBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDM0csTUFBTSxJQUFJLFNBQUcsSUFBSSwwQ0FBRSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxNQUFNLE1BQU0sU0FBRyxJQUFJLDBDQUFFLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ3JELE1BQU0sUUFBUSxTQUFHLElBQUksMENBQUUsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbkQsT0FBTyxHQUFHLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxRQUFRLEdBQUcsTUFBQSxJQUFJLDBDQUFFLElBQUksR0FBRyxNQUFBLE1BQU0sMENBQUUsSUFBSSxJQUFJLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxPQUFDLFFBQVEsMENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUM1SSxDQUFDO0FBUkQsNENBUUM7QUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxJQUFZLEVBQUUsSUFBWTtJQUN6RCxPQUFP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