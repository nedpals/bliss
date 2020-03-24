# atoi.v
- atof.v
- atoi.v
## Contents
- [strconv.byte_to_lower](#strconv.byte_to_lower)
- [strconv.common_parse_uint](#strconv.common_parse_uint)
- [strconv.parse_uint](#strconv.parse_uint)
- [strconv.common_parse_int](#strconv.common_parse_int)
- [strconv.parse_int](#strconv.parse_int)
- [strconv.atoi](#strconv.atoi)
- [strconv.underscore_ok](#strconv.underscore_ok)

## Documentation
### strconv.byte_to_lower
```v
fn byte_to_lower(c byte) byte
```
### strconv.common_parse_uint
```v
pub fn common_parse_uint(s string, _base int, _bit_size int, error_on_non_digit bool, error_on_high_digit bool) u64
```
common_parse_uint is called by parse_uint and allows the parsing 
to stop on non or invalid digit characters and return the result so far

### strconv.parse_uint
```v
pub fn parse_uint(s string, _base int, _bit_size int) u64
```
parse_uint is like parse_int but for unsigned numbers.

### strconv.common_parse_int
```v
pub fn common_parse_int(_s string, base int, _bit_size int, error_on_non_digit bool, error_on_high_digit bool) i64
```
common_parse_int is called by parse int and allows the parsing 
to stop on non or invalid digit characters and return the result so far

### strconv.parse_int
```v
pub fn parse_int(_s string, base int, _bit_size int) i64
```
parse_int interprets a string s in the given base (0, 2 to 36) and 
bit size (0 to 64) and returns the corresponding value i. 
 
If the base argument is 0, the true base is implied by the string's 
prefix: 2 for "0b", 8 for "0" or "0o", 16 for "0x", and 10 otherwise. 
Also, for argument base 0 only, underscore characters are permitted 
as defined by the Go syntax for integer literals. 
 
The bitSize argument specifies the integer type 
that the result must fit into. Bit sizes 0, 8, 16, 32, and 64 
correspond to int, int8, int16, int32, and int64. 
If bitSize is below 0 or above 64, an error is returned.

### strconv.atoi
```v
pub fn atoi(s string) int
```
atoi is equivalent to parse_int(s, 10, 0), converted to type int.

### strconv.underscore_ok
```v
fn underscore_ok(s string) bool
```
underscore_ok reports whether the underscores in s are allowed. 
Checking them in this one function lets all the parsers skip over them simply. 
Underscore must appear only between digits or between a base prefix and a digit.
