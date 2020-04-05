# darwin module
- darwin.v
## Contents
- [darwin.nsstring](#darwinnsstring)
- [darwin.resource_path](#darwinresource_path)

## Documentation
### darwin.nsstring
```v
fn nsstring(s string) voidptr
```
macOS and iOS helpers 
ub fn nsstring(s string) *C.NSString {

### darwin.resource_path
```v
fn resource_path() string
```