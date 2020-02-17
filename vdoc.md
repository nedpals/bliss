# builtin.utf8_char_len
```v
pub fn utf8_char_len(b byte) int
```

# builtin.utf32_to_str
```v
pub fn utf32_to_str(code u32) string
```
Convert utf32 to utf8 
utf32 == Codepoint
# builtin.utf32_to_str_no_malloc
```v
pub fn utf32_to_str_no_malloc(code u32, buf voidptr) string
```
TODO copypasta
# builtin.utf32_code
```v
pub fn (_rune string) utf32_code() int
```
Convert utf8 to utf32
# builtin.to_wide
```v
pub fn (_str string) to_wide() &u16
```

# builtin.string_from_wide
```v
pub fn string_from_wide(_wstr &u16) string
```

# builtin.string_from_wide2
```v
pub fn string_from_wide2(_wstr &u16, len int) string
```

# builtin.utf8_len
```v
fn utf8_len(c byte) int
```
Calculate length to read from the first byte
# builtin.utf8_getchar
```v
pub fn utf8_getchar() int
```
Reads an utf8 character from standard input
# strconv.lsr96
```v
fn lsr96(s2 u32, s1 u32, s0 u32) (u32,u32,u32)
```
******************************************************************** 
 
 96 bit operation utilities 
 Note: when u128 will be available these function can be refactored 
 
*********************************************************************/ 
right logical shift 96 bit
# strconv.lsl96
```v
fn lsl96(s2 u32, s1 u32, s0 u32) (u32,u32,u32)
```
left logical shift 96 bit
# strconv.add96
```v
fn add96(s2 u32, s1 u32, s0 u32, d2 u32, d1 u32, d0 u32) (u32,u32,u32)
```
sum on 96 bit
# strconv.sub96
```v
fn sub96(s2 u32, s1 u32, s0 u32, d2 u32, d1 u32, d0 u32) (u32,u32,u32)
```
subtraction on 96 bit
# strconv.is_digit
```v
fn is_digit(x byte) bool
```
******************************************************************** 
 
 Utility 
 
*********************************************************************/ 
NOTE: Modify these if working with non-ASCII encoding
# strconv.is_space
```v
fn is_space(x byte) bool
```

# strconv.is_exp
```v
fn is_exp(x byte) bool
```

# strconv.PrepNumber
```v
PrepNumber {negative bool, exponent int, mantissa u64} struct
```

# strconv.parser
```v
fn parser(s string) (int,PrepNumber)
```
******************************************************************** 
 
 String parser 
 NOTE: #TOFIX need one char after the last char of the number 
 
*********************************************************************/ 
parser return a support struct with all the parsing information for the converter
# strconv.converter
```v
fn converter(pn mut PrepNumber) u64
```
******************************************************************** 
 
 Converter to the bit form of the f64 number 
 
*********************************************************************/ 
converter return a u64 with the bit image of the f64 number
# strconv.atof64
```v
pub fn atof64(s string) f64
```
******************************************************************** 
 
 Public functions 
 
*********************************************************************/ 
atof64 return a f64 from a string doing a parsing operation
# strconv.byte_to_lower
```v
fn byte_to_lower(c byte) byte
```

# strconv.common_parse_uint
```v
pub fn common_parse_uint(s string, _base int, _bit_size int, error_on_non_digit bool, error_on_high_digit bool) u64
```
common_parse_uint is called by parse_uint and allows the parsing 
to stop on non or invalid digit characters and return the result so far
# strconv.parse_uint
```v
pub fn parse_uint(s string, _base int, _bit_size int) u64
```
parse_uint is like parse_int but for unsigned numbers.
# strconv.common_parse_int
```v
pub fn common_parse_int(_s string, base int, _bit_size int, error_on_non_digit bool, error_on_high_digit bool) i64
```
common_parse_int is called by parse int and allows the parsing 
to stop on non or invalid digit characters and return the result so far
# strconv.parse_int
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
# strconv.atoi
```v
pub fn atoi(s string) int
```
atoi is equivalent to parse_int(s, 10, 0), converted to type int.
# strconv.underscore_ok
```v
fn underscore_ok(s string) bool
```
underscore_ok reports whether the underscores in s are allowed. 
Checking them in this one function lets all the parsers skip over them simply. 
Underscore must appear only between digits or between a base prefix and a digit.
# builtin.string
```v
string {str byteptr, len int} struct
```

# builtin.ustring
```v
pub fn (s string) ustring() ustring
```

# builtin.vstrlen
```v
pub fn vstrlen(s byteptr) int
```

# builtin.tos
```v
pub fn tos(s byteptr, len int) string
```
Converts a C string to a V string. 
String data is reused, not copied.
# builtin.tos_clone
```v
pub fn tos_clone(s byteptr) string
```

# builtin.tos2
```v
pub fn tos2(s byteptr) string
```
Same as `tos`, but calculates the length. Called by `string(bytes)` casts. 
Used only internally.
# builtin.tos3
```v
pub fn tos3(s charptr) string
```
Same as `tos2`, but for char*, to avoid warnings
# builtin.clone
```v
pub fn (a array) clone() array
```
array.clone returns an independent copy of a given array
# builtin.cstring_to_vstring
```v
pub fn cstring_to_vstring(cstr byteptr) string
```
pub fn (s string) cstr() byteptr { 
clone := s.clone() 
return clone.str 
} 
 
cstring_to_vstring creates a copy of cstr and turns it into a v string
# builtin.replace_once
```v
pub fn (s string) replace_once(rep, with string) string
```

# builtin.replace
```v
pub fn (s string) replace(rep, with string) string
```

# builtin.RepIndex
```v
RepIndex {idx int, val_idx int} struct
```

# builtin.sort
```v
pub fn (a mut []int) sort() void
```
[]int.sort sorts array of int in place in ascending order.
# builtin.compare_rep_index
```v
fn compare_rep_index(a, b &RepIndex) int
```
TODO 
 
fn (a RepIndex) < (b RepIndex) bool { 
return a.idx < b.idx 
}
# builtin.replace_each
```v
pub fn (s string) replace_each(vals []string) string
```

# builtin.bool
```v
pub fn (s string) bool() bool
```

# builtin.int
```v
pub fn (s string) int() int
```

# builtin.i64
```v
pub fn (s string) i64() i64
```

# builtin.i8
```v
pub fn (s string) i8() i8
```

# builtin.i16
```v
pub fn (s string) i16() i16
```

# builtin.f32
```v
pub fn (s string) f32() f32
```

