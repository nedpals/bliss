# compiler module
- aparser.v
- asm.v
- cc.v
- cflags.v
- cgen.v
- cheaders.v
- compile_errors.v
- compiler_options.v
- comptime.v
- depgraph.v
- enum.v
- expression.v
- fn.v
- for.v
- gen_c.v
- gen_x64.v
- get_type.v
- if_match.v
- json_gen.v
- live.v
- main.v
- modules.v
- msvc.v
- optimization.v
- query.v
- scanner.v
- string_expression.v
- struct.v
- table.v
- token.v
- v_mod_cache.v
- vfmt.v
- vtmp.v
## Contents
- [compiler.&Parser.save_state](#compilerparsersave_state)
- [compiler.Parser.restore_state](#compilerparserrestore_state)
- [compiler.Parser.add_text](#compilerparseradd_text)

## Documentation
### compiler.&Parser.save_state
```v
fn (p &Parser) save_state() ParserState
```
if !p.pref.is_verbose { 
return 
} 
println(s)

### compiler.Parser.restore_state
```v
fn (p mut Parser) restore_state(state ParserState, scanner bool, cgen bool) void
```
### compiler.Parser.add_text
```v
fn (p mut Parser) add_text(text string) void
```