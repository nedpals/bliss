# gg module
- gg.v
- utils.v
## Contents
- [gg.Vec2](#ggvec)
- [gg.str](#ggstr)
- [gg.vec2](#ggvec)
- [gg.init_gg](#gginit_gg)
- [gg.Cfg](#ggcfg)
- [gg.GG](#gggg)
- [gg.new_context](#ggnew_context)
- [gg.clear](#ggclear)
- [gg.&GG.render](#ggggrender)
- [gg.&GG.draw_triangle](#ggggdraw_triangle)
- [gg.&GG.draw_triangle_tex](#ggggdraw_triangle_tex)
- [gg.&GG.draw_rect](#ggggdraw_rect)
- [gg.set_mode_wireframe](#ggset_mode_wireframe)
- [gg.set_mode_point](#ggset_mode_point)
- [gg.set_mode_fill](#ggset_mode_fill)
- [gg.&GG.draw_rect2](#ggggdraw_rect)
- [gg.post_empty_event](#ggpost_empty_event)
- [gg.circle](#ggcircle)
- [gg.&GG.create_image](#ggggcreate_image)
- [gg.create_image](#ggcreate_image)
- [gg.create_image_from_memory](#ggcreate_image_from_memory)
- [gg.&GG.draw_line](#ggggdraw_line)
- [gg.&GG.draw_arc](#ggggdraw_arc)
- [gg.&GG.draw_filled_arc](#ggggdraw_filled_arc)
- [gg.&GG.draw_circle](#ggggdraw_circle)
- [gg.&GG.draw_rounded_rect](#ggggdraw_rounded_rect)
- [gg.&GG.draw_empty_rounded_rect](#ggggdraw_empty_rounded_rect)
- [gg.&GG.draw_image](#ggggdraw_image)
- [gg.&GG.draw_empty_rect](#ggggdraw_empty_rect)
- [gg.scissor](#ggscissor)

## Documentation
### gg.Vec2
```v
 struct Vec2 {
    x   int
    y   int
}
```
### gg.str
```v
fn (v Vec2) str() string
```
### gg.vec2
```v
fn vec2(x, y int) Vec2
```
### gg.init_gg
```v
fn init_gg() void
```
### gg.Cfg
```v
 struct Cfg {
    width   int
    height   int
    use_ortho   bool
    retina   bool
    resizable   bool
    decorated   bool
    font_size   int
    font_path   string
    create_window   bool
    window_user_ptr   voidptr
    window_title   string
    always_on_top   bool
    scale   int
}
```
### gg.GG
```v
 struct GG {
    shader   gl.Shader
    vao   u32
    rect_vao   u32
    rect_vbo   u32
    line_vao   u32
    line_vbo   u32
    vbo   u32
    scale   int
    width   int
    height   int
    window   &glfw.Window
    render_fn   fn()
}
```
### gg.new_context
```v
fn new_context(cfg Cfg) &GG
```
fn new_context(width, height int, use_ortho bool, font_size int) *GG {

### gg.clear
```v
fn clear(color gx.Color) void
```
pub fn (gg &GG) render_loop() bool { 
for !gg.window.show_close() { 
gg.render_fn() 
gg.window.swap_buffers() 
glfw.wait_events() 
} 
}

### gg.&GG.render
```v
fn (gg &GG) render() void
```
### gg.&GG.draw_triangle
```v
fn (ctx &GG) draw_triangle(x1, y1, x2, y2, x3, y3 f32, c gx.Color) void
```
### gg.&GG.draw_triangle_tex
```v
fn (ctx &GG) draw_triangle_tex(x1, y1, x2, y2, x3, y3 f32, c gx.Color) void
```
### gg.&GG.draw_rect
```v
fn (ctx &GG) draw_rect(x, y, w, h f32, c gx.Color) void
```
### gg.set_mode_wireframe
```v
fn set_mode_wireframe() void
```
Useful for debugging meshes.

### gg.set_mode_point
```v
fn set_mode_point() void
```
### gg.set_mode_fill
```v
fn set_mode_fill() void
```
### gg.&GG.draw_rect2
```v
fn (ctx &GG) draw_rect2(x, y, w, h f32, c gx.Color) void
```
fn (ctx mut GG) init_rect_vao() { 
 
ctx.rect_vao = gl.gen_vertex_array() 
ctx.rect_vbo = gl.gen_buffer() 
vertices := [ 
x + w, y, 0, 
x + w, y + h, 0, 
x, y + h, 0, 
x, y, 0, 
] ! 
indices := [ 
0, 1, 3,// first triangle 
1, 2, 3// second triangle 
] ! 
gl.bind_vao(ctx.rect_vao) 
gl.set_vbo(ctx.rect_vbo, vertices, C.GL_STATIC_DRAW) 
ebo := gl.gen_buffer() 
/////// 
gl.set_ebo(ebo, indices, C.GL_STATIC_DRAW) 
}

### gg.post_empty_event
```v
fn post_empty_event() void
```
### gg.circle
```v
fn (c GG) circle(x, y, r int) void
```
### gg.&GG.create_image
```v
fn (ctx &GG) create_image(file string) u32
```
### gg.create_image
```v
fn create_image(file string) u32
```
### gg.create_image_from_memory
```v
fn create_image_from_memory(buf byteptr) u32
```
### gg.&GG.draw_line
```v
fn (ctx &GG) draw_line(x, y, x2, y2 f32, color gx.Color) void
```
### gg.&GG.draw_arc
```v
fn (ctx &GG) draw_arc(x, y, r, start_angle, end_angle f32, segments int, color gx.Color) void
```
### gg.&GG.draw_filled_arc
```v
fn (ctx &GG) draw_filled_arc(x, y, r, start_angle, end_angle f32, segments int, color gx.Color) void
```
### gg.&GG.draw_circle
```v
fn (ctx &GG) draw_circle(x, y, r f32, color gx.Color) void
```
### gg.&GG.draw_rounded_rect
```v
fn (ctx &GG) draw_rounded_rect(x, y, w, h, r f32, color gx.Color) void
```
### gg.&GG.draw_empty_rounded_rect
```v
fn (ctx &GG) draw_empty_rounded_rect(x, y, w, h, r f32, color gx.Color) void
```
### gg.&GG.draw_image
```v
fn (ctx &GG) draw_image(x, y, w, h f32, tex_id u32) void
```
pub fn (c &GG) draw_gray_line(x, y, x2, y2 f32) { 
c.draw_line(x, y, x2, y2, gx.Gray) 
} 
 
pub fn (c &GG) draw_vertical(x, y, height int) { 
c.draw_line(x, y, x, y + height) 
} 
 
tx.gg.draw_line(center + prev_x, center+prev_y, center + x*10.0, center+y) 
fn (ctx &GG) draw_image(x, y, w, h f32, img stbi.Image) {

### gg.&GG.draw_empty_rect
```v
fn (c &GG) draw_empty_rect(x, y, w, h f32, color gx.Color) void
```
### gg.scissor
```v
fn scissor(x, y, w, h f32) void
```