# builtin.f64
```v
pub fn (s string) f64() f64
```

# builtin.u16
```v
pub fn (s string) u16() u16
```

# builtin.u32
```v
pub fn (s string) u32() u32
```

# builtin.u64
```v
pub fn (s string) u64() u64
```

# builtin.eq
```v
pub fn (a []f32) eq(a2 []f32) bool
```

# builtin.ne
```v
fn (a f32) ne(b f32) bool
```

# builtin.lt
```v
fn (a f32) lt(b f32) bool
```

# builtin.le
```v
fn (a f32) le(b f32) bool
```

# builtin.gt
```v
fn (a f32) gt(b f32) bool
```

# builtin.ge
```v
fn (a f32) ge(b f32) bool
```

# builtin.add
```v
fn (u ustring) add(a ustring) ustring
```

# builtin.split
```v
pub fn (s string) split(delim string) []string
```

# builtin.split_nth
```v
pub fn (s string) split_nth(delim string, nth int) []string
```

# builtin.split_into_lines
```v
pub fn (s string) split_into_lines() []string
```

# builtin.left
```v
pub fn (u ustring) left(pos int) string
```

# builtin.right
```v
pub fn (u ustring) right(pos int) string
```

# builtin.substr2
```v
fn (s string) substr2(start, _end int, end_max bool) string
```
used internally for [2..4]
# builtin.substr
```v
pub fn (u ustring) substr(_start, _end int) string
```

# builtin.index_old
```v
pub fn (s string) index_old(p string) int
```

# builtin.index
```v
pub fn (a []char) index(v char) int
```
[]char.index returns the index of the first element equal to the given value, 
or -1 if the value is not found in the array. 
TODO is `char` type yet in the language?
# builtin.index_kmp
```v
fn (s string) index_kmp(p string) int
```
KMP search
# builtin.index_any
```v
pub fn (s string) index_any(chars string) int
```

# builtin.last_index
```v
pub fn (s string) last_index(p string) ?int
```

# builtin.index_after
```v
pub fn (u ustring) index_after(p ustring, start int) int
```

# builtin.index_byte
```v
pub fn (s string) index_byte(c byte) int
```

# builtin.last_index_byte
```v
pub fn (s string) last_index_byte(c byte) int
```

# builtin.count
```v
pub fn (u ustring) count(substr ustring) int
```
counts occurrences of substr in s
# builtin.contains
```v
pub fn (a []byte) contains(val byte) bool
```

# builtin.starts_with
```v
pub fn (s string) starts_with(p string) bool
```

# builtin.ends_with
```v
pub fn (s string) ends_with(p string) bool
```

# builtin.to_lower
```v
pub fn (s string) to_lower() string
```
TODO only works with ASCII
# builtin.to_upper
```v
pub fn (s string) to_upper() string
```

# builtin.capitalize
```v
pub fn (s string) capitalize() string
```

# builtin.title
```v
pub fn (s string) title() string
```

# builtin.find_between
```v
pub fn (s string) find_between(start, end string) string
```
'hey [man] how you doin' 
find_between('[', ']') == 'man'
# builtin.is_space
```v
pub fn (c byte) is_space() bool
```
pub fn (a []string) to_c() voidptr { 
mut res := malloc(sizeof(byteptr) * a.len) 
for i := 0; i < a.len; i++ { 
val := a[i] 
res[i] = val.str 
} 
return res 
}
# builtin.trim_space
```v
pub fn (s string) trim_space() string
```

# builtin.trim
```v
pub fn (s string) trim(cutset string) string
```

# builtin.trim_left
```v
pub fn (s string) trim_left(cutset string) string
```

# builtin.trim_right
```v
pub fn (s string) trim_right(cutset string) string
```

# builtin.compare_strings
```v
fn compare_strings(a, b &string) int
```
fn print_cur_thread() { 
//C.printf("tid = %08x \n", pthread_self()); 
}
# builtin.compare_strings_by_len
```v
fn compare_strings_by_len(a, b &string) int
```

# builtin.compare_lower_strings
```v
fn compare_lower_strings(a, b &string) int
```

# builtin.sort_ignore_case
```v
pub fn (s mut []string) sort_ignore_case() void
```

# builtin.sort_by_len
```v
pub fn (s mut []string) sort_by_len() void
```

# builtin.ustring_tmp
```v
pub fn (s string) ustring_tmp() ustring
```

# builtin.at
```v
pub fn (u ustring) at(idx int) string
```

# builtin.free
```v
pub fn (a array) free() void
```

# builtin.is_digit
```v
pub fn (c byte) is_digit() bool
```

# builtin.is_hex_digit
```v
pub fn (c byte) is_hex_digit() bool
```

# builtin.is_oct_digit
```v
pub fn (c byte) is_oct_digit() bool
```

# builtin.is_bin_digit
```v
pub fn (c byte) is_bin_digit() bool
```

# builtin.is_letter
```v
pub fn (c byte) is_letter() bool
```

# builtin.all_before
```v
pub fn (s string) all_before(dot string) string
```
fn (arr []string) free() { 
for s in arr { 
s.free() 
} 
C.free(arr.data) 
} 
 
all_before('23:34:45.234', '.') == '23:34:45'
# builtin.all_before_last
```v
pub fn (s string) all_before_last(dot string) string
```

# builtin.all_after
```v
pub fn (s string) all_after(dot string) string
```

# builtin.join
```v
pub fn (a []string) join(del string) string
```
fn (s []string) substr(a, b int) string { 
return join_strings(s.slice_fast(a, b)) 
}
# builtin.join_lines
```v
pub fn (s []string) join_lines() string
```

# builtin.reverse
```v
pub fn (a array) reverse() array
```
array.reverse returns a new array with the elements of 
the original array in reverse order.
# builtin.limit
```v
pub fn (s string) limit(max int) string
```
limit returns a portion of the string, starting at `0` and extending for a given number of characters afterward. 
'hello'.limit(2) => 'he' 
'hi'.limit(10) => 'hi'
# builtin.is_white
```v
pub fn (c byte) is_white() bool
```
TODO is_white_space()
# builtin.hash
```v
pub fn (s string) hash() int
```

# builtin.bytes
```v
pub fn (s string) bytes() []byte
```

# builtin.repeat
```v
pub fn (a array) repeat(nr_repeats int) array
```
array.repeat returns new array with the given array elements 
repeated `nr_repeat` times
# builtin.Option
```v
Option {data []int, error string, ecode int, ok bool, is_none bool} struct
```

