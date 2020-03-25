# flag.v
- flag.v
## Contents
- [flag.Flag](#flagflag)
- [flag.Flag.str](#flagflagstr)
- [flag.[]Flag.str](#flagflagstr)
- [flag.FlagParser](#flagflagparser)
- [flag.new_flag_parser](#flagnew_flag_parser)
- [flag.FlagParser.application](#flagflagparserapplication)
- [flag.FlagParser.version](#flagflagparserversion)
- [flag.FlagParser.description](#flagflagparserdescription)
- [flag.FlagParser.skip_executable](#flagflagparserskip_executable)
- [flag.FlagParser.add_flag](#flagflagparseradd_flag)
- [flag.FlagParser.parse_value](#flagflagparserparse_value)
- [flag.FlagParser.parse_bool_value](#flagflagparserparse_bool_value)
- [flag.FlagParser.bool_opt](#flagflagparserbool_opt)
- [flag.FlagParser.bool_](#flagflagparserbool_)
- [flag.FlagParser.bool](#flagflagparserbool)
- [flag.FlagParser.int_multi](#flagflagparserint_multi)
- [flag.FlagParser.int_opt](#flagflagparserint_opt)
- [flag.FlagParser.int_](#flagflagparserint_)
- [flag.FlagParser.int](#flagflagparserint)
- [flag.FlagParser.float_multi](#flagflagparserfloat_multi)
- [flag.FlagParser.float_opt](#flagflagparserfloat_opt)
- [flag.FlagParser.float_](#flagflagparserfloat_)
- [flag.FlagParser.float](#flagflagparserfloat)
- [flag.FlagParser.string_multi](#flagflagparserstring_multi)
- [flag.FlagParser.string_opt](#flagflagparserstring_opt)
- [flag.FlagParser.string_](#flagflagparserstring_)
- [flag.FlagParser.string](#flagflagparserstring)
- [flag.FlagParser.limit_free_args_to_at_least](#flagflagparserlimit_free_args_to_at_least)
- [flag.FlagParser.limit_free_args_to_exactly](#flagflagparserlimit_free_args_to_exactly)
- [flag.FlagParser.limit_free_args](#flagflagparserlimit_free_args)
- [flag.FlagParser.arguments_description](#flagflagparserarguments_description)
- [flag.FlagParser.usage](#flagflagparserusage)
- [flag.FlagParser.finalize](#flagflagparserfinalize)

## Documentation
### flag.Flag
```v
pub struct Flag {
    name  string
    abbr  byte
    usage  string
    val_desc  string
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
 
 	an_int := fp.int('an_int', 666, 'some int to define 666 is default') 
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

### flag.Flag.str
```v
pub fn (f Flag) str() string
```
### flag.[]Flag.str
```v
pub fn (af []Flag) str() string
```
### flag.FlagParser
```v
pub struct FlagParser {
    args  []string
    flags  []Flag
    application_name  string
    application_version  string
    application_description  string
    min_free_args  int
    max_free_args  int
    args_description  string
}
```


### flag.new_flag_parser
```v
pub fn new_flag_parser(args []string) &FlagParser
```
create a new flag set for parsing command line arguments 
TODO use INT_MAX some how

### flag.FlagParser.application
```v
pub fn (fs mut FlagParser) application(name string) void
```
change the application name to be used in 'usage' output

### flag.FlagParser.version
```v
pub fn (fs mut FlagParser) version(vers string) void
```
change the application version to be used in 'usage' output

### flag.FlagParser.description
```v
pub fn (fs mut FlagParser) description(desc string) void
```
change the application version to be used in 'usage' output

### flag.FlagParser.skip_executable
```v
pub fn (fs mut FlagParser) skip_executable() void
```
in most cases you do not need the first argv for flag parsing

### flag.FlagParser.add_flag
```v
fn (fs mut FlagParser) add_flag(name string, abbr byte, usage string, desc string) void
```
private helper to register a flag

### flag.FlagParser.parse_value
```v
fn (fs mut FlagParser) parse_value(longhand string, shorthand byte) []string
```
private: general parsing a single argument 
 - search args for existence 
   if true 
     extract the defined value as string 
   else 
     return an (dummy) error -> argument is not defined 
 
 - the name, usage are registered 
 - found arguments and corresponding values are removed from args list

### flag.FlagParser.parse_bool_value
```v
fn (fs mut FlagParser) parse_bool_value(longhand string, shorthand byte) ?string
```
special parsing for bool values 
see also: parse_value 
 
special: it is allowed to define bool flags without value 
-> '--flag' is parsed as true 
-> '--flag' is equal to '--flag=true'

### flag.FlagParser.bool_opt
```v
pub fn (fs mut FlagParser) bool_opt(name string, abbr byte, usage string) ?bool
```
bool_opt returns an optional that returns the value associated with the flag. 
In the situation that the flag was not provided, it returns null.

### flag.FlagParser.bool_
```v
pub fn (fs mut FlagParser) bool_(name string, abbr byte, bdefault bool, usage string) bool
```
defining and parsing a bool flag 
 if defined 
     the value is returned (true/false) 
 else 
     the default value is returned 
version with abbr 
ODO error handling for invalid string to bool conversion

### flag.FlagParser.bool
```v
pub fn (fs mut FlagParser) bool(name string, v bool, usage string) bool
```
defining and parsing a bool flag 
 if defined 
     the value is returned (true/false) 
 else 
     the default value is returned 
ODO error handling for invalid string to bool conversion

### flag.FlagParser.int_multi
```v
pub fn (fs mut FlagParser) int_multi(name string, abbr byte, usage string) []int
```
int_multi returns all instances of values associated with the flags provided 
In the case that none were found, it returns an empty array.

### flag.FlagParser.int_opt
```v
pub fn (fs mut FlagParser) int_opt(name string, abbr byte, usage string) ?int
```
int_opt returns an optional that returns the value associated with the flag. 
In the situation that the flag was not provided, it returns null.

### flag.FlagParser.int_
```v
pub fn (fs mut FlagParser) int_(name string, abbr byte, idefault int, usage string) int
```
defining and parsing an int flag 
 if defined 
     the value is returned (int) 
 else 
     the default value is returned 
version with abbr 
ODO error handling for invalid string to int conversion

### flag.FlagParser.int
```v
pub fn (fs mut FlagParser) int(name string, i int, usage string) int
```
defining and parsing an int flag 
 if defined 
     the value is returned (int) 
 else 
     the default value is returned 
ODO error handling for invalid string to int conversion

### flag.FlagParser.float_multi
```v
pub fn (fs mut FlagParser) float_multi(name string, abbr byte, usage string) []f32
```
float_multi returns all instances of values associated with the flags provided 
In the case that none were found, it returns an empty array.

### flag.FlagParser.float_opt
```v
pub fn (fs mut FlagParser) float_opt(name string, abbr byte, usage string) ?f32
```
float_opt returns an optional that returns the value associated with the flag. 
In the situation that the flag was not provided, it returns null.

### flag.FlagParser.float_
```v
pub fn (fs mut FlagParser) float_(name string, abbr byte, fdefault f32, usage string) f32
```
defining and parsing a float flag 
 if defined 
     the value is returned (float) 
 else 
     the default value is returned 
version with abbr 
ODO error handling for invalid string to float conversion

### flag.FlagParser.float
```v
pub fn (fs mut FlagParser) float(name string, f f32, usage string) f32
```
defining and parsing a float flag 
 if defined 
     the value is returned (float) 
 else 
     the default value is returned 
ODO error handling for invalid string to float conversion

### flag.FlagParser.string_multi
```v
pub fn (fs mut FlagParser) string_multi(name string, abbr byte, usage string) []string
```
string_multi returns all instances of values associated with the flags provided 
In the case that none were found, it returns an empty array.

### flag.FlagParser.string_opt
```v
pub fn (fs mut FlagParser) string_opt(name string, abbr byte, usage string) ?string
```
string_opt returns an optional that returns the value associated with the flag. 
In the situation that the flag was not provided, it returns null.

### flag.FlagParser.string_
```v
pub fn (fs mut FlagParser) string_(name string, abbr byte, sdefault string, usage string) string
```
defining and parsing a string flag 
 if defined 
     the value is returned (string) 
 else 
     the default value is returned 
version with abbr

### flag.FlagParser.string
```v
pub fn (fs mut FlagParser) string(name string, sdefault string, usage string) string
```
defining and parsing a string flag 
 if defined 
     the value is returned (string) 
 else 
     the default value is returned

### flag.FlagParser.limit_free_args_to_at_least
```v
pub fn (fs mut FlagParser) limit_free_args_to_at_least(n int) void
```
### flag.FlagParser.limit_free_args_to_exactly
```v
pub fn (fs mut FlagParser) limit_free_args_to_exactly(n int) void
```
### flag.FlagParser.limit_free_args
```v
pub fn (fs mut FlagParser) limit_free_args(min, max int) void
```
this will cause an error in finalize() if free args are out of range 
(min, ..., max)

### flag.FlagParser.arguments_description
```v
pub fn (fs mut FlagParser) arguments_description(description string) void
```
### flag.FlagParser.usage
```v
pub fn (fs FlagParser) usage() string
```
collect all given information and

### flag.FlagParser.finalize
```v
pub fn (fs FlagParser) finalize() ?[]string
```
finalize argument parsing -> call after all arguments are defined 
 
all remaining arguments are returned in the same order they are defined on 
command line 
 
if additional flag are found (things starting with '--') an error is returned 
error handling is up to the application developer
