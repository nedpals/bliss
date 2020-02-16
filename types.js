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
    insertType(root) {
        var _a;
        (_a = root.children) === null || _a === void 0 ? void 0 : _a.forEach((n) => __awaiter(this, void 0, void 0, function* () {
            const [name, props] = yield this.declare(n);
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
    declare(node) {
        var _a;
        switch ((_a = node) === null || _a === void 0 ? void 0 : _a.type) {
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
                    }];
        }
    }
    declareTypedef(node) {
        var _a, _b, _c;
        const spec = findChildByType(node, 'type_spec');
        const type_name = (_b = (_a = spec) === null || _a === void 0 ? void 0 : _a.childForFieldName('name')) === null || _b === void 0 ? void 0 : _b.text;
        const orig_type = this.identifyType((_c = spec) === null || _c === void 0 ? void 0 : _c.childForFieldName('type'));
        return [type_name, {
                type: orig_type,
                signature: signatures_1.buildTypeSignature(`(alias) ${type_name}`, orig_type)
            }];
    }
    declareFunction(node) {
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
                signature: signatures_1.buildTypeSignature(param_name, param_type)
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
                    signature: signatures_1.buildTypeSignature(var_name, var_type)
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
                    locals
                });
            }
        }
        return [fn_name, {
                type: `function`,
                signature: signatures_1.buildFnSignature(node),
                comment: comment,
                parameters: params,
                locals
            }];
    }
    declareStruct(node) {
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
                signature: signatures_1.buildTypeSignature(field_name, field_type)
            });
        });
        const dec = Object.keys(fields.types).map(f => fields.types[f].signature);
        return [struct_name, {
                type: 'struct',
                signature: signatures_1.buildTypeSignature(`${struct_name} {${dec.join(', ')}}`, 'struct'),
                fields,
                methods
            }];
    }
    declareVar(node) {
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
                comment: comment
            }];
    }
    declareEnum(node) {
        var _a, _b, _c;
        const enum_name = (_a = findChildByType(node, "type_identifier")) === null || _a === void 0 ? void 0 : _a.text;
        const declaration_list = (_b = findChildByType(node, "enum_declaration_list")) === null || _b === void 0 ? void 0 : _b.children;
        const fields = new TypeMap(this.moduleName);
        (_c = declaration_list) === null || _c === void 0 ? void 0 : _c.forEach(fd => {
            var _a;
            const field_name = (_a = fd.childForFieldName('name')) === null || _a === void 0 ? void 0 : _a.text;
            fields.set(field_name, {
                type: 'int',
                signature: signatures_1.buildTypeSignature(field_name, 'int')
            });
        });
        const dec = Object.keys(fields.types).map(f => fields.types[f].signature);
        return [enum_name, {
                type: 'enum',
                signature: signatures_1.buildTypeSignature(`${enum_name} {${dec.join(', ')}}`, 'enum'),
                fields
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSw2Q0FBa0Y7QUFjbEYsTUFBYSxPQUFPO0lBSWhCLFlBQVksVUFBa0I7UUFIdEIsVUFBSyxHQUFvQyxFQUFFLENBQUM7UUFJaEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDakMsQ0FBQztJQUVELE1BQU07UUFDRixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVELEdBQUcsQ0FBQyxHQUFXO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBVyxFQUFFLEtBQXFCO1FBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFRCxhQUFhLENBQUMsSUFBWTtRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDO0lBRUQsVUFBVSxDQUFDLElBQXVCOztRQUM5QixNQUFBLElBQUksQ0FBQyxRQUFRLDBDQUFFLE9BQU8sQ0FBQyxDQUFNLENBQUMsRUFBQyxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxLQUFLLFdBQVcsRUFBRTtnQkFDNUQsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxD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