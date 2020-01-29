"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signatures_1 = require("./signatures");
exports.typesmap = {};
function insertTypes(root, module_name) {
    var _a;
    (_a = root.children) === null || _a === void 0 ? void 0 : _a.forEach(n => {
        const [name, props] = declare(n);
        if (name.length >= 1) {
            exports.typesmap[`${module_name}.${name}`] = props;
        }
    });
}
exports.insertTypes = insertTypes;
function declare(node) {
    var _a;
    switch ((_a = node) === null || _a === void 0 ? void 0 : _a.type) {
        case 'type_declaration':
            return declareTypedef(node);
        case 'short_var_declaration':
            return declareVar(node);
        case 'struct_declaration':
            return declareStruct(node);
        case 'enum_declaration':
            return declareEnum(node);
        case 'method_declaration':
        case 'function_declaration':
            return declareFunction(node);
        default:
            return ['', {
                    signature: '',
                    type: '',
                }];
    }
}
exports.declare = declare;
function identifyType(node) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    let type = '';
    const custom_types = Object.keys(exports.typesmap).filter((s, i, a) => exports.typesmap[s].type !== "function");
    const basic_types = ['bool', 'string', 'i8', 'byte', 'i16', 'u16', 'int', 'u32', 'i64', 'u64', ...new Set(custom_types)];
    switch ((_a = node) === null || _a === void 0 ? void 0 : _a.type) {
        case 'pointer_type':
            let pointer_type = (_b = node) === null || _b === void 0 ? void 0 : _b.children[0];
            type = identifyType(pointer_type);
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
            type = identifyType(consequence);
            break;
        case 'binary_expression':
            type = 'bool';
            break;
        case 'slice_expression':
            type = '';
            break;
        case 'array_type':
            let array_item = node.namedChildren[0];
            let array_type = identifyType(array_item);
            type = `[]${array_type}`;
            break;
        case 'map_type':
            let key = (_c = node) === null || _c === void 0 ? void 0 : _c.childForFieldName('key');
            let key_type = identifyType(key);
            let value = (_d = node) === null || _d === void 0 ? void 0 : _d.childForFieldName('value');
            let value_type = identifyType(value);
            type = `map[${key_type}]${value_type}`;
            break;
        case 'type_conversion_expression':
            let type_name = (_e = node) === null || _e === void 0 ? void 0 : _e.childForFieldName('type');
            type = (_f = type_name) === null || _f === void 0 ? void 0 : _f.text;
            break;
        case 'call_expression':
            const fn_name = (_g = node) === null || _g === void 0 ? void 0 : _g.childForFieldName('function');
            const _fnn = (_h = fn_name) === null || _h === void 0 ? void 0 : _h.text;
            console.log(((_j = fn_name) === null || _j === void 0 ? void 0 : _j.startIndex) + ': ' + ((_k = fn_name) === null || _k === void 0 ? void 0 : _k.type));
            if (((_l = fn_name) === null || _l === void 0 ? void 0 : _l.type) === "selector_expression") {
                type = identifyType(fn_name);
            }
            else {
                type = basic_types.includes(_fnn) ? _fnn : 'void';
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
            type = `?${(_m = base_type) === null || _m === void 0 ? void 0 : _m.text}`;
            break;
        case 'composite_literal':
            type = (_p = (_o = node) === null || _o === void 0 ? void 0 : _o.childForFieldName('type')) === null || _p === void 0 ? void 0 : _p.text;
            break;
        case 'function_declaration':
        case 'method_declaration':
            type = signatures_1.buildFnSignature(node, false);
            break;
        case 'selector_expression':
            let s_name = (_r = (_q = node) === null || _q === void 0 ? void 0 : _q.childForFieldName('operand')) === null || _r === void 0 ? void 0 : _r.text;
            let f_name = (_t = (_s = node) === null || _s === void 0 ? void 0 : _s.childForFieldName('field')) === null || _t === void 0 ? void 0 : _t.text;
            type = 'void';
            break;
        case 'false':
        case 'true':
            type = 'bool';
            break;
        case 'type_identifier':
            type = (_u = node) === null || _u === void 0 ? void 0 : _u.text;
            break;
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
    return [type_name, {
            type: orig_type,
            signature: signatures_1.buildTypeSignature(`alias ${type_name}`, orig_type)
        }];
}
exports.declareTypedef = declareTypedef;
function declareFunction(node) {
    var _a, _b, _c, _d, _e, _f, _g;
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
    if (typeof ((_e = fn_body) === null || _e === void 0 ? void 0 : _e.children) !== "undefined" && ((_f = fn_body) === null || _f === void 0 ? void 0 : _f.children.length) !== 0) {
        (_g = fn_body) === null || _g === void 0 ? void 0 : _g.children.forEach((e, i) => {
            var _a, _b;
            if (typeof e === "undefined") {
                return;
            }
            if (((_a = e) === null || _a === void 0 ? void 0 : _a.type) !== "short_var_declaration") {
                return;
            }
            const var_name = (_b = e.childForFieldName('left')) === null || _b === void 0 ? void 0 : _b.text;
            const var_content = e.childForFieldName('right');
            const var_type = identifyType(var_content);
        });
    }
    return [fn_name, {
            type: `function`,
            signature: signatures_1.buildFnSignature(node),
            comment: comment,
            parameters: params,
            locals
        }];
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
    return [struct_name, {
            type: 'struct',
            signature: signatures_1.buildTypeSignature(`${struct_name} {${dec.join(', ')}}`, 'struct'),
            fields
        }];
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
    return [var_name, {
            type: var_type,
            signature: signatures_1.buildTypeSignature(var_name, var_type),
            comment: comment
        }];
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
    return [enum_name, {
            type: 'enum',
            signature: signatures_1.buildTypeSignature(`${enum_name} {${dec.join(', ')}}`, 'enum'),
            fields
        }];
}
exports.declareEnum = declareEnum;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw2Q0FBa0Y7QUFnQnJFLFFBQUEsUUFBUSxHQUFZLEVBQUUsQ0FBQztBQUVwQyxTQUFnQixXQUFXLENBQUMsSUFBdUIsRUFBRSxXQUFtQjs7SUFDcEUsTUFBQSxJQUFJLENBQUMsUUFBUSwwQ0FBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDdkIsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakMsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNsQixnQkFBUSxDQUFDLEdBQUcsV0FBVyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQzlDO0lBQ0wsQ0FBQyxFQUFFO0FBQ1AsQ0FBQztBQVJELGtDQVFDO0FBRUQsU0FBZ0IsT0FBTyxDQUFDLElBQThCOztJQUdsRCxjQUFRLElBQUksMENBQUUsSUFBSSxFQUFFO1FBQ2hCLEtBQUssa0JBQWtCO1lBQ25CLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLEtBQUssdUJBQXVCO1lBQ3hCLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLEtBQUssb0JBQW9CO1lBQ3JCLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLEtBQUssa0JBQWtCO1lBQ25CLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLEtBQUssb0JBQW9CLENBQUM7UUFDMUIsS0FBSyxzQkFBc0I7WUFDdkIsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakM7WUFDSSxPQUFPLENBQUMsRUFBRSxFQUFFO29CQUNSLFNBQVMsRUFBRSxFQUFFO29CQUNiLElBQUksRUFBRSxFQUFFO2lCQUNYLENBQUMsQ0FBQTtLQUNUO0FB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