# strings module
- builder_c.v
- similarity.v
- strings_c.v
## Contents
- [strings.Builder](#stringsbuilder)
- [strings.new_builder](#stringsnew_builder)
- [strings.Builder.write_bytes](#stringsbuilderwrite_bytes)
- [strings.Builder.write_b](#stringsbuilderwrite_b)
- [strings.Builder.write](#stringsbuilderwrite)
- [strings.Builder.go_back](#stringsbuildergo_back)
- [strings.Builder.writeln](#stringsbuilderwriteln)
- [strings.&Builder.last_n](#stringsbuilderlast_n)
- [strings.&Builder.after](#stringsbuilderafter)
- [strings.Builder.str](#stringsbuilderstr)
- [strings.Builder.free](#stringsbuilderfree)

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
### strings.Builder.write_bytes
```v
fn (b mut Builder) write_bytes(bytes byteptr, howmany int) void
```
### strings.Builder.write_b
```v
fn (b mut Builder) write_b(data byte) void
```
### strings.Builder.write
```v
fn (b mut Builder) write(s string) void
```
### strings.Builder.go_back
```v
fn (b mut Builder) go_back(n int) void
```
### strings.Builder.writeln
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

### strings.Builder.str
```v
fn (b mut Builder) str() string
```
### strings.Builder.free
```v
fn (b mut Builder) free() void
```