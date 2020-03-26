# regex module
- regex.v
## Contents
- [regex.RE.get_parse_error_string](#regexreget_parse_error_string)
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
### regex.RE.get_parse_error_string
```v
pub fn (re RE) get_parse_error_string(err int) string
```
### regex.RE
```v
pub  struct RE {
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
pub fn (re RE) get_group(group_name string) (int, int)
```
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