# builtin.opt_ok
```v
fn opt_ok(data voidptr, size int) Option
```
`fn foo() ?Foo { return foo }` => `fn foo() ?Foo { return opt_ok(foo); }`
# builtin.opt_none
```v
fn opt_none() Option
```
used internally when returning `none`
# builtin.error
```v
pub fn error(s string) Option
```

# builtin.error_with_code
```v
pub fn error_with_code(s string, code int) Option
```

# strings.Builder
```v
Builder {buf []byte, len int, initial_size int} struct
```

# strings.new_builder
```v
pub fn new_builder(initial_size int) Builder
```

# strings.write_b
```v
pub fn (b mut Builder) write_b(data byte) void
```

# strings.write
```v
pub fn (b mut Builder) write(s string) void
```

# strings.writeln
```v
pub fn (b mut Builder) writeln(s string) void
```

# strings.str
```v
pub fn (b mut Builder) str() string
```

# strings.cut
```v
pub fn (b mut Builder) cut(n int) void
```

# strings.free
```v
pub fn (b mut Builder) free() void
```

# strings.levenshtein_distance
```v
pub fn levenshtein_distance(a, b string) int
```
#-js 
use levenshtein distance algorithm to calculate 
the distance between between two strings (lower is closer)
# strings.levenshtein_distance_percentage
```v
pub fn levenshtein_distance_percentage(a, b string) f32
```
use levenshtein distance algorithm to calculate 
how similar two strings are as a percentage (higher is closer)
# strings.dice_coefficient
```v
pub fn dice_coefficient(s1, s2 string) f32
```
implementation of Sørensen–Dice coefficient. 
find the similarity between two strings. 
returns coefficient between 0.0 (not similar) and 1.0 (exact match).
# strings.repeat
```v
pub fn repeat(c byte, n int) string
```

# builtin.map
```v
map {element_size int, root unknown, size int} struct
```

# builtin.mapnode
```v
mapnode {left unknown, right unknown, is_empty bool, key string, val voidptr} struct
```

# builtin.new_map
```v
fn new_map(cap, elm_size int) void
```

# builtin.new_map_init
```v
fn new_map_init(cap, elm_size int, keys &string, vals voidptr) void
```
`m := { 'one': 1, 'two': 2 }`
# builtin.new_node
```v
fn new_node(key string, val voidptr, element_size int) &mapnode
```

# builtin.insert
```v
pub fn (a mut array) insert(i int, val voidptr) void
```
TODO array.insert is broken 
Cannot pass literal or primitive type as it cannot be cast to voidptr. 
In the current state only that would work: 
i := 3 
a.insert(0, &i) 
----------------------------
# builtin.find
```v
fn (n &mapnode) find(key string, out voidptr, element_size int) bool
```

# builtin.find2
```v
fn (n &mapnode) find2(key string, element_size int) bool
```
same as `find`, but doesn't return a value. Used by `exists`
# builtin.set
```v
fn (a mut array) set(i int, val voidptr) void
```
Private function. Used to implement assigment to the array element.
# builtin.preorder_keys
```v
fn preorder_keys(node &mapnode, keys mut []string, key_i int) int
```
fn (m map) bs(query string, start, end int, out voidptr) { 
println('bs "$query" $start -> $end') 
mid := start + ((end - start) / 2) 
if end - start == 0 { 
last := m.entries[end] 
C.memcpy(out, last.val, m.element_size) 
return 
} 
if end - start == 1 { 
first := m.entries[start] 
C.memcpy(out, first.val, m.element_size) 
return 
} 
if mid >= m.entries.len { 
return 
} 
mid_msg := m.entries[mid] 
println('mid.key=$mid_msg.key') 
if query < mid_msg.key { 
m.bs(query, start, mid, out) 
return 
} 
m.bs(query, mid, end, out) 
}
# builtin.keys
```v
pub fn (m &map) keys() []string
```

# builtin.get
```v
fn (a array) get(i int) voidptr
```
Private function. Used to implement array[] operator
# builtin.delete
```v
pub fn (a mut array) delete(i int) void
```
array.delete deletes array element at the given index
# builtin.exists
```v
fn (m map) exists(key string) bool
```

# builtin.print
```v
pub fn print(s string) void
```

# builtin.str
```v
pub fn (a []bool) str() string
```
[]bool.str returns a string representation of the array of bools 
"[true, true, false]"
# builtin.ptr_str
```v
pub fn ptr_str(ptr voidptr) string
```

# builtin.hex
```v
pub fn (b []byte) hex() string
```
[]byte.hex returns a string with the hexadecimal representation 
of the byte elements of the array
# builtin.is_capital
```v
pub fn (c byte) is_capital() bool
```

# builtin.strsci
```v
pub fn (x f64) strsci(digit_num int) string
```
return a string of the input f64 in scientific notation with digit_num digits displayed
# builtin.strlong
```v
pub fn (x f64) strlong() string
```
return a long string of the input f64, max
# builtin.f32_abs
```v
fn f32_abs(a f32) f32
```

# builtin.f64_abs
```v
fn f64_abs(a f64) f64
```

# builtin.eqbit
```v
pub fn (a f32) eqbit(b f32) bool
```

# builtin.nebit
```v
pub fn (a f32) nebit(b f32) bool
```

# builtin.ltbit
```v
fn (a f32) ltbit(b f32) bool
```

# builtin.lebit
```v
fn (a f32) lebit(b f32) bool
```

# builtin.gtbit
```v
fn (a f32) gtbit(b f32) bool
```

# builtin.gebit
```v
fn (a f32) gebit(b f32) bool
```

# builtin.C.memcpy
```v
fn C.memcpy(byteptr, byteptr, int) voidptr
```
<string.h>
# builtin.C.memmove
```v
fn C.memmove(byteptr, byteptr, int) voidptr
```

# builtin.C.realloc
```v
fn C.realloc(a byteptr, b int) byteptr
```
fn C.malloc(int) byteptr
# builtin.C.qsort
```v
fn C.qsort(voidptr, int, int, voidptr) void
```

# builtin.C.sprintf
```v
fn C.sprintf(a ...voidptr) byteptr
```

# builtin.C.strlen
```v
fn C.strlen(s byteptr) int
```

# builtin.C.isdigit
```v
fn C.isdigit(s byteptr) bool
```

# builtin.C.popen
```v
fn C.popen(c byteptr, t byteptr) voidptr
```
stdio.h
# builtin.backtrace
```v
fn backtrace(a voidptr, b int) int
```
<execinfo.h>
# builtin.backtrace_symbols
```v
fn backtrace_symbols(voidptr, int) &byteptr
```

