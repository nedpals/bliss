"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signatures_1 = require("./signatures");
exports.typesmap = {};
function declare(node) {
    var _a;
    switch ((_a = node) === null || _a === void 0 ? void 0 : _a.type) {
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
exports.declare = declare;
function identifyType(node) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    let type = '';
    let nType = (_b = (_a = node) === null || _a === void 0 ? void 0 : _a.type, (_b !== null && _b !== void 0 ? _b : 'unknown'));
    switch ((_c = node) === null || _c === void 0 ? void 0 : _c.type) {
        case 'pointer_type':
            let pointer_type = (_d = node) === null || _d === void 0 ? void 0 : _d.children[0];
            type = identifyType(pointer_type);
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
            let array_type = identifyType(array_item);
            type = `[]${array_type}`;
            break;
        case 'map_type':
            let key = (_e = node) === null || _e === void 0 ? void 0 : _e.childForFieldName('key');
            let key_type = identifyType(key);
            let value = (_f = node) === null || _f === void 0 ? void 0 : _f.childForFieldName('value');
            let value_type = identifyType(value);
            type = `map[${key_type}]${value_type}`;
            break;
        case 'type_conversion_expression':
            let type_name = (_g = node) === null || _g === void 0 ? void 0 : _g.childForFieldName('type');
            type = ((_h = type_name) === null || _h === void 0 ? void 0 : _h.text) || '';
            break;
        case 'call_expression':
            const basic_types = ['bool', 'string', 'i8', 'byte', 'i16', 'u16', 'int', 'u32', 'i64', 'u64', ...new Set(Object.values(exports.typesmap).map(t => t.type))];
            const fn_name = (_k = (_j = node) === null || _j === void 0 ? void 0 : _j.childForFieldName('function')) === null || _k === void 0 ? void 0 : _k.text;
            type = basic_types.includes(fn_name) ? fn_name : exports.typesmap[fn_name].type;
            break;
        case 'struct_declaration':
            type = 'struct';
            break;
        case 'enum_declaration':
            type = 'enum';
            break;
        case 'option_type':
            let base_type = findChildByType(node, "type_identifier");
            type = `?${(_l = base_type) === null || _l === void 0 ? void 0 : _l.text}`;
            break;
        case 'composite_literal':
            type = (_o = (_m = node) === null || _m === void 0 ? void 0 : _m.childForFieldName('type')) === null || _o === void 0 ? void 0 : _o.text;
        case 'function_declaration':
        case 'method_declaration':
            type = signatures_1.buildFnSignature(node, false);
            break;
        case 'selector_expression':
            let s_name = (_q = (_p = node) === null || _p === void 0 ? void 0 : _p.childForFieldName('operand')) === null || _q === void 0 ? void 0 : _q.text;
            let f_name = (_s = (_r = node) === null || _r === void 0 ? void 0 : _r.childForFieldName('field')) === null || _s === void 0 ? void 0 : _s.text;
            type = exports.typesmap[s_name].fields[f_name];
            break;
        case 'false':
        case 'true':
            type = 'bool';
            break;
        case 'type_identifier':
            type = (_t = node) === null || _t === void 0 ? void 0 : _t.type;
        default:
            type = 'unknown';
            break;
    }
    return type;
}
exports.identifyType = identifyType;
function findChildByType(node, name) {
    var _a;
    return ((_a = node) === null || _a === void 0 ? void 0 : _a.children.find(x => x.type === name)) || null;
}
exports.findChildByType = findChildByType;
function filterChildrenByType(node, name) {
    var _a, _b;
    return (_b = (_a = node) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.filter(x => Array.isArray(name) ? name.includes(x.type) : x.type === name);
}
exports.filterChildrenByType = filterChildrenByType;
function declareTypedef(node) {
    var _a, _b, _c;
    const spec = findChildByType(node, 'type_spec');
    const type_name = (_b = (_a = spec) === null || _a === void 0 ? void 0 : _a.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
    const orig_type = identifyType((_c = spec) === null || _c === void 0 ? void 0 : _c.childForFieldName('type'));
    exports.typesmap[type_name] = {
        type: orig_type,
        signature: signatures_1.buildTypeSignature(`alias ${type_name}`, orig_type)
    };
}
exports.declareTypedef = declareTypedef;
function declareFunction(node) {
    var _a, _b, _c, _d;
    const fn_name = (_a = node.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
    const declaration_list = (_b = node.childForFieldName('parameters')) === null || _b === void 0 ? void 0 : _b.children;
    const fn_body = node.childForFieldName('body');
    let comment;
    if (((_c = node.previousSibling) === null || _c === void 0 ? void 0 : _c.type) === "comment") {
        comment = signatures_1.buildComment(node, true);
    }
    const locals = {};
    const params = {};
    (_d = declaration_list) === null || _d === void 0 ? void 0 : _d.forEach(pd => {
        var _a;
        const param_name = (_a = pd.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
        if (typeof param_name == "undefined") {
            return;
        }
        const param_type = identifyType(pd.childForFieldName('type'));
        params[param_name] = {
            type: param_type,
            signature: signatures_1.buildTypeSignature(param_name, param_type)
        };
    });
    exports.typesmap[fn_name] = {
        type: `function`,
        signature: signatures_1.buildFnSignature(node),
        comment: comment,
        parameters: params,
        locals
    };
}
exports.declareFunction = declareFunction;
function getCurrentModule(node) {
    const module_clause = filterChildrenByType(node, 'module_clause');
    if (typeof module_clause === "undefined") {
        return 'main';
    }
    const module_name = filterChildrenByType(module_clause[0], 'module_identifier')[0].text;
    return module_name;
}
exports.getCurrentModule = getCurrentModule;
function declareStruct(node) {
    var _a, _b, _c;
    const struct_name = (_a = findChildByType(node, "type_identifier")) === null || _a === void 0 ? void 0 : _a.text;
    const declaration_list = (_b = findChildByType(node, "field_declaration_list")) === null || _b === void 0 ? void 0 : _b.children;
    const fields = {};
    (_c = declaration_list) === null || _c === void 0 ? void 0 : _c.forEach(fd => {
        var _a;
        const field_name = (_a = fd.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
        if (typeof field_name === "undefined") {
            return;
        }
        const field_type = identifyType(fd.childForFieldName('type'));
        fields[field_name] = {
            type: field_type,
            signature: signatures_1.buildTypeSignature(field_name, field_type)
        };
    });
    const dec = Object.keys(fields).map(f => fields[f].signature);
    exports.typesmap[struct_name] = {
        type: 'struct',
        signature: signatures_1.buildTypeSignature(`${struct_name} {${dec.join(', ')}}`, 'struct'),
        fields
    };
}
exports.declareStruct = declareStruct;
function declareVar(node) {
    var _a, _b;
    const var_name = (_a = node.childForFieldName('left')) === null || _a === void 0 ? void 0 : _a.text;
    const content = node.childForFieldName('right');
    const var_type = identifyType(content);
    let comment;
    if (((_b = node.previousSibling) === null || _b === void 0 ? void 0 : _b.type) === "comment") {
        comment = signatures_1.buildComment(node);
    }
    exports.typesmap[var_name] = {
        type: var_type,
        signature: signatures_1.buildTypeSignature(var_name, var_type),
        comment: comment
    };
}
exports.declareVar = declareVar;
function declareEnum(node) {
    var _a, _b, _c;
    const enum_name = (_a = findChildByType(node, "type_identifier")) === null || _a === void 0 ? void 0 : _a.text;
    const declaration_list = (_b = findChildByType(node, "enum_declaration_list")) === null || _b === void 0 ? void 0 : _b.children;
    const fields = {};
    (_c = declaration_list) === null || _c === void 0 ? void 0 : _c.forEach(fd => {
        var _a;
        const field_name = (_a = fd.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
        fields[field_name] = {
            type: 'int',
            signature: signatures_1.buildTypeSignature(field_name, 'int')
        };
    });
    const dec = Object.keys(fields).map(f => fields[f].signature);
    exports.typesmap[enum_name] = {
        type: 'enum',
        signature: signatures_1.buildTypeSignature(`${enum_name} {${dec.join(', ')}}`, 'enum'),
        fields
    };
}
exports.declareEnum = declareEnum;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw2Q0FBa0Y7QUFldkUsUUFBQSxRQUFRLEdBQVksRUFBRSxDQUFDO0FBRWxDLFNBQWdCLE9BQU8sQ0FBQyxJQUE4Qjs7SUFDbEQsY0FBUSxJQUFJLDBDQUFFLElBQUksRUFBRTtRQUNoQixLQUFLLGtCQUFrQjtZQUNuQixjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsTUFBTTtRQUNWLEtBQUssdUJBQXVCO1lBQ3hCLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQixNQUFNO1FBQ1YsS0FBSyxvQkFBb0I7WUFDckIsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BCLE1BQU07UUFDVixLQUFLLGtCQUFrQjtZQUNuQixXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsTUFBTTtRQUNWLEtBQUssb0JBQW9CLENBQUM7UUFDMUIsS0FBSyxzQkFBc0I7WUFDdkIsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RCLE1BQU07UUFDVjtZQUNJLE1BQU07S0FDYjtBQUNMLENBQUM7QUFyQkQsMEJBcUJDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLElBQThCOztJQUN2RCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7SUFDZCxJQUFJLEtBQUssZUFBRyxJQUFJLDBDQUFFLElBQUksdUNBQUksU0FBUyxFQUFBLENBQUM7SUFDcEMsY0FBUSxJQUFJLDBDQUFFLElBQUksRUFBRTtRQUNoQixLQUFLLGNBQWM7WUFDZixJQUFJLFlBQVksU0FBRyxJQUFJLDBDQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLEdBQUcsWUFBWSxDQUFDLFlBQTBCLENBQUMsQ0FBQztRQUNwRCxLQUFLLDRCQUE0QixDQUFDO1FBQ2xDLEtBQUssb0JBQW9CO1lBQ3JCLElBQUksR0FBRyxRQUFRLENBQUM7WUFDaEIs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