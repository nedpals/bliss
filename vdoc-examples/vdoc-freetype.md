# freetype module
- freetype.v
## Contents
- [freetype.default_font_size](#freetypedefault_font_size)
- [freetype.FreeType](#freetypefreetype)
- [freetype.new_context](#freetypenew_context)
- [freetype.FreeType.draw_text](#freetypefreetypedraw_text)
- [freetype.FreeType.draw_text_def](#freetypefreetypedraw_text_def)
- [freetype.FreeType.text_width](#freetypefreetypetext_width)
- [freetype.FreeType.text_height](#freetypefreetypetext_height)
- [freetype.FreeType.text_size](#freetypefreetypetext_size)
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
### freetype.FreeType.draw_text
```v
fn (ctx mut FreeType) draw_text(_x, _y int, text string, cfg gx.TextCfg) void
```
### freetype.FreeType.draw_text_def
```v
fn (ctx mut FreeType) draw_text_def(x, y int, text string) void
```
### freetype.FreeType.text_width
```v
fn (ctx mut FreeType) text_width(s string) int
```
### freetype.FreeType.text_height
```v
fn (ctx mut FreeType) text_height(s string) int
```
### freetype.FreeType.text_size
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