# builtin.backtrace_symbols_fd
```v
fn backtrace_symbols_fd(voidptr, int, int) void
```

# builtin.proc_pidpath
```v
fn proc_pidpath(int, voidptr, int) int
```
<libproc.h>
# builtin.C.realpath
```v
fn C.realpath(byteptr, byteptr) &char
```

# builtin.C.chmod
```v
fn C.chmod(byteptr, int) int
```

# builtin.C.printf
```v
fn C.printf(byteptr, ...byteptr) int
```

# builtin.C.fputs
```v
fn C.fputs(byteptr) int
```

# builtin.C.fflush
```v
fn C.fflush(byteptr) int
```

# builtin.C.fseek
```v
fn C.fseek() int
```
TODO define args in these functions
# builtin.C.fopen
```v
fn C.fopen() voidptr
```

# builtin.C.fwrite
```v
fn C.fwrite() int
```

# builtin.C.fclose
```v
fn C.fclose() int
```

# builtin.C.pclose
```v
fn C.pclose() int
```

# builtin.C.system
```v
fn C.system() int
```

# builtin.C.setenv
```v
fn C.setenv() int
```

# builtin.C.unsetenv
```v
fn C.unsetenv() int
```

# builtin.C.access
```v
fn C.access() int
```

# builtin.C.remove
```v
fn C.remove() int
```

# builtin.C.rmdir
```v
fn C.rmdir() int
```

# builtin.C.chdir
```v
fn C.chdir() int
```

# builtin.C.fread
```v
fn C.fread() int
```

# builtin.C.rewind
```v
fn C.rewind() int
```

# builtin.C.stat
```v
fn C.stat() int
```

# builtin.C.lstat
```v
fn C.lstat() int
```

# builtin.C.rename
```v
fn C.rename() int
```

# builtin.C.fgets
```v
fn C.fgets() int
```

# builtin.C.memset
```v
fn C.memset() int
```

# builtin.C.sigemptyset
```v
fn C.sigemptyset() int
```

# builtin.C.getcwd
```v
fn C.getcwd() int
```

# builtin.C.signal
```v
fn C.signal() int
```

# builtin.C.mktime
```v
fn C.mktime() int
```

# builtin.C.gettimeofday
```v
fn C.gettimeofday() int
```

# builtin.C.sleep
```v
fn C.sleep() int
```

# builtin.C.usleep
```v
fn C.usleep() int
```

# builtin.C.opendir
```v
fn C.opendir() voidptr
```

# builtin.C.closedir
```v
fn C.closedir() int
```

# builtin.C.mkdir
```v
fn C.mkdir() int
```

# builtin.C.srand
```v
fn C.srand() int
```

# builtin.C.atof
```v
fn C.atof() int
```

# builtin.C.tolower
```v
fn C.tolower() int
```

# builtin.C.toupper
```v
fn C.toupper() int
```

# builtin.C.getchar
```v
fn C.getchar() int
```

# builtin.C.strerror
```v
fn C.strerror(int) charptr
```

# builtin.C.snprintf
```v
fn C.snprintf() int
```

# builtin.C.fprintf
```v
fn C.fprintf(byteptr, ...byteptr) void
```

# builtin.C.WIFEXITED
```v
fn C.WIFEXITED() bool
```

# builtin.C.WEXITSTATUS
```v
fn C.WEXITSTATUS() int
```

# builtin.C.WIFSIGNALED
```v
fn C.WIFSIGNALED() bool
```

# builtin.C.WTERMSIG
```v
fn C.WTERMSIG() int
```

# builtin.C.DEFAULT_LE
```v
fn C.DEFAULT_LE() bool
```

# builtin.C.DEFAULT_EQ
```v
fn C.DEFAULT_EQ() bool
```

# builtin.C.DEFAULT_GT
```v
fn C.DEFAULT_GT() bool
```

# builtin.C.DEFAULT_EQUAL
```v
fn C.DEFAULT_EQUAL() bool
```

# builtin.C.DEFAULT_NOT_EQUAL
```v
fn C.DEFAULT_NOT_EQUAL() bool
```

# builtin.C.DEFAULT_LT
```v
fn C.DEFAULT_LT() bool
```

# builtin.C.DEFAULT_GE
```v
fn C.DEFAULT_GE() bool
```

# builtin.C.isatty
```v
fn C.isatty() int
```

# builtin.C.syscall
```v
fn C.syscall() int
```

# builtin.C.sysctl
```v
fn C.sysctl() int
```

# builtin.C._fileno
```v
fn C._fileno(int) int
```

# builtin.C._get_osfhandle
```v
fn C._get_osfhandle(fd int) C.intptr_t
```

# builtin.C.GetModuleFileNameW
```v
fn C.GetModuleFileNameW(hModule voidptr, lpFilename &u16, nSize u32) u32
```

# builtin.C.CreatePipe
```v
fn C.CreatePipe(hReadPipe &voidptr, hWritePipe &voidptr, lpPipeAttributes voidptr, nSize u32) bool
```

# builtin.C.SetHandleInformation
```v
fn C.SetHandleInformation(hObject voidptr, dwMask u32, dwFlags u32) bool
```

# builtin.C.ExpandEnvironmentStringsW
```v
fn C.ExpandEnvironmentStringsW(lpSrc &u16, lpDst &u16, nSize u32) u32
```

# builtin.C.CreateProcessW
```v
fn C.CreateProcessW(lpApplicationName &u16, lpCommandLine &u16, lpProcessAttributes voidptr, lpThreadAttributes voidptr, bInheritHandles bool, dwCreationFlags u32, lpEnvironment voidptr, lpCurrentDirectory &u16, lpStartupInfo voidptr, lpProcessInformation voidptr) bool
```

# builtin.C.ReadFile
```v
fn C.ReadFile(hFile voidptr, lpBuffer voidptr, nNumberOfBytesToRead u32, lpNumberOfBytesRead voidptr, lpOverlapped voidptr) bool
```

# builtin.C.GetFileAttributesW
```v
fn C.GetFileAttributesW(lpFileName byteptr) u32
```

# builtin.C.RegQueryValueExW
```v
fn C.RegQueryValueExW(hKey voidptr, lpValueName &u16, lpReserved &u32, lpType &u32, lpData byteptr, lpcbData &u32) int
```

# builtin.C.RegOpenKeyExW
```v
fn C.RegOpenKeyExW(hKey voidptr, lpSubKey &u16, ulOptions u32, samDesired u32, phkResult voidptr) int
```

