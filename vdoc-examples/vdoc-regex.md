# regex.v
- regex.v
## Contents
- [regex.utf8util_char_len](#regex.utf8util_char_len)
- [regex.RE.get_char](#regex.RE.get_char)
- [regex.RE.get_charb](#regex.RE.get_charb)
- [regex.is_alnum](#regex.is_alnum)
- [regex.is_not_alnum](#regex.is_not_alnum)
- [regex.is_space](#regex.is_space)
- [regex.is_not_space](#regex.is_not_space)
- [regex.is_digit](#regex.is_digit)
- [regex.is_not_digit](#regex.is_not_digit)
- [regex.is_wordchar](#regex.is_wordchar)
- [regex.is_not_wordchar](#regex.is_not_wordchar)
- [regex.is_lower](#regex.is_lower)
- [regex.is_upper](#regex.is_upper)
- [regex.RE.get_parse_error_string](#regex.RE.get_parse_error_string)
- [regex.utf8_str](#regex.utf8_str)
- [regex.simple_log](#regex.simple_log)
- [regex.Token](#regex.Token)
- [regex.Token.reset](#regex.Token.reset)
- [regex.StateDotObj](#regex.StateDotObj)
- [regex.RE](#regex.RE)
- [regex.RE.reset](#regex.RE.reset)
- [regex.RE.reset_src](#regex.RE.reset_src)
- [regex.RE.get_group](#regex.RE.get_group)
- [regex.BslsStruct](#regex.BslsStruct)
- [regex.BSLS_parse_state](#regex.BSLS_parse_state)
- [regex.RE.parse_bsls](#regex.RE.parse_bsls)
- [regex.CharClass](#regex.CharClass)
- [regex.CharClass_parse_state](#regex.CharClass_parse_state)
- [regex.RE.get_char_class](#regex.RE.get_char_class)
- [regex.RE.check_char_class](#regex.RE.check_char_class)
- [regex.RE.parse_char_class](#regex.RE.parse_char_class)
- [regex.Quant_parse_state](#regex.Quant_parse_state)
- [regex.RE.parse_quantifier](#regex.RE.parse_quantifier)
- [regex.Group_parse_state](#regex.Group_parse_state)
- [regex.RE.parse_groups](#regex.RE.parse_groups)
- [regex.RE.compile](#regex.RE.compile)
- [regex.RE.get_code](#regex.RE.get_code)
- [regex.RE.get_query](#regex.RE.get_query)
- [regex.match_state](#regex.match_state)
- [regex.state_str](#regex.state_str)
- [regex.StateObj](#regex.StateObj)
- [regex.RE.match_base](#regex.RE.match_base)
- [regex.regex](#regex.regex)
- [regex.new_regex](#regex.new_regex)
- [regex.new_regex_by_size](#regex.new_regex_by_size)
- [regex.RE.match_string](#regex.RE.match_string)
- [regex.RE.find](#regex.RE.find)
- [regex.RE.find_all](#regex.RE.find_all)
- [regex.RE.replace](#regex.RE.replace)

## Documentation
### regex.utf8util_char_len
```v
fn utf8util_char_len(b byte) int
```
**************************************************************************** 
 
 General Utilities 
 
*****************************************************************************/ 
utf8util_char_len calculate the length in bytes of a utf8 char

### regex.RE.get_char
```v
fn (re RE) get_char(in_txt string, i int) (u32,int)
```
get_char get a char from position i and return an u32 with the unicode code

### regex.RE.get_charb
```v
fn (re RE) get_charb(in_txt byteptr, i int) (u32,int)
```
get_charb get a char from position i and return an u32 with the unicode code

### regex.is_alnum
```v
fn is_alnum(in_char byte) bool
```
### regex.is_not_alnum
```v
fn is_not_alnum(in_char byte) bool
```
### regex.is_space
```v
fn is_space(in_char byte) bool
```
### regex.is_not_space
```v
fn is_not_space(in_char byte) bool
```
### regex.is_digit
```v
fn is_digit(in_char byte) bool
```
### regex.is_not_digit
```v
fn is_not_digit(in_char byte) bool
```
### regex.is_wordchar
```v
fn is_wordchar(in_char byte) bool
```
### regex.is_not_wordchar
```v
fn is_not_wordchar(in_char byte) bool
```
### regex.is_lower
```v
fn is_lower(in_char byte) bool
```
### regex.is_upper
```v
fn is_upper(in_char byte) bool
```
### regex.RE.get_parse_error_string
```v
pub fn (re RE) get_parse_error_string(err int) string
```
### regex.utf8_str
```v
fn utf8_str(ch u32) string
```
utf8_str convert and utf8 sequence to a printable string

### regex.simple_log
```v
fn simple_log(txt string) void
```
simple_log default log function

### regex.Token
```v
struct Token {
    ist  u32
    ch  u32
    ch_len  byte
    rep_min  int
    rep_max  int
    greedy  bool
    cc_index  int
    rep  int
    validator  fn (byte) bool
    group_rep  int
    group_id  int
    goto_pc  int
    next_is_or  bool
}
```
**************************************************************************** 
 
 Token Structs 
 
*****************************************************************************/

### regex.Token.reset
```v
fn (tok mut Token) reset() void
```
### regex.StateDotObj
```v
struct StateDotObj {
    i  int
    pc  int
    mi  int
    group_stack_index  int
}
```
### regex.RE
```v
struct RE {
    prog  []Token
    cc  []CharClass
    cc_index  int
    state_stack_index  int
    state_stack  []StateDotObj
    group_count  int
    groups  []int
    group_max_nested  int
    group_max  int
    group_csave  []int
    group_csave_index  int
    group_map  map[string]int
    flag  int
    debug  int
    log_func  fn (string)
    query  string
}
```
### regex.RE.reset
```v
fn (re mut RE) reset() void
```
Reset RE object 
inline]

### regex.RE.reset_src
```v
fn (re mut RE) reset_src() void
```
reset for search mode fail 
gcc bug, dont use [inline] or go 5 time slower

### regex.RE.get_group
```v
pub fn (re RE) get_group(group_name string) (int, int)
```
### regex.BslsStruct
```v
struct BslsStruct {
    ch  u32
    validator  fn (byte) bool
}
```
**************************************************************************** 
 
 Backslashes chars 
 
*****************************************************************************/

### regex.BSLS_parse_state
```v
```
### regex.RE.parse_bsls
```v
fn (re RE) parse_bsls(in_txt string, in_i int) (int,int)
```
parse_bsls return (index, str_len) BSLS_VALIDATOR_ARRAY index, len of the backslash sequence if present

### regex.CharClass
```v
struct CharClass {
    cc_type  int
    ch0  u32
    ch1  u32
    validator  fn (byte) bool
}
```
### regex.CharClass_parse_state
```v
```
### regex.RE.get_char_class
```v
fn (re RE) get_char_class(pc int) string
```
### regex.RE.check_char_class
```v
fn (re RE) check_char_class(pc int, ch u32) bool
```
### regex.RE.parse_char_class
```v
fn (re mut RE) parse_char_class(in_txt string, in_i int) (int, int, u32)
```
parse_char_class return (index, str_len, cc_type) of a char class [abcm-p], char class start after the [ char

### regex.Quant_parse_state
```v
```
**************************************************************************** 
 
 Re Compiler 
 
*****************************************************************************/ 
 
Quantifier

### regex.RE.parse_quantifier
```v
fn (re RE) parse_quantifier(in_txt string, in_i int) (int, int, int, bool)
```
parse_quantifier return (min, max, str_len, greedy_flag) of a {min,max}? quantifier starting after the { char

### regex.Group_parse_state
```v
```
Groups

### regex.RE.parse_groups
```v
fn (re RE) parse_groups(in_txt string, in_i int) (int, bool, string, int)
```
parse_groups parse a group for ? (question mark) syntax, if found, return (error, capture_flag, name_of_the_group, next_index)

### regex.RE.compile
```v
pub fn (re mut RE) compile(in_txt string) (int,int)
```
main compiler 
 
compile return (return code, index) where index is the index of the error in the query string if return code is an error code

### regex.RE.get_code
```v
pub fn (re RE) get_code() string
```
get_code return the compiled code as regex string, note: may be different from the source!

### regex.RE.get_query
```v
pub fn (re RE) get_query() string
```
get_query return a string with a reconstruction of the query starting from the regex program code

### regex.match_state
```v
```
**************************************************************************** 
 
 Matching 
 
*****************************************************************************/

### regex.state_str
```v
fn state_str(s match_state) string
```
### regex.StateObj
```v
struct StateObj {
    match_flag  bool
    match_index  int
    match_first  int
}
```
### regex.RE.match_base
```v
pub fn (re mut RE) match_base(in_txt byteptr, in_txt_len int ) (int,int)
```
### regex.regex
```v
pub fn regex(in_query string) (RE,int,int)
```
**************************************************************************** 
 
 Public functions 
 
*****************************************************************************/ 
 
Inits 
 
regex create a regex object from the query string

### regex.new_regex
```v
pub fn new_regex() RE
```
new_regex create a REgex of small size, usually sufficient for ordinary use

### regex.new_regex_by_size
```v
pub fn new_regex_by_size(mult int) RE
```
new_regex_by_size create a REgex of large size, mult specify the scale factor of the memory that will be allocated

### regex.RE.match_string
```v
pub fn (re mut RE) match_string(in_txt string) (int,int)
```
Matchers

### regex.RE.find
```v
pub fn (re mut RE) find(in_txt string) (int,int)
```
Finders 
 
find try to find the first match in the input string

### regex.RE.find_all
```v
pub fn (re mut RE) find_all(in_txt string) []int
```
find all the non overlapping occurrences of the match pattern

### regex.RE.replace
```v
pub fn (re mut RE) replace(in_txt string, repl string) string
```
replace return a string where the matches are replaced with the replace string
