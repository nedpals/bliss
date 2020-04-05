# stbi module
- stbi.v
## Contents
- [stbi.Image](#stbiimage)
- [stbi.load](#stbiload)
- [stbi.load_from_memory](#stbiload_from_memory)
- [stbi.Image.free](#stbiimagefree)
- [stbi.Image.tex_image_2d](#stbiimagetex_image_d)
- [stbi.set_flip_vertically_on_load](#stbiset_flip_vertically_on_load)

## Documentation
### stbi.Image
```v
 struct Image {
    width   int
    height   int
    nr_channels   int
    ok   bool
    data   voidptr
    ext   string
}
```
### stbi.load
```v
fn load(path string) Image
```
### stbi.load_from_memory
```v
fn load_from_memory(buf byteptr) Image
```
ub fn load_from_memory(buf []byte) Image {

### stbi.Image.free
```v
fn (img Image) free() void
```
### stbi.Image.tex_image_2d
```v
fn (img Image) tex_image_2d() void
```
### stbi.set_flip_vertically_on_load
```v
fn set_flip_vertically_on_load(val bool) void
```