# builtin.C.RegCloseKey
```v
fn C.RegCloseKey() void
```

# builtin.C.RegQueryValueEx
```v
fn C.RegQueryValueEx() voidptr
```

# builtin.C.RemoveDirectory
```v
fn C.RemoveDirectory() int
```

# builtin.C.GetStdHandle
```v
fn C.GetStdHandle() voidptr
```

# builtin.C.SetConsoleMode
```v
fn C.SetConsoleMode() void
```

# builtin.C.GetConsoleMode
```v
fn C.GetConsoleMode() int
```

# builtin.C.wprintf
```v
fn C.wprintf() void
```

# builtin.C.setbuf
```v
fn C.setbuf() void
```

# builtin.C.SymCleanup
```v
fn C.SymCleanup() void
```

# builtin.C.MultiByteToWideChar
```v
fn C.MultiByteToWideChar() int
```

# builtin.C.wcslen
```v
fn C.wcslen() int
```

# builtin.C.WideCharToMultiByte
```v
fn C.WideCharToMultiByte() int
```

# builtin.C._wstat
```v
fn C._wstat() void
```

# builtin.C._wrename
```v
fn C._wrename() void
```

# builtin.C._wfopen
```v
fn C._wfopen() voidptr
```

# builtin.C._wpopen
```v
fn C._wpopen() voidptr
```

# builtin.C._pclose
```v
fn C._pclose() int
```

# builtin.C._wsystem
```v
fn C._wsystem() int
```

# builtin.C._wgetenv
```v
fn C._wgetenv() voidptr
```

# builtin.C._putenv
```v
fn C._putenv() int
```

# builtin.C._waccess
```v
fn C._waccess() int
```

# builtin.C._wremove
```v
fn C._wremove() void
```

# builtin.C.ReadConsole
```v
fn C.ReadConsole() voidptr
```

# builtin.C.WriteConsole
```v
fn C.WriteConsole() voidptr
```

# builtin.C.WriteFile
```v
fn C.WriteFile() voidptr
```

# builtin.C.GetModuleFileName
```v
fn C.GetModuleFileName() int
```

# builtin.C._wchdir
```v
fn C._wchdir() void
```

# builtin.C._wgetcwd
```v
fn C._wgetcwd() int
```

# builtin.C._fullpath
```v
fn C._fullpath() int
```

# builtin.C.GetCommandLine
```v
fn C.GetCommandLine() voidptr
```

# builtin.C.LocalFree
```v
fn C.LocalFree() void
```

# builtin.C.FindFirstFileW
```v
fn C.FindFirstFileW() voidptr
```

# builtin.C.FindFirstFile
```v
fn C.FindFirstFile() voidptr
```

# builtin.C.FindNextFile
```v
fn C.FindNextFile() voidptr
```

# builtin.C.FindClose
```v
fn C.FindClose() void
```

# builtin.C.MAKELANGID
```v
fn C.MAKELANGID() int
```

# builtin.C.FormatMessage
```v
fn C.FormatMessage() voidptr
```

# builtin.C.CloseHandle
```v
fn C.CloseHandle() void
```

# builtin.C.GetExitCodeProcess
```v
fn C.GetExitCodeProcess() void
```

# builtin.C.RegOpenKeyEx
```v
fn C.RegOpenKeyEx() voidptr
```

# builtin.C.GetTickCount
```v
fn C.GetTickCount() i64
```

# builtin.C.Sleep
```v
fn C.Sleep() void
```

# builtin.C.WSAStartup
```v
fn C.WSAStartup(u16, &voidptr) int
```

# builtin.C.WSAGetLastError
```v
fn C.WSAGetLastError() int
```

# builtin.C.closesocket
```v
fn C.closesocket(int) int
```

# builtin.C.vschannel_init
```v
fn C.vschannel_init(&C.TlsContext) void
```

# builtin.C.request
```v
fn C.request(&C.TlsContext, int, &u16, byteptr, &byteptr) void
```

# builtin.C.vschannel_cleanup
```v
fn C.vschannel_cleanup(&C.TlsContext) void
```

# builtin.C.URLDownloadToFile
```v
fn C.URLDownloadToFile(int, &u16, &u16, int, int) void
```

# builtin.C.GetLastError
```v
fn C.GetLastError() u32
```

# builtin.C.CreateDirectory
```v
fn C.CreateDirectory(byteptr, int) bool
```

# builtin.C.BCryptGenRandom
```v
fn C.BCryptGenRandom(int, voidptr, int, int) int
```

# builtin.C.CreateMutex
```v
fn C.CreateMutex(int, bool, byteptr) voidptr
```

# builtin.C.WaitForSingleObject
```v
fn C.WaitForSingleObject(voidptr, int) int
```

# builtin.C.ReleaseMutex
```v
fn C.ReleaseMutex(voidptr) bool
```

# builtin.init
```v
fn init() void
```

# builtin.exit
```v
pub fn exit(code int) void
```

# builtin.isnil
```v
pub fn isnil(v voidptr) bool
```
isnil returns true if an object is nil (only for C objects).
# builtin.on_panic
```v
fn on_panic(f fn(int)int) void
```

# builtin.print_backtrace_skipping_top_frames
```v
pub fn print_backtrace_skipping_top_frames(skipframes int) void
```

# builtin.print_backtrace
```v
pub fn print_backtrace() void
```

# builtin.panic_debug
```v
fn panic_debug(line_no int, file, mod, fn_name, s string) void
```
replaces panic when -debug arg is passed
# builtin.panic
```v
pub fn panic(s string) void
```

# builtin.eprintln
```v
pub fn eprintln(s string) void
```

# builtin.eprint
```v
pub fn eprint(s string) void
```

# builtin.malloc
```v
pub fn malloc(n int) byteptr
```

# builtin.calloc
```v
pub fn calloc(n int) byteptr
```

# builtin.memdup
```v
pub fn memdup(src voidptr, sz int) voidptr
```

# builtin.v_ptr_free
```v
fn v_ptr_free(ptr voidptr) void
```

# builtin.is_atty
```v
pub fn is_atty(fd int) int
```

# builtin.SymbolInfo
```v
SymbolInfo {f_size_of_struct u32, f_type_index u32, f_reserved []int, f_index u32, f_size u32, f_mod_base u64, f_flags u32, f_value u64, f_address u64, f_register u32, f_scope u32, f_tag u32, f_name_len u32, f_max_name_len u32, f_name byte} struct
```

