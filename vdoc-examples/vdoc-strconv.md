# strconv module
- atof.v
- atoi.v
## Contents
- [strconv.PrepNumber](#strconvprepnumber)
- [strconv.atof64](#strconvatof)

## Documentation
### strconv.PrepNumber
```v
 struct PrepNumber {
    negative   bool
    exponent   int
    mantissa   u64
}
```
******************************************************************** 
 
 Support struct 
 
*********************************************************************/ 
The structure is filled by parser, then given to converter.

### strconv.atof64
```v
fn atof64(s string) f64
```
******************************************************************** 
 
 Public functions 
 
*********************************************************************/ 
atof64 return a f64 from a string doing a parsing operation
