# flag module
- flag.v
## Contents
- [flag.Flag](#flagflag)
- [flag.str](#flagstr)
- [flag.[]Flag.str](#flagflagstr)
- [flag.FlagParser](#flagflagparser)
- [flag.SPACE](#flagspace)
- [flag.UNDERLINE](#flagunderline)
- [flag.MAX_ARGS_NUMBER](#flagmax_args_number)
- [flag.new_flag_parser](#flagnew_flag_parser)
- [flag.application](#flagapplication)
- [flag.version](#flagversion)
- [flag.description](#flagdescription)
- [flag.skip_executable](#flagskip_executable)
- [flag.bool_opt](#flagbool_opt)
- [flag.bool](#flagbool)
- [flag.int_multi](#flagint_multi)
- [flag.int_opt](#flagint_opt)
- [flag.int](#flagint)
- [flag.float_multi](#flagfloat_multi)
- [flag.float_opt](#flagfloat_opt)
- [flag.float](#flagfloat)
- [flag.string_multi](#flagstring_multi)
- [flag.string_opt](#flagstring_opt)
- [flag.string](#flagstring)
- [flag.limit_free_args_to_at_least](#flaglimit_free_args_to_at_least)
- [flag.limit_free_args_to_exactly](#flaglimit_free_args_to_exactly)
- [flag.limit_free_args](#flaglimit_free_args)
- [flag.arguments_description](#flagarguments_description)
- [flag.usage](#flagusage)
- [flag.finalize](#flagfinalize)

## Documentation
### flag.Flag
```v
 struct Flag {
    name   string
    abbr   byte
    usage   string
    val_desc   string
}
```
module flag for command-line flag parsing 
 
- parsing flags like '--flag' or '--stuff=things' or '--things stuff' 
- handles bool, int, float and string args 
- is able to print usage 
- handled unknown arguments as error 
 
Usage example: 
 
 ```v 
 module main 
 
 import os 
 import flag 
 
 fn main() { 
 	mut fp := flag.new_flag_parser(os.args) 
 	fp.application('flag_example_tool') 
 	fp.version('v0.0.0') 
 	fp.description('This tool is only designed to show how the flag lib is working') 
 
 	fp.skip_executable() 
 
 	an_int := fp.int('an_int', 0o666, 'some int to define 0o666 is default') 
 	a_bool := fp.bool('a_bool', false, 'some \'real\' flag') 
 	a_float := fp.float('a_float', 1.0, 'also floats') 
 	a_string := fp.string('a_string', 'no text', 'finally, some text') 
 
 	additional_args := fp.finalize() or { 
 		eprintln(err) 
 		println(fp.usage()) 
 		return 
 	} 
 
 	println(' 
 		  an_int: $an_int 
 		  a_bool: $a_bool 
 		 a_float: $a_float 
 		a_string: \'$a_string\' 
 	') 
 	println(additional_args.join_lines()) 
 } 
 ``` 
data object storing information about a defined flag

### flag.str
```v
fn (f Flag) str() string
```
### flag.[]Flag.str
```v
fn (af []Flag) str() string
```
### flag.FlagParser
```v
 struct FlagParser {
    args   []string
    flags   []Flag
    application_name   string
    application_version   string
    application_description   string
    min_free_args   int
    max_free_args   int
    args_description   string
}
```


### flag.SPACE
```v

```
### flag.UNDERLINE
```v

```
### flag.MAX_ARGS_NUMBER
```v

```
### flag.new_flag_parser
```v
fn new_flag_parser(args []string) &FlagParser
```
create a new flag set for parsing command line arguments 
TODO use INT_MAX some how

### flag.application
```v
fn (fs mut FlagParser) application(name string) void
```
change the application name to be used in 'usage' output

### flag.version
```v
fn (fs mut FlagParser) version(vers string) void
```
change the application version to be used in 'usage' output

### flag.description
```v
fn (fs mut FlagParser) description(desc string) void
```
change the application version to be used in 'usage' output

### flag.skip_executable
```v
fn (fs mut FlagParser) skip_executable() void
```
in most cases you do not need the first argv for flag parsing

### flag.bool_opt
```v
fn (fs mut FlagParser) bool_opt(name string, abbr byte, usage string) ?bool
```
bool_opt returns an optional that returns the value associated with the flag. 
In the situation that the flag was not provided, it returns null.

### flag.bool
```v
fn (fs mut FlagParser) bool(name string, abbr byte, bdefault bool, usage string) bool
```
defining and parsing a bool flag 
 if defined 
     the value is returned (true/false) 
 else 
     the default value is returned 
version with abbr 
ODO error handling for invalid string to bool conversion

### flag.int_multi
```v
fn (fs mut FlagParser) int_multi(name string, abbr byte, usage string) []int
```
int_multi returns all instances of values associated with the flags provided 
In the case that none were found, it returns an empty array.

### flag.int_opt
```v
fn (fs mut FlagParser) int_opt(name string, abbr byte, usage string) ?int
```
int_opt returns an optional that returns the value associated with the flag. 
In the situation that the flag was not provided, it returns null.

### flag.int
```v
fn (fs mut FlagParser) int(name string, abbr byte, idefault int, usage string) int
```
defining and parsing an int flag 
 if defined 
     the value is returned (int) 
 else 
     the default value is returned 
version with abbr 
ODO error handling for invalid string to int conversion

### flag.float_multi
```v
fn (fs mut FlagParser) float_multi(name string, abbr byte, usage string) []f32
```
float_multi returns all instances of values associated with the flags provided 
In the case that none were found, it returns an empty array.

### flag.float_opt
```v
fn (fs mut FlagParser) float_opt(name string, abbr byte, usage string) ?f32
```
float_opt returns an optional that returns the value associated with the flag. 
In the situation that the flag was not provided, it returns null.

### flag.float
```v
fn (fs mut FlagParser) float(name string, abbr byte, fdefault f32, usage string) f32
```
defining and parsing a float flag 
 if defined 
     the value is returned (float) 
 else 
     the default value is returned 
version with abbr 
ODO error handling for invalid string to float conversion

### flag.string_multi
```v
fn (fs mut FlagParser) string_multi(name string, abbr byte, usage string) []string
```
string_multi returns all instances of values associated with the flags provided 
In the case that none were found, it returns an empty array.

### flag.string_opt
```v
fn (fs mut FlagParser) string_opt(name string, abbr byte, usage string) ?string
```
string_opt returns an optional that returns the value associated with the flag. 
In the situation that the flag was not provided, it returns null.

### flag.string
```v
fn (fs mut FlagParser) string(name string, abbr byte, sdefault string, usage string) string
```
defining and parsing a string flag 
 if defined 
     the value is returned (string) 
 else 
     the default value is returned 
version with abbr

### flag.limit_free_args_to_at_least
```v
fn (fs mut FlagParser) limit_free_args_to_at_least(n int) void
```
### flag.limit_free_args_to_exactly
```v
fn (fs mut FlagParser) limit_free_args_to_exactly(n int) void
```
### flag.limit_free_args
```v
fn (fs mut FlagParser) limit_free_args(min, max int) void
```
this will cause an error in finalize() if free args are out of range 
(min, ..., max)

### flag.arguments_description
```v
fn (fs mut FlagParser) arguments_description(description string) void
```
### flag.usage
```v
fn (fs FlagParser) usage() string
```
collect all given information and

### flag.finalize
```v
fn (fs FlagParser) finalize() ?[]string
```
finalize argument parsing -> call after all arguments are defined 
 
all remaining arguments are returned in the same order they are defined on 
command line 
 
if additional flag are found (things starting with '--') an error is returned 
error handling is up to the application developer
