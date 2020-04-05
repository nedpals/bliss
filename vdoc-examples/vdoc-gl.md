# gl module
- 1shader.v
- gl.v
## Contents
- [gl.Shader](#glshader)
- [gl.Shader.str](#glshaderstr)
- [gl.TEXT_VERT](#gltext_vert)
- [gl.in](#glin)
- [gl.out](#glout)
- [gl.uniform](#gluniform)
- [gl.Shader.use](#glshaderuse)
- [gl.Shader.uni_location](#glshaderuni_location)
- [gl.Shader.set_mat4](#glshaderset_mat)
- [gl.Shader.set_int](#glshaderset_int)
- [gl.Shader.set_color](#glshaderset_color)

## Documentation
### gl.Shader
```v
 struct Shader {
    program_id   int
}
```
import darwin

### gl.Shader.str
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
### gl.Shader.use
```v
fn (s Shader) use() void
```
### gl.Shader.uni_location
```v
fn (s Shader) uni_location(key string) int
```
### gl.Shader.set_mat4
```v
fn (s Shader) set_mat4(str string, m glm.Mat4) void
```
fn (s Shader) set_mat4(str string, f *f32) {

### gl.Shader.set_int
```v
fn (s Shader) set_int(str string, n int) void
```
### gl.Shader.set_color
```v
fn (s Shader) set_color(str string, c gx.Color) void
```