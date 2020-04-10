# strings module
- builder_c.v
- similarity.v
- strings_c.v
## Contents
- [strings.Builder](#stringsbuilder)
- [strings.new_builder](#stringsnew_builder)
- [strings.write_bytes](#stringswrite_bytes)
- [strings.write_b](#stringswrite_b)
- [strings.write](#stringswrite)
- [strings.go_back](#stringsgo_back)
- [strings.writeln](#stringswriteln)
- [strings.&Builder.last_n](#stringsbuilderlast_n)
- [strings.&Builder.after](#stringsbuilderafter)
- [strings.str](#stringsstr)
- [strings.free](#stringsfree)

## Documentation
### strings.Builder
```v
 struct Builder {
    buf   []byte
    len   int
    initial_size   int
}
```
### strings.new_builder
```v
fn new_builder(initial_size int) Builder
```
### strings.write_bytes
```v
fn (b mut Builder) write_bytes(bytes byteptr, howmany int) void
```
### strings.write_b
```v
fn (b mut Builder) write_b(data byte) void
```
### strings.write
```v
fn (b mut Builder) write(s string) void
```
### strings.go_back
```v
fn (b mut Builder) go_back(n int) void
```
### strings.writeln
```v
fn (b mut Builder) writeln(s string) void
```
### strings.&Builder.last_n
```v
fn (b &Builder) last_n(n int) string
```
buf == 'hello world' 
last_n(5) returns 'world'

### strings.&Builder.after
```v
fn (b &Builder) after(n int) string
```
buf == 'hello world' 
after(6) returns 'world'

### strings.str
```v
fn (b mut Builder) str() string
```
### strings.free
```v
fn (b mut Builder) free() void
```