# builtin.SymbolInfoContainer
```v
SymbolInfoContainer {syminfo SymbolInfo, f_name_rest []int} struct
```

# builtin.Line64
```v
Line64 {f_size_of_struct u32, f_key voidptr, f_line_number u32, f_file_name byteptr, f_address u64} struct
```

# builtin.C.SymSetOptions
```v
fn C.SymSetOptions(symoptions u32) u32
```

# builtin.C.GetCurrentProcess
```v
fn C.GetCurrentProcess() voidptr
```

# builtin.C.SymInitialize
```v
fn C.SymInitialize(h_process voidptr, p_user_search_path byteptr, b_invade_process int) int
```

# builtin.C.CaptureStackBackTrace
```v
fn C.CaptureStackBackTrace(frames_to_skip u32, frames_to_capture u32, p_backtrace voidptr, p_backtrace_hash voidptr) u16
```

# builtin.C.SymFromAddr
```v
fn C.SymFromAddr(h_process voidptr, address u64, p_displacement voidptr, p_symbol voidptr) int
```

# builtin.C.SymGetLineFromAddr64
```v
fn C.SymGetLineFromAddr64(h_process voidptr, address u64, p_displacement voidptr, p_line &Line64) int
```

# builtin.print_backtrace_skipping_top_frames_msvc
```v
fn print_backtrace_skipping_top_frames_msvc(skipframes int) bool
```

# builtin.print_backtrace_skipping_top_frames_mingw
```v
fn print_backtrace_skipping_top_frames_mingw(skipframes int) bool
```

# builtin.print_backtrace_skipping_top_frames_nix
```v
fn print_backtrace_skipping_top_frames_nix(xskipframes int) bool
```

# builtin.println
```v
pub fn println(s string) void
```
ub fn vsyscall(id int 
 
 
pub const ( 
sys_write = 1 
sys_mkdir = 83 
) 
const ( 
stdin_value = 0 
stdout_value = 1 
stderr_value  = 2 
) 
 
fn C.puts(charptr)
# builtin.print_backtrace_skipping_top_frames_mac
```v
fn print_backtrace_skipping_top_frames_mac(skipframes int) bool
```
the functions below are not called outside this file, 
so there is no need to have their twins in builtin_windows.v
# builtin.print_backtrace_skipping_top_frames_freebsd
```v
fn print_backtrace_skipping_top_frames_freebsd(skipframes int) bool
```

# builtin.print_backtrace_skipping_top_frames_linux
```v
fn print_backtrace_skipping_top_frames_linux(skipframes int) bool
```

# strings.write_bytes
```v
pub fn (b mut Builder) write_bytes(bytes byteptr, howmany int) void
```

# builtin.array
```v
array {data voidptr, len int, cap int, element_size int} struct
```

# builtin.new_array
```v
fn new_array(mylen int, cap int, elm_size int) array
```
struct Foo { 
a []string 
b [][]string 
} 
 
Internal function, used by V (`nums := []int`)
# builtin.make
```v
pub fn make(len int, cap int, elm_size int) array
```
TODO
# builtin.new_array_from_c_array
```v
fn new_array_from_c_array(len, cap, elm_size int, c_array voidptr) array
```
Private function, used by V (`nums := [1, 2, 3]`)
# builtin.new_array_from_c_array_no_alloc
```v
fn new_array_from_c_array_no_alloc(len, cap, elm_size int, c_array voidptr) array
```
Private function, used by V (`nums := [1, 2, 3] !`)
# builtin.ensure_cap
```v
fn (a mut array) ensure_cap(required int) void
```
Private function. Doubles array capacity if needed
# builtin.sort_with_compare
```v
pub fn (a mut array) sort_with_compare(compare voidptr) void
```
array.sort sorts array in-place using given `compare` function as comparator
# builtin.prepend
```v
pub fn (a mut array) prepend(val voidptr) void
```
TODO array.prepend is broken 
It depends on array.insert 
-----------------------------
# builtin.first
```v
pub fn (a array) first() voidptr
```
array.first returns the first element of the array
# builtin.last
```v
pub fn (a array) last() voidptr
```
array.last returns the last element of the array
# builtin.slice
```v
fn (a array) slice(start, _end int) array
```
array.left returns a new array using the same buffer as the given array 
with the first `n` elements of the given array. 
fn (a array) left(n int) array { 
if n < 0 { 
panic('array.left: index is negative (n == $n)') 
} 
if n >= a.len { 
return a.slice(0, a.len) 
} 
return a.slice(0, n) 
} 
 
array.right returns an array using same buffer as the given array 
but starting with the element of the given array beyond the index `n`. 
If `n` is bigger or equal to the length of the given array, 
returns an empty array of the same type as the given array. 
fn (a array) right(n int) array { 
if n < 0 { 
panic('array.right: index is negative (n == $n)') 
} 
if n >= a.len { 
return new_array(0, 0, a.element_size) 
} 
return a.slice(n, a.len) 
} 
 
array.slice returns an array using the same buffer as original array 
but starting from the `start` element and ending with the element before 
the `end` element of the original array with the length and capacity 
set to the number of the elements in the slice.
# builtin.slice2
```v
fn (a array) slice2(start, _end int, end_max bool) array
```
used internally for [2..4]
# builtin.slice_clone
```v
fn (a array) slice_clone(start, _end int) array
```

# builtin.push
```v
fn (a mut array) push(val voidptr) void
```

# builtin.push_many
```v
pub fn (a mut array) push_many(val voidptr, size int) void
```
`val` is array.data 
TODO make private, right now it's used by strings.Builder
# builtin.copy
```v
pub fn copy(dst, src []byte) int
```
copy copies the `src` byte array elements to the `dst` byte array. 
The number of the elements copied is the minimum of the length of both arrays. 
Returns the number of elements copied. 
TODO: implement for all types
# builtin.compare_ints
```v
fn compare_ints(a, b &int) int
```
Private function. Comparator for int type.
# builtin.reduce
```v
pub fn (a []int) reduce(iter fn(accum, curr int)int, accum_start int) int
```
[]int.reduce executes a given reducer function on each element of the array, 
resulting in a single output value.
# builtin.array_eq<T>
```v
fn array_eq<T>(a1, a2 []T) bool
```
array_eq<T> checks if two arrays contain all the same elements in the same order. 
[]int == []int (also for: i64, f32, f64, byte, string)
# builtin.compare_i64
```v
pub fn compare_i64(a, b &i64) int
```
compare_i64 for []f64 sort_with_compare() 
sort []i64 with quicksort 
usage : 
mut x := [i64(100),10,70,28,92] 
x.sort_with_compare(compare_i64) 
println(x)     // Sorted i64 Array 
output: 
[10, 28, 70, 92, 100]
# builtin.compare_f64
```v
pub fn compare_f64(a, b &f64) int
```
compare_f64 for []f64 sort_with_compare() 
ref. compare_i64(...)
# builtin.compare_f32
```v
pub fn compare_f32(a, b &f32) int
```
compare_f32 for []f32 sort_with_compare() 
ref. compare_i64(...)
# os.C.symlink
```v
fn C.symlink(charptr, charptr) int
```

# os.init_os_args
```v
pub fn init_os_args(argc int, argv &byteptr) []string
```

# os.ls
```v
pub fn ls(path string) ?[]string
```

# os.open
```v
pub fn open(path string) ?File
```
pub fn is_dir(path string) bool { 
_path := path.replace('/', '\\') 
attr := C.GetFileAttributesW(_path.to_wide()) 
if int(attr) == int(C.INVALID_FILE_ATTRIBUTES) { 
return false 
} 
if (int(attr) & C.FILE_ATTRIBUTE_DIRECTORY) != 0 { 
return true 
} 
return false 
}
# os.create
```v
pub fn create(path string) ?File
```
create creates a file at a specified location and returns a writable `File` object.
# os.write
```v
pub fn (f mut File) write(s string) void
```

# os.writeln
```v
pub fn (f mut File) writeln(s string) void
```

# os.mkdir
```v
pub fn mkdir(path string) ?bool
```
mkdir creates a new directory with the specified path.
# os.exec
```v
pub fn exec(cmd string) ?Result
```
exec starts the specified command, waits for it to complete, and returns its output.
# os.symlink
```v
pub fn symlink(origin, target string) ?bool
```

# os.get_error_msg
```v
pub fn get_error_msg(code int) string
```
get_error_msg return error code representation in string.
# os.write_bytes
```v
pub fn (f mut File) write_bytes(data voidptr, size int) void
```

# os.close
```v
pub fn (f mut File) close() void
```

# os.HANDLE
```v
(alias) HANDLE voidptr
```

# os.Filetime
```v
Filetime {dwLowDateTime u32, dwHighDateTime u32} struct
```

# os.Win32finddata
```v
Win32finddata {dwFileAttributes u32, ftCreationTime Filetime, ftLastAccessTime Filetime, ftLastWriteTime Filetime, nFileSizeHigh u32, nFileSizeLow u32, dwReserved0 u32, dwReserved1 u32, cFileName []int, cAlternateFileName []int, dwFileType u32, dwCreatorType u32, wFinderFlags u16} struct
```

# os.ProcessInformation
```v
ProcessInformation {hProcess voidptr, hThread voidptr, dwProcessId u32, dwThreadId u32} struct
```

# os.StartupInfo
```v
StartupInfo {cb u32, lpReserved unknown, lpDesktop unknown, lpTitle unknown, dwX u32, dwY u32, dwXSize u32, dwYSize u32, dwXCountChars u32, dwYCountChars u32, dwFillAttribute u32, dwFlags u32, wShowWindow u16, cbReserved2 u16, lpReserved2 byteptr, hStdInput voidptr, hStdOutput voidptr, hStdError voidptr} struct
```

# os.SecurityAttributes
```v
SecurityAttributes {nLength u32, lpSecurityDescriptor voidptr, bInheritHandle bool} struct
```

# os.init_os_args_wide
```v
fn init_os_args_wide(argc int, argv &byteptr) []string
```

# os.get_file_handle
```v
pub fn get_file_handle(path string) HANDLE
```
Ref - https://docs.microsoft.com/en-us/cpp/c-runtime-library/reference/get-osfhandle?view=vs-2019 
get_file_handle retrieves the operating-system file handle that is associated with the specified file descriptor.
# os.get_module_filename
```v
pub fn get_module_filename(handle HANDLE) ?string
```
Ref - https://docs.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getmodulefilenamea 
get_module_filename retrieves the fully qualified path for the file that contains the specified module. 
The module must have been loaded by the current process.
# os.ptr_win_get_error_msg
```v
fn ptr_win_get_error_msg(code u32) voidptr
```
ptr_win_get_error_msg return string (voidptr) 
representation of error, only for windows.
# os.C.CreateSymbolicLinkW
```v
fn C.CreateSymbolicLinkW(&u16, &u16, u32) int
```

# filepath.ext
```v
pub fn ext(path string) string
```
ext returns the extension in the file `path`.
# filepath.is_abs
```v
pub fn is_abs(path string) bool
```
is_abs returns true if `path` is absolute.
# filepath.join
```v
pub fn join(base string, dirs ...string) string
```
join returns path as string from string parameter(s).
# filepath.dir
```v
pub fn dir(path string) string
```
dir returns all but the last element of path, typically the path's directory.
# filepath.basedir
```v
pub fn basedir(path string) string
```
basedir returns a directory name from path
# filepath.filename
```v
pub fn filename(path string) string
```
filename returns a file name from path
# os.C.dirent
```v
C.dirent {d_name byteptr} struct
```

# os.C.readdir
```v
fn C.readdir(voidptr) C.dirent
```

# os.File
```v
File {cfile voidptr, fd int, opened bool} struct
```

# os.FileInfo
```v
FileInfo {name string, size int} struct
```

# os.C.stat
```v
C.stat {st_size int, st_mode u32, st_mtime int} struct
```

# os.C.DIR
```v
C.DIR {} struct
```

# os.C.sigaction
```v
fn C.sigaction(int, voidptr, int) void
```

# os.C.getline
```v
fn C.getline(voidptr, voidptr, voidptr) int
```

# os.C.ftell
```v
fn C.ftell(fp voidptr) int
```

# os.C.getenv
```v
fn C.getenv(byteptr) &char
```

# os.C.open
```v
fn C.open(charptr, int, int) int
```

# os.C.fdopen
```v
fn C.fdopen(int, string) voidptr
```

# os.is_opened
```v
pub fn (f File) is_opened() bool
```

# os.read_bytes
```v
pub fn read_bytes(path string) ?[]byte
```

# os.read_bytes_at
```v
pub fn (f &File) read_bytes_at(size, pos int) []byte
```
read_bytes_at reads an amount of bytes at the given position in the file
# os.read_file
```v
pub fn read_file(path string) ?string
```
read_file reads the file in `path` and returns the contents.
# os.file_size
```v
pub fn file_size(path string) int
```
file_size returns the size of the file located in `path`.
# os.mv
```v
pub fn mv(old, new string) void
```

# os.C.CopyFile
```v
fn C.CopyFile(&u32, &u32, int) int
```

# os.cp
```v
pub fn cp(old, new string) ?bool
```
TODO implement actual cp for linux
# os.cp_r
```v
pub fn cp_r(osource_path, odest_path string, overwrite bool) ?bool
```

# os.mv_by_cp
```v
pub fn mv_by_cp(source string, target string) ?bool
```
mv_by_cp first copies the source file, and if it is copied successfully, deletes the source file. 
mv_by_cp may be used when you are not sure that the source and target are on the same mount/partition.
# os.vfopen
```v
fn vfopen(path, mode string) C.FILE
```

# os.read_lines
```v
pub fn read_lines(path string) ?[]string
```
read_lines reads the file in `path` into an array of lines.
# os.vpclose
```v
fn vpclose(f voidptr) int
```

# os.Result
```v
Result {exit_code int, output string} struct
```

# os.system
```v
pub fn system(cmd string) int
```
`system` works like `exec()`, but only returns a return code.
# os.sigint_to_signal_name
```v
pub fn sigint_to_signal_name(si int) string
```

# os.getenv
```v
pub fn getenv(key string) string
```
`getenv` returns the value of the environment variable named by the key.
# os.setenv
```v
pub fn setenv(name string, value string, overwrite bool) int
```

# os.unsetenv
```v
pub fn unsetenv(name string) int
```

# os.exists
```v
pub fn exists(path string) bool
```
exists returns true if `path` exists.
# os.is_executable
```v
pub fn is_executable(path string) bool
```
`is_executable` returns `true` if `path` is executable.
# os.is_writable
```v
pub fn is_writable(path string) bool
```
`is_writable` returns `true` if `path` is writable.
# os.is_readable
```v
pub fn is_readable(path string) bool
```
`is_readable` returns `true` if `path` is readable.
# os.file_exists
```v
pub fn file_exists(_path string) bool
```

# os.rm
```v
pub fn rm(path string) void
```
rm removes file in `path`.
# os.rmdir
```v
pub fn rmdir(path string) void
```
rmdir removes a specified directory.
# os.rmdir_recursive
```v
pub fn rmdir_recursive(path string) void
```

# os.is_dir_empty
```v
pub fn is_dir_empty(path string) bool
```

# os.print_c_errno
```v
fn print_c_errno() void
```

# os.ext
```v
pub fn ext(path string) string
```

# os.dir
```v
pub fn dir(path string) string
```

# os.basedir
```v
pub fn basedir(path string) string
```

# os.filename
```v
pub fn filename(path string) string
```

# os.get_line
```v
pub fn get_line() string
```
get_line returns a one-line string from stdin
# os.get_raw_line
```v
pub fn get_raw_line() string
```
get_raw_line returns a one-line string from stdin along with '\n' if there is any
# os.get_lines
```v
pub fn get_lines() []string
```

# os.get_lines_joined
```v
pub fn get_lines_joined() string
```

# os.user_os
```v
pub fn user_os() string
```
user_os returns current user operating system name.
# os.home_dir
```v
pub fn home_dir() string
```
home_dir returns path to user's home directory.
# os.write_file
```v
pub fn write_file(path, text string) void
```
write_file writes `text` data to a file in `path`.
# os.clear
```v
pub fn clear() void
```
clear clears current terminal screen.
# os.on_segfault
```v
pub fn on_segfault(f voidptr) void
```

# os.C.getpid
```v
fn C.getpid() int
```

# os.C.proc_pidpath
```v
fn C.proc_pidpath(int, byteptr, int) int
```

# os.C.readlink
```v
fn C.readlink() int
```

# os.executable
```v
pub fn executable() string
```
executable returns the path name of the executable that started the current 
process.
# os.dir_exists
```v
pub fn dir_exists(path string) bool
```

# os.is_dir
```v
pub fn is_dir(path string) bool
```
is_dir returns a boolean indicating whether the given path is a directory.
# os.is_link
```v
pub fn is_link(path string) bool
```
is_link returns a boolean indicating whether the given path is a link.
# os.chdir
```v
pub fn chdir(path string) void
```
chdir changes the current working directory to the new directory path.
# os.getwd
```v
pub fn getwd() string
```
getwd returns the absolute path name of the current directory.
# os.realpath
```v
pub fn realpath(fpath string) string
```
Returns the full absolute path for fpath, with all relative ../../, symlinks and so on resolved. 
See http://pubs.opengroup.org/onlinepubs/9699919799/functions/realpath.html 
Also https://insanecoding.blogspot.com/2007/11/pathmax-simply-isnt.html 
and https://insanecoding.blogspot.com/2007/11/implementing-realpath-in-c.html 
NB: this particular rabbit hole is *deep* ...
# os.walk_ext
```v
pub fn walk_ext(path, ext string) []string
```
walk_ext returns a recursive list of all file paths ending with `ext`.
# os.walk
```v
pub fn walk(path string, fnc fn(path string)) void
```
walk recursively traverse the given directory path. 
When a file is encountred it will call the callback function with current file as argument.
# os.signal
```v
pub fn signal(signum int, handler voidptr) void
```

# os.C.fork
```v
fn C.fork() int
```

# os.C.wait
```v
fn C.wait() int
```

# os.fork
```v
pub fn fork() int
```

# os.wait
```v
pub fn wait() int
```

# os.file_last_mod_unix
```v
pub fn file_last_mod_unix(path string) int
```

# os.log
```v
pub fn log(s string) void
```

# os.flush_stdout
```v
pub fn flush_stdout() void
```

# os.mkdir_all
```v
pub fn mkdir_all(path string) void
```

# os.join
```v
pub fn join(base string, dirs ...string) string
```

# os.cachedir
```v
pub fn cachedir() string
```
cachedir returns the path to a *writable* user specific folder, suitable for writing non-essential data.
# os.tmpdir
```v
pub fn tmpdir() string
```
tmpdir returns the path to a folder, that is suitable for storing temporary files
# os.chmod
```v
pub fn chmod(path string, mode int) void
```

# os.resource_abs_path
```v
pub fn resource_abs_path(path string) string
```
resource_abs_path returns an absolute path, for the given `path` 
(the path is expected to be relative to the executable program) 
See https://discordapp.com/channels/592103645835821068/592294828432424960/630806741373943808 
It gives a convenient way to access program resources like images, fonts, sounds and so on, 
*no matter* how the program was started, and what is the current working directory.