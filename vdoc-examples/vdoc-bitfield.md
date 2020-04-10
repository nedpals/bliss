# bitfield module
- bitfield.v
## Contents
- [bitfield.BitField](#bitfieldbitfield)
- [bitfield.from_bytes](#bitfieldfrom_bytes)
- [bitfield.from_string](#bitfieldfrom_string)
- [bitfield.string](#bitfieldstring)
- [bitfield.setbit](#bitfieldsetbit)
- [bitfield.clearbit](#bitfieldclearbit)
- [bitfield.setall](#bitfieldsetall)
- [bitfield.clearall](#bitfieldclearall)
- [bitfield.togglebit](#bitfieldtogglebit)
- [bitfield.bfand](#bitfieldbfand)
- [bitfield.bfnot](#bitfieldbfnot)
- [bitfield.bfor](#bitfieldbfor)
- [bitfield.bfxor](#bitfieldbfxor)
- [bitfield.join](#bitfieldjoin)
- [bitfield.print](#bitfieldprint)
- [bitfield.getsize](#bitfieldgetsize)
- [bitfield.clone](#bitfieldclone)
- [bitfield.cmp](#bitfieldcmp)
- [bitfield.popcount](#bitfieldpopcount)
- [bitfield.hamming](#bitfieldhamming)
- [bitfield.pos](#bitfieldpos)
- [bitfield.slice](#bitfieldslice)
- [bitfield.reverse](#bitfieldreverse)
- [bitfield.resize](#bitfieldresize)
- [bitfield.rotate](#bitfieldrotate)

## Documentation
### bitfield.BitField
```v
 struct BitField {
    size   int
    field   []u32
}
```
bitfield is a module for 
manipulating arrays of bits, i.e. series of zeroes and ones spread across an 
array of storage units (unsigned 32-bit integers). 
 
BitField structure 
------------------ 
 
Bit arrays are stored in data structures called 'BitField'. The structure is 
'opaque', i.e. its internals are not available to the end user. This module 
provides API (functions and methods) for accessing and modifying bit arrays.

### bitfield.from_bytes
```v
fn from_bytes(input []byte) BitField
```
public functions 
from_bytes() converts a byte array into a bitfield.

### bitfield.from_string
```v
fn from_string(input string) BitField
```
from_string() converts a string of characters ('0' and '1') to a bit 
array. Any character different from '0' is treated as '1'.

### bitfield.string
```v
fn (input BitField) string() string
```
string() converts the bit array to a string of characters ('0' and '1') and 
return the string

### bitfield.setbit
```v
fn (instance mut BitField) setbit(bitnr int) void
```
setbit() set bit number 'bit_nr' to 1 (count from 0)

### bitfield.clearbit
```v
fn (instance mut BitField) clearbit(bitnr int) void
```
clearbit() clears (sets to zero) bit number 'bit_nr' (count from 0)

### bitfield.setall
```v
fn (instance mut BitField) setall() void
```
setall() sets all bits in the array to 1

### bitfield.clearall
```v
fn (instance mut BitField) clearall() void
```
clearall() clears (sets to zero) all bits in the array

### bitfield.togglebit
```v
fn (instance mut BitField) togglebit(bitnr int) void
```
togglebit() change the value (from 0 to 1 or from 1 to 0) of bit 
number 'bit_nr'

### bitfield.bfand
```v
fn bfand(input1 BitField, input2 BitField) BitField
```
bfand() perform logical AND operation on every pair of bits from 'input1' 
and 'input2' and return the result as a new array. If inputs differ in size, 
the tail of the longer one is ignored.

### bitfield.bfnot
```v
fn bfnot(input BitField) BitField
```
bfnot() toggle all bits in a bit array and return the result as a new array

### bitfield.bfor
```v
fn bfor(input1 BitField, input2 BitField) BitField
```
bfor() perform logical OR operation on every pair of bits from 'input1' and 
'input2' and return the result as a new array. If inputs differ in size, the 
tail of the longer one is ignored.

### bitfield.bfxor
```v
fn bfxor(input1 BitField, input2 BitField) BitField
```
bfxor(input1 BitField, input2 BitField) perform logical XOR operation on 
every pair of bits from 'input1' and 'input2' and return the result as a new 
array. If inputs differ in size, the tail of the longer one is ignored.

### bitfield.join
```v
fn join(input1 BitField, input2 BitField) BitField
```
join() concatenates two bit arrays and return the result as a new array.

### bitfield.print
```v
fn print(instance BitField) void
```
print(instance BitField) send the content of a bit array to stdout as a 
string of characters ('0' and '1').

### bitfield.getsize
```v
fn (instance BitField) getsize() int
```
getsize() returns the number of bits the array can hold

### bitfield.clone
```v
fn clone(input BitField) BitField
```
clone() create a copy of a bit array

### bitfield.cmp
```v
fn cmp(input1 BitField, input2 BitField) bool
```
cmp() compare two bit arrays bit by bit and return 'true' if they are 
identical by length and contents and 'false' otherwise.

### bitfield.popcount
```v
fn (instance BitField) popcount() int
```
popcount() returns the number of set bits (ones) in the array

### bitfield.hamming
```v
fn hamming(input1 BitField, input2 BitField) int
```
hamming () compute the Hamming distance between two bit arrays.

### bitfield.pos
```v
fn (haystack BitField) pos(needle BitField) int
```
pos() checks if the array contains a sub-array 'needle' and returns its 
position if it does, -1 if it does not, and -2 on error.

### bitfield.slice
```v
fn (input BitField) slice(_start int, _end int) BitField
```
slice() return a sub-array of bits between 'start_bit_nr' (included) and 
'end_bit_nr' (excluded)

### bitfield.reverse
```v
fn (instance BitField) reverse() BitField
```
### bitfield.resize
```v
fn (instance mut BitField) resize(new_size int) void
```
resize changes the size of the bit array to 'new_size'

### bitfield.rotate
```v
fn (instance BitField) rotate(offset int) BitField
```
rotate(offset int) circular-shift the bits by 'offset' positions (move 
'offset' bit to 0, 'offset+1' bit to 1, and so on)
