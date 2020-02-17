"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const signatures_1 = require("./signatures");
class TypeMap {
    constructor(moduleName) {
        this.types = {};
        this.moduleName = moduleName;
    }
    getAll() {
        return this.types;
    }
    get(key) {
        return this.types[key];
    }
    set(key, props) {
        this.types[key] = props;
    }
    setModuleName(name) {
        this.moduleName = name;
    }
    insertTypeFromTree(root) {
        var _a;
        (_a = root.children) === null || _a === void 0 ? void 0 : _a.forEach((n) => __awaiter(this, void 0, void 0, function* () {
            const [name, props] = yield this.register(n);
            if (name.length >= 1 && typeof this.moduleName !== "undefined") {
                props.module = this.moduleName;
                this.types[this.moduleName === "main" ? name : `${this.moduleName}.${name}`] = props;
            }
        }));
    }
    identifyType(node) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        let type = '';
        const custom_types = Object.keys(this.types).filter((s, i, a) => this.types[s].type !== "function");
        const basic_types = ['bool', 'string', 'i8', 'byte', 'i16', 'u16', 'int', 'u32', 'i64', 'u64', ...new Set(custom_types)];
        switch ((_a = node) === null || _a === void 0 ? void 0 : _a.type) {
            case 'pointer_type':
                let pointer_type = (_b = node) === null || _b === void 0 ? void 0 : _b.children[0];
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
                let array_type = this.identifyType(array_item);
                type = `[]${array_type}`;
                break;
            case 'map_type':
                let key = (_c = node) === null || _c === void 0 ? void 0 : _c.childForFieldName('key');
                let key_type = this.identifyType(key);
                let value = (_d = node) === null || _d === void 0 ? void 0 : _d.childForFieldName('value');
                let value_type = this.identifyType(value);
                type = `map[${key_type}]${value_type}`;
                break;
            case 'type_conversion_expression':
                let type_name = (_e = node) === null || _e === void 0 ? void 0 : _e.childForFieldName('type');
                type = (_f = type_name) === null || _f === void 0 ? void 0 : _f.text;
                break;
            case 'call_expression':
                const fn_name = (_g = node) === null || _g === void 0 ? void 0 : _g.childForFieldName('function');
                const _fnn = (_h = fn_name) === null || _h === void 0 ? void 0 : _h.text;
                if (((_j = fn_name) === null || _j === void 0 ? void 0 : _j.type) === "selector_expression") {
                    type = this.identifyType(fn_name);
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
                type = `?${(_k = base_type) === null || _k === void 0 ? void 0 : _k.text}`;
                break;
            case 'composite_literal':
                type = (_m = (_l = node) === null || _l === void 0 ? void 0 : _l.childForFieldName('type')) === null || _m === void 0 ? void 0 : _m.text;
                break;
            case 'function_declaration':
            case 'method_declaration':
                type = signatures_1.buildFnSignature(node, false);
                break;
            case 'selector_expression':
                let s_name = (_p = (_o = node) === null || _o === void 0 ? void 0 : _o.childForFieldName('operand')) === null || _p === void 0 ? void 0 : _p.text;
                let f_name = (_r = (_q = node) === null || _q === void 0 ? void 0 : _q.childForFieldName('field')) === null || _r === void 0 ? void 0 : _r.text;
                type = 'void';
                break;
            case 'false':
            case 'true':
                type = 'bool';
                break;
            case 'qualified_type':
            case 'type_identifier':
                type = (_s = node) === null || _s === void 0 ? void 0 : _s.text;
                break;
            default:
                type = 'unknown';
                break;
        }
        return type;
    }
    register(node) {
        var _a;
        switch ((_a = node) === null || _a === void 0 ? void 0 : _a.type) {
            case 'type_declaration':
                return this.registerTypedef(node);
            case 'short_var_declaration':
                return this.registerVar(node);
            case 'struct_declaration':
                return this.registerStruct(node);
            case 'enum_declaration':
                return this.registerEnum(node);
            case 'method_declaration':
            case 'function_declaration':
                return this.registerFunction(node);
            default:
                return ['', {
                        signature: '',
                        type: '',
                        range: { start: [], end: [] }
                    }];
        }
    }
    registerTypedef(node) {
        var _a, _b, _c;
        const spec = findChildByType(node, 'type_spec');
        const type_name = (_b = (_a = spec) === null || _a === void 0 ? void 0 : _a.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
        const orig_type = this.identifyType((_c = spec) === null || _c === void 0 ? void 0 : _c.childForFieldName('type'));
        return [type_name, {
                type: orig_type,
                signature: signatures_1.buildTypeSignature(`(alias) ${type_name}`, orig_type),
                range: {
                    start: [node.startPosition.column + 1, node.startPosition.row + 1],
                    end: [node.endPosition.column + 1, node.endPosition.row + 1]
                }
            }];
    }
    registerFunction(node) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const fn_receiver = node.childForFieldName('receiver');
        const fn_name = (_a = node.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
        const declaration_list = (_b = node.childForFieldName('parameters')) === null || _b === void 0 ? void 0 : _b.children;
        const fn_body = node.childForFieldName('body');
        let comment;
        if (((_c = node.previousSibling) === null || _c === void 0 ? void 0 : _c.type) === "comment") {
            comment = signatures_1.buildComment(node, true);
        }
        const locals = new TypeMap(this.moduleName);
        const params = new TypeMap(this.moduleName);
        (_d = declaration_list) === null || _d === void 0 ? void 0 : _d.forEach(pd => {
            var _a;
            const param_name = (_a = pd.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
            if (typeof param_name == "undefined") {
                return;
            }
            const param_type = this.identifyType(pd.childForFieldName('type'));
            params.set(param_name, {
                type: param_type,
                signature: signatures_1.buildTypeSignature(param_name, param_type),
                range: {
                    start: [pd.startPosition.column + 1, pd.startPosition.row + 1],
                    end: [pd.endPosition.column + 1, pd.endPosition.row + 1]
                }
            });
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
                const var_type = this.identifyType(var_content);
                locals.set(var_name, {
                    type: var_type,
                    signature: signatures_1.buildTypeSignature(var_name, var_type),
                    range: {
                        start: [e.startPosition.column + 1, e.startPosition.row + 1],
                        end: [e.endPosition.column + 1, e.endPosition.row + 1]
                    }
                });
            });
        }
        if (fn_receiver !== null) {
            const receiver_decl_list = findChildByType(fn_receiver, 'parameter_declaration');
            const orig_type = (_h = receiver_decl_list) === null || _h === void 0 ? void 0 : _h.childForFieldName('type');
            let orig_type_name = (_j = orig_type) === null || _j === void 0 ? void 0 : _j.text;
            if (this.moduleName !== "main") {
                orig_type_name = this.moduleName + '.' + ((_k = orig_type) === null || _k === void 0 ? void 0 : _k.text);
            }
            if (((_l = orig_type) === null || _l === void 0 ? void 0 : _l.type) === 'qualified_type') {
                orig_type_name = orig_type.text;
            }
            if (typeof this.get(orig_type_name) !== "undefined") {
                (_m = this.get(orig_type_name).methods) === null || _m === void 0 ? void 0 : _m.set(fn_name, {
                    type: `function`,
                    signature: signatures_1.buildFnSignature(node),
                    comment: comment,
                    parameters: params,
                    locals,
                    range: {
                        start: [receiver_decl_list.startPosition.column + 1, receiver_decl_list.startPosition.row + 1],
                        end: [receiver_decl_list.endPosition.column + 1, receiver_decl_list.endPosition.row + 1]
                    }
                });
            }
        }
        return [fn_name, {
                type: `function`,
                signature: signatures_1.buildFnSignature(node),
                comment: comment,
                parameters: params,
                locals,
                range: {
                    start: [node.startPosition.column + 1, node.startPosition.row + 1],
                    end: [node.endPosition.column + 1, node.endPosition.row + 1]
                }
            }];
    }
    registerStruct(node) {
        var _a, _b, _c;
        const struct_name = (_a = findChildByType(node, "type_identifier")) === null || _a === void 0 ? void 0 : _a.text;
        const declaration_list = (_b = findChildByType(node, "field_declaration_list")) === null || _b === void 0 ? void 0 : _b.children;
        const fields = new TypeMap(this.moduleName);
        const methods = new TypeMap(this.moduleName);
        (_c = declaration_list) === null || _c === void 0 ? void 0 : _c.forEach(fd => {
            var _a;
            const field_name = (_a = fd.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
            if (typeof field_name === "undefined") {
                return;
            }
            const field_type = this.identifyType(fd.childForFieldName('type'));
            fields.set(field_name, {
                type: field_type,
                signature: signatures_1.buildTypeSignature(field_name, field_type),
                range: {
                    start: [fd.startPosition.column + 1, fd.startPosition.row + 1],
                    end: [fd.endPosition.column + 1, fd.endPosition.row + 1]
                }
            });
        });
        const dec = Object.keys(fields.types).map(f => fields.types[f].signature);
        return [struct_name, {
                type: 'struct',
                signature: signatures_1.buildTypeSignature(`${struct_name} {${dec.join(', ')}}`, 'struct'),
                fields,
                methods,
                range: {
                    start: [node.startPosition.column + 1, node.startPosition.row + 1],
                    end: [node.endPosition.column + 1, node.endPosition.row + 1]
                }
            }];
    }
    registerVar(node) {
        var _a, _b;
        const var_name = (_a = node.childForFieldName('left')) === null || _a === void 0 ? void 0 : _a.text;
        const content = node.childForFieldName('right');
        const var_type = this.identifyType(content);
        let comment;
        if (((_b = node.previousSibling) === null || _b === void 0 ? void 0 : _b.type) === "comment") {
            comment = signatures_1.buildComment(node);
        }
        return [var_name, {
                type: var_type,
                signature: signatures_1.buildTypeSignature(var_name, var_type),
                comment: comment,
                range: {
                    start: [node.startPosition.column + 1, node.startPosition.row + 1],
                    end: [node.endPosition.column + 1, node.endPosition.row + 1]
                }
            }];
    }
    registerEnum(node) {
        var _a, _b, _c;
        const enum_name = (_a = findChildByType(node, "type_identifier")) === null || _a === void 0 ? void 0 : _a.text;
        const declaration_list = (_b = findChildByType(node, "enum_declaration_list")) === null || _b === void 0 ? void 0 : _b.children;
        const fields = new TypeMap(this.moduleName);
        (_c = declaration_list) === null || _c === void 0 ? void 0 : _c.forEach(fd => {
            var _a;
            const field_name = (_a = fd.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
            fields.set(field_name, {
                type: 'int',
                signature: signatures_1.buildTypeSignature(field_name, 'int'),
                range: {
                    start: [fd.startPosition.column + 1, fd.startPosition.row + 1],
                    end: [fd.endPosition.column + 1, fd.endPosition.row + 1]
                }
            });
        });
        const dec = Object.keys(fields.types).map(f => fields.types[f].signature);
        return [enum_name, {
                type: 'enum',
                signature: signatures_1.buildTypeSignature(`${enum_name} {${dec.join(', ')}}`, 'enum'),
                fields,
                range: {
                    start: [node.startPosition.column + 1, node.startPosition.row + 1],
                    end: [node.endPosition.column + 1, node.endPosition.row + 1]
                }
            }];
    }
}
exports.TypeMap = TypeMap;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSw2Q0FBa0Y7QUFlbEYsTUFBYSxPQUFPO0lBSWhCLFlBQVksVUFBa0I7UUFIdEIsVUFBSyxHQUFvQyxFQUFFLENBQUM7UUFJaEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDakMsQ0FBQztJQUVELE1BQU07UUFDRixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVELEdBQUcsQ0FBQyxHQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBVyxFQUFFLEtBQXFCO1FBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFRCxhQUFhLENBQUMsSUFBWTtRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDO0lBRUQsa0JBQWtCLENBQUMsSUFBdUI7O1FBQ3RDLE1BQUEsSUFBSSxDQUFDLFFBQVEsMENBQUUsT0FBTyxDQUFDLENBQU0sQ0FBQyxFQUFDLEVBQUU7WUFDN0IsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssV0FBVyxFQUFFO2dCQUM1RCxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJ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