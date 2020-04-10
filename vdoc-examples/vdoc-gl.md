# gl module
- 1shader.v
- gl.v
## Contents
- [gl.Shader](#glshader)
- [gl.str](#glstr)
- [gl.TEXT_VERT](#gltext_vert)
- [gl.in](#glin)
- [gl.out](#glout)
- [gl.uniform](#gluniform)
- [gl.use](#gluse)
- [gl.uni_location](#gluni_location)
- [gl.set_mat4](#glset_mat)
- [gl.set_int](#glset_int)
- [gl.set_color](#glset_color)

## Documentation
### gl.Shader
```v
 struct Shader {
    program_id   int
}
```
import darwin

### gl.str
```v
fn (s Shader) str() string
```
### gl.TEXT_VERT
```v

```
### gl.in
```v

```
### gl.out
```v

```
### gl.uniform
```v

```
### gl.use
```v
fn (s Shader) use() void
```
### gl.uni_location
```v
fn (s Shader) uni_location(key string) int
```
### gl.set_mat4
```v
fn (s Shader) set_mat4(str string, m glm.Mat4) void
```
fn (s Shader) set_mat4(str string, f *f32) {

### gl.set_int
```v
fn (s Shader) set_int(str string, n int) void
```
### gl.set_color
```v
fn (s Shader) set_color(str string, c gx.Color) void
```