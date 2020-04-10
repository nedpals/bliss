# freetype module
- freetype.v
## Contents
- [freetype.default_font_size](#freetypedefault_font_size)
- [freetype.FreeType](#freetypefreetype)
- [freetype.new_context](#freetypenew_context)
- [freetype.draw_text](#freetypedraw_text)
- [freetype.draw_text_def](#freetypedraw_text_def)
- [freetype.text_width](#freetypetext_width)
- [freetype.text_height](#freetypetext_height)
- [freetype.text_size](#freetypetext_size)
- [freetype.FT_Face.str](#freetypeft_facestr)
- [freetype.[]Character.str](#freetypecharacterstr)

## Documentation
### freetype.default_font_size
```v

```
### freetype.FreeType
```v
 struct FreeType {
    shader   gl.Shader
    width   int
    height   int
    vao   u32
    rect_vao   u32
    rect_vbo   u32
    line_vao   u32
    line_vbo   u32
    vbo   u32
    chars   []Character
    face   C.FT_Face
    scale   int
    utf_runes   []string
    utf_chars   []Character
}
```
### freetype.new_context
```v
fn new_context(cfg gg.Cfg) &FreeType
```
### freetype.draw_text
```v
fn (ctx mut FreeType) draw_text(_x, _y int, text string, cfg gx.TextCfg) void
```
### freetype.draw_text_def
```v
fn (ctx mut FreeType) draw_text_def(x, y int, text string) void
```
### freetype.text_width
```v
fn (ctx mut FreeType) text_width(s string) int
```
### freetype.text_height
```v
fn (ctx mut FreeType) text_height(s string) int
```
### freetype.text_size
```v
fn (ctx mut FreeType) text_size(s string) (int, int)
```
### freetype.FT_Face.str
```v
fn (f FT_Face) str() string
```
### freetype.[]Character.str
```v
fn (ac []Character) str() string
```