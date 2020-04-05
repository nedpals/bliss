# regex module
- regex.v
## Contents
- [regex.V_REGEX_VERSION](#regexv_regex_version)
- [regex.MAX_CODE_LEN](#regexmax_code_len)
- [regex.MAX_QUANTIFIER](#regexmax_quantifier)
- [regex.SPACES](#regexspaces)
- [regex.NEW_LINE_LIST](#regexnew_line_list)
- [regex.NO_MATCH_FOUND](#regexno_match_found)
- [regex.COMPILE_OK](#regexcompile_ok)
- [regex.ERR_CHAR_UNKNOWN](#regexerr_char_unknown)
- [regex.ERR_UNDEFINED](#regexerr_undefined)
- [regex.ERR_INTERNAL_ERROR](#regexerr_internal_error)
- [regex.ERR_CC_ALLOC_OVERFLOW](#regexerr_cc_alloc_overflow)
- [regex.ERR_SYNTAX_ERROR](#regexerr_syntax_error)
- [regex.ERR_GROUPS_OVERFLOW](#regexerr_groups_overflow)
- [regex.ERR_GROUPS_MAX_NESTED](#regexerr_groups_max_nested)
- [regex.ERR_GROUP_NOT_BALANCED](#regexerr_group_not_balanced)
- [regex.ERR_GROUP_QM_NOTATION](#regexerr_group_qm_notation)
- [regex.RE.get_parse_error_string](#regexreget_parse_error_string)
- [regex.F_NL](#regexf_nl)
- [regex.F_MS](#regexf_ms)
- [regex.F_ME](#regexf_me)
- [regex.F_EFM](#regexf_efm)
- [regex.F_BIN](#regexf_bin)
- [regex.F_SRC](#regexf_src)
- [regex.RE](#regexre)
- [regex.RE.get_group](#regexreget_group)
- [regex.RE.compile](#regexrecompile)
- [regex.RE.get_code](#regexreget_code)
- [regex.RE.get_query](#regexreget_query)
- [regex.RE.match_base](#regexrematch_base)
- [regex.regex](#regexregex)
- [regex.new_regex](#regexnew_regex)
- [regex.new_regex_by_size](#regexnew_regex_by_size)
- [regex.RE.match_string](#regexrematch_string)
- [regex.RE.find](#regexrefind)
- [regex.RE.find_all](#regexrefind_all)
- [regex.RE.replace](#regexrereplace)

## Documentation
### regex.V_REGEX_VERSION
```v

```
### regex.MAX_CODE_LEN
```v

```
### regex.MAX_QUANTIFIER
```v

```
### regex.SPACES
```v

```
### regex.NEW_LINE_LIST
```v

```
### regex.NO_MATCH_FOUND
```v

```
### regex.COMPILE_OK
```v

```
### regex.ERR_CHAR_UNKNOWN
```v

```
### regex.ERR_UNDEFINED
```v

```
### regex.ERR_INTERNAL_ERROR
```v

```
### regex.ERR_CC_ALLOC_OVERFLOW
```v

```
### regex.ERR_SYNTAX_ERROR
```v

```
### regex.ERR_GROUPS_OVERFLOW
```v

```
### regex.ERR_GROUPS_MAX_NESTED
```v

```
### regex.ERR_GROUP_NOT_BALANCED
```v

```
### regex.ERR_GROUP_QM_NOTATION
```v

```
### regex.RE.get_parse_error_string
```v
fn (re RE) get_parse_error_string(err int) string
```
### regex.F_NL
```v

```
**************************************************************************** 
 
 Regex struct 
 
*****************************************************************************/

### regex.F_MS
```v

```
**************************************************************************** 
 
 Regex struct 
 
*****************************************************************************/

### regex.F_ME
```v

```
**************************************************************************** 
 
 Regex struct 
 
*****************************************************************************/

### regex.F_EFM
```v

```
**************************************************************************** 
 
 Regex struct 
 
*****************************************************************************/

### regex.F_BIN
```v

```
**************************************************************************** 
 
 Regex struct 
 
*****************************************************************************/

### regex.F_SRC
```v

```
**************************************************************************** 
 
 Regex struct 
 
*****************************************************************************/

### regex.RE
```v
 struct RE {
    prog   []Token
    cc   []CharClass
    cc_index   int
    state_stack_index   int
    state_stack   []StateDotObj
    group_count   int
    groups   []int
    group_max_nested   int
    group_max   int
    group_csave   []int
    group_csave_index   int
    group_map   map[string]int
    flag   int
    debug   int
    log_func   fn (string)
    query   string
}
```
### regex.RE.get_group
```v
fn (re RE) get_group(group_name string) (int, int)
```
### regex.RE.compile
```v
fn (re mut RE) compile(in_txt string) (int,int)
```
main compiler 
 
compile return (return code, index) where index is the index of the error in the query string if return code is an error code

### regex.RE.get_code
```v
fn (re RE) get_code() string
```
get_code return the compiled code as regex string, note: may be different from the source!

### regex.RE.get_query
```v
fn (re RE) get_query() string
```
get_query return a string with a reconstruction of the query starting from the regex program code

### regex.RE.match_base
```v
fn (re mut RE) match_base(in_txt byteptr, in_txt_len int ) (int,int)
```
### regex.regex
```v
fn regex(in_query string) (RE,int,int)
```
**************************************************************************** 
 
 Public functions 
 
*****************************************************************************/ 
 
Inits 
 
regex create a regex object from the query string

### regex.new_regex
```v
fn new_regex() RE
```
new_regex create a REgex of small size, usually sufficient for ordinary use

### regex.new_regex_by_size
```v
fn new_regex_by_size(mult int) RE
```
new_regex_by_size create a REgex of large size, mult specify the scale factor of the memory that will be allocated

### regex.RE.match_string
```v
fn (re mut RE) match_string(in_txt string) (int,int)
```
Matchers

### regex.RE.find
```v
fn (re mut RE) find(in_txt string) (int,int)
```
Finders 
 
find try to find the first match in the input string

### regex.RE.find_all
```v
fn (re mut RE) find_all(in_txt string) []int
```
find all the non overlapping occurrences of the match pattern

### regex.RE.replace
```v
fn (re mut RE) replace(in_txt string, repl string) string
```
replace return a string where the matches are replaced with the replace string
