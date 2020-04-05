# gg2 module
- gg.v
## Contents
- [gg2.Config](#ggconfig)
- [gg2.GG](#gggg)
- [gg2.new_context](#ggnew_context)
- [gg2.&GG.draw_text](#ggggdraw_text)
- [gg2.&GG.draw_text_def](#ggggdraw_text_def)
- [gg2.GG.init_font](#gggginit_font)
- [gg2.&GG.run](#ggggrun)
- [gg2.&GG.draw_rect](#ggggdraw_rect)
- [gg2.draw_rect](#ggdraw_rect)
- [gg2.&GG.draw_empty_rect](#ggggdraw_empty_rect)
- [gg2.create_image](#ggcreate_image)
- [gg2.create_image_from_memory](#ggcreate_image_from_memory)
- [gg2.&GG.begin](#ggggbegin)
- [gg2.&GG.end](#ggggend)
- [gg2.&GG.draw_line](#ggggdraw_line)
- [gg2.wait_events](#ggwait_events)

## Documentation
### gg2.Config
```v
 struct Config {
    width   int
    height   int
    use_ortho   bool
    retina   bool
    resizable   bool
    user_data   voidptr
    font_size   int
    font_path   string
    create_window   bool
    window_title   string
    always_on_top   bool
    scale   int
    frame_fn   fn(voidptr)
    bg_color   gx.Color
}
```
### gg2.GG
```v
 struct GG {
    scale   int
    width   int
    height   int
    clear_pass   C.sg_pass_action
    window   C.sapp_desc
    render_fn   fn()
    fons   &C.FONScontext
    font_normal   int
}
```
### gg2.new_context
```v
fn new_context(cfg Config) &GG
```
### gg2.&GG.draw_text
```v
fn (gg &GG) draw_text(x, y int, text string, cfg gx.TextCfg) void
```
### gg2.&GG.draw_text_def
```v
fn (ctx &GG) draw_text_def(x, y int, text string) void
```
### gg2.GG.init_font
```v
fn (gg mut GG) init_font() void
```
### gg2.&GG.run
```v
fn (gg &GG) run() void
```
### gg2.&GG.draw_rect
```v
fn (ctx &GG) draw_rect(x, y, w, h f32, c gx.Color) void
```
### gg2.draw_rect
```v
fn draw_rect(x, y, w, h f32, c gx.Color) void
```
### gg2.&GG.draw_empty_rect
```v
fn (gg &GG) draw_empty_rect(x, y, w, h f32, c gx.Color) void
```
### gg2.create_image
```v
fn create_image(file string) u32
```
### gg2.create_image_from_memory
```v
fn create_image_from_memory(buf byteptr) u32
```
### gg2.&GG.begin
```v
fn (gg &GG) begin() void
```
### gg2.&GG.end
```v
fn (gg &GG) end() void
```
### gg2.&GG.draw_line
```v
fn (ctx &GG) draw_line(x, y, x2, y2 f32, color gx.Color) void
```
### gg2.wait_events
```v
fn wait_events() void
```