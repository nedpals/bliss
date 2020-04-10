# builtin module
- array.v
- builtin_nix.v
- builtin_windows.v
- builtin.v
- cfns.v
- float.v
- int.v
- map.v
- option.v
- sorted_map.v
- string.v
- utf8.v
## Contents
- [builtin.array](#builtinarray)
- [builtin.make](#builtinmake)
- [builtin.repeat](#builtinrepeat)
- [builtin.sort_with_compare](#builtinsort_with_compare)
- [builtin.insert](#builtininsert)
- [builtin.prepend](#builtinprepend)
- [builtin.delete](#builtindelete)
- [builtin.clear](#builtinclear)
- [builtin.trim](#builtintrim)
- [builtin.first](#builtinfirst)
- [builtin.last](#builtinlast)
- [builtin.&array.clone](#builtinarrayclone)
- [builtin.push_many](#builtinpush_many)
- [builtin.reverse](#builtinreverse)
- [builtin.free](#builtinfree)
- [builtin.[]string.str](#builtinstringstr)
- [builtin.[]int.str](#builtinintstr)
- [builtin.[]bool.str](#builtinboolstr)
- [builtin.[]byte.hex](#builtinbytehex)
- [builtin.copy](#builtincopy)
- [builtin.[]int.sort](#builtinintsort)
- [builtin.[]string.index](#builtinstringindex)
- [builtin.[]int.index](#builtinintindex)
- [builtin.[]byte.index](#builtinbyteindex)
- [builtin.[]char.index](#builtincharindex)
- [builtin.[]int.reduce](#builtinintreduce)
- [builtin.[]string.eq](#builtinstringeq)
- [builtin.compare_i64](#builtincompare_i)
- [builtin.compare_f64](#builtincompare_f)
- [builtin.compare_f32](#builtincompare_f)
- [builtin.pointers](#builtinpointers)

## Documentation
### builtin.array
```v
 struct array {
    data   voidptr
    len   int
    cap   int
    element_size   int
}
```
### builtin.make
```v
fn make(len int, cap int, elm_size int) array
```
TODO

### builtin.repeat
```v
fn (a array) repeat(count int) array
```
repeat returns new array with the given array elements repeated given times.

### builtin.sort_with_compare
```v
fn (a mut array) sort_with_compare(compare voidptr) void
```
array.sort sorts array in-place using given `compare` function as comparator

### builtin.insert
```v
fn (a mut array) insert(i int, val voidptr) void
```
TODO array.insert is broken 
Cannot pass literal or primitive type as it cannot be cast to voidptr. 
In the current state only that would work: 
i := 3 
a.insert(0, &i) 
----------------------------

### builtin.prepend
```v
fn (a mut array) prepend(val voidptr) void
```
TODO array.prepend is broken 
It depends on array.insert 
-----------------------------

### builtin.delete
```v
fn (a mut array) delete(i int) void
```
array.delete deletes array element at the given index

### builtin.clear
```v
fn (a mut array) clear() void
```
clears the array without deallocating the allocated data

### builtin.trim
```v
fn (a mut array) trim(index int) void
```
trims the array length to "index" without modifying the allocated data. If "index" is greater 
than len nothing will be changed

### builtin.first
```v
fn (a array) first() voidptr
```
array.first returns the first element of the array

### builtin.last
```v
fn (a array) last() voidptr
```
array.last returns the last element of the array

### builtin.&array.clone
```v
fn (a &array) clone() array
```
array.clone returns an independent copy of a given array

### builtin.push_many
```v
fn (a3 mut array) push_many(val voidptr, size int) void
```
`val` is array.data 
TODO make private, right now it's used by strings.Builder

### builtin.reverse
```v
fn (a array) reverse() array
```
array.reverse returns a new array with the elements of 
the original array in reverse order.

### builtin.free
```v
fn (a array) free() void
```
pub fn (a []int) free() {

### builtin.[]string.str
```v
fn (a []string) str() string
```
[]string.str returns a string representation of the array of strings 
=> '["a", "b", "c"]'

### builtin.[]int.str
```v
fn (a []int) str() string
```
[]int.str returns a string representation of the array of ints 
=> '[1, 2, 3]'

### builtin.[]bool.str
```v
fn (a []bool) str() string
```
[]bool.str returns a string representation of the array of bools 
=> '[true, true, false]'

### builtin.[]byte.hex
```v
fn (b []byte) hex() string
```
[]byte.hex returns a string with the hexadecimal representation 
of the byte elements of the array

### builtin.copy
```v
fn copy(dst, src []byte) int
```
copy copies the `src` byte array elements to the `dst` byte array. 
The number of the elements copied is the minimum of the length of both arrays. 
Returns the number of elements copied. 
TODO: implement for all types

### builtin.[]int.sort
```v
fn (a mut []int) sort() void
```
[]int.sort sorts array of int in place in ascending order.

### builtin.[]string.index
```v
fn (a []string) index(v string) int
```
[]string.index returns the index of the first element equal to the given value, 
or -1 if the value is not found in the array.

### builtin.[]int.index
```v
fn (a []int) index(v int) int
```
[]int.index returns the index of the first element equal to the given value, 
or -1 if the value is not found in the array.

### builtin.[]byte.index
```v
fn (a []byte) index(v byte) int
```
[]byte.index returns the index of the first element equal to the given value, 
or -1 if the value is not found in the array.

### builtin.[]char.index
```v
fn (a []char) index(v char) int
```
[]char.index returns the index of the first element equal to the given value, 
or -1 if the value is not found in the array. 
TODO is `char` type yet in the language?

### builtin.[]int.reduce
```v
fn (a []int) reduce(iter fn(accum, curr int)int, accum_start int) int
```
[]int.reduce executes a given reducer function on each element of the array, 
resulting in a single output value.

### builtin.[]string.eq
```v
fn (a1 []string) eq(a2 []string) bool
```
array_eq<T> checks if two arrays contain all the same elements in the same order. 
[]int == []int (also for: i64, f32, f64, byte, string) 
 
fn array_eq<T>(a1, a2 []T) bool { 
if a1.len != a2.len { 
return false 
} 
for i in 0..a1.len { 
if a1[i] != a2[i] { 
return false 
} 
} 
return true 
} 
 
pub fn (a []int) eq(a2 []int) bool { 
return array_eq(a, a2) 
} 
 
pub fn (a []i64) eq(a2 []i64) bool { 
return array_eq(a, a2) 
} 
 
 
pub fn (a []byte) eq(a2 []byte) bool { 
return array_eq(a, a2) 
} 
 
pub fn (a []f32) eq(a2 []f32) bool { 
return array_eq(a, a2) 
}

### builtin.compare_i64
```v
fn compare_i64(a, b &i64) int
```
compare_i64 for []f64 sort_with_compare() 
sort []i64 with quicksort 
usage : 
mut x := [i64(100),10,70,28,92] 
x.sort_with_compare(compare_i64) 
println(x)     // Sorted i64 Array 
output: 
[10, 28, 70, 92, 100]

### builtin.compare_f64
```v
fn compare_f64(a, b &f64) int
```
compare_f64 for []f64 sort_with_compare() 
ref. compare_i64(...)

### builtin.compare_f32
```v
fn compare_f32(a, b &f32) int
```
compare_f32 for []f32 sort_with_compare() 
ref. compare_i64(...)

### builtin.pointers
```v
fn (a array) pointers() []voidptr
```
a.pointers() returns a new array, where each element 
is the address of the corresponding element in a.
