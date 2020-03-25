# fontstash.v
- fontstash_funcs.v
- fontstash_structs.v
- fontstash.v
## Contents
- [fontstash.create_internal](#fontstashcreate_internal)
- [fontstash.delete_internal](#fontstashdelete_internal)
- [fontstash.&C.FONScontext.set_error_callback](#fontstashcfonscontextset_error_callback)
- [fontstash.&C.FONScontext.get_atlas_size](#fontstashcfonscontextget_atlas_size)
- [fontstash.&C.FONScontext.expand_atlas](#fontstashcfonscontextexpand_atlas)
- [fontstash.&C.FONScontext.reset_atlas](#fontstashcfonscontextreset_atlas)
- [fontstash.&C.FONScontext.get_font_by_name](#fontstashcfonscontextget_font_by_name)
- [fontstash.&C.FONScontext.add_fallback_font](#fontstashcfonscontextadd_fallback_font)
- [fontstash.&C.FONScontext.add_font_mem](#fontstashcfonscontextadd_font_mem)
- [fontstash.&C.FONScontext.push_state](#fontstashcfonscontextpush_state)
- [fontstash.&C.FONScontext.pop_state](#fontstashcfonscontextpop_state)
- [fontstash.&C.FONScontext.clear_state](#fontstashcfonscontextclear_state)
- [fontstash.&C.FONScontext.set_size](#fontstashcfonscontextset_size)
- [fontstash.&C.FONScontext.set_color](#fontstashcfonscontextset_color)
- [fontstash.&C.FONScontext.set_spacing](#fontstashcfonscontextset_spacing)
- [fontstash.&C.FONScontext.set_blur](#fontstashcfonscontextset_blur)
- [fontstash.&C.FONScontext.set_align](#fontstashcfonscontextset_align)
- [fontstash.&C.FONScontext.set_font](#fontstashcfonscontextset_font)
- [fontstash.&C.FONScontext.draw_text](#fontstashcfonscontextdraw_text)
- [fontstash.&C.FONScontext.text_bounds](#fontstashcfonscontexttext_bounds)
- [fontstash.&C.FONScontext.line_bounds](#fontstashcfonscontextline_bounds)
- [fontstash.&C.FONScontext.vert_metrics](#fontstashcfonscontextvert_metrics)
- [fontstash.&C.FONScontext.text_iter_init](#fontstashcfonscontexttext_iter_init)
- [fontstash.&C.FONScontext.text_iter_next](#fontstashcfonscontexttext_iter_next)
- [fontstash.&C.FONScontext.get_texture_data](#fontstashcfonscontextget_texture_data)
- [fontstash.&C.FONScontext.validate_texture](#fontstashcfonscontextvalidate_texture)
- [fontstash.&C.FONScontext.draw_debug](#fontstashcfonscontextdraw_debug)

## Documentation
### fontstash.create_internal
```v
pub fn create_internal(params &C.FONSparams) &C.FONScontext
```
Contructor and destructor.

### fontstash.delete_internal
```v
pub fn delete_internal(s &C.FONScontext) void
```
### fontstash.&C.FONScontext.set_error_callback
```v
pub fn (s &C.FONScontext) set_error_callback(callback fn(uptr voidptr, error int, val int), uptr voidptr) void
```
### fontstash.&C.FONScontext.get_atlas_size
```v
pub fn (s &C.FONScontext) get_atlas_size(width &int, height &int) void
```
Returns current atlas size.

### fontstash.&C.FONScontext.expand_atlas
```v
pub fn (s &C.FONScontext) expand_atlas(width int, height int) int
```
Expands the atlas size.

### fontstash.&C.FONScontext.reset_atlas
```v
pub fn (s &C.FONScontext) reset_atlas(width int, height int) int
```
Resets the whole stash.

### fontstash.&C.FONScontext.get_font_by_name
```v
pub fn (s &C.FONScontext) get_font_by_name(name byteptr) int
```
Add fonts

### fontstash.&C.FONScontext.add_fallback_font
```v
pub fn (s &C.FONScontext) add_fallback_font(base int, fallback int) int
```
### fontstash.&C.FONScontext.add_font_mem
```v
pub fn (s &C.FONScontext) add_font_mem(name byteptr, data byteptr, data_size int, free_data int) int
```
### fontstash.&C.FONScontext.push_state
```v
pub fn (s &C.FONScontext) push_state() void
```
State handling

### fontstash.&C.FONScontext.pop_state
```v
pub fn (s &C.FONScontext) pop_state() void
```
### fontstash.&C.FONScontext.clear_state
```v
pub fn (s &C.FONScontext) clear_state() void
```
### fontstash.&C.FONScontext.set_size
```v
pub fn (s &C.FONScontext) set_size(size f32) void
```
State setting

### fontstash.&C.FONScontext.set_color
```v
pub fn (s &C.FONScontext) set_color(color u32) void
```
### fontstash.&C.FONScontext.set_spacing
```v
pub fn (s &C.FONScontext) set_spacing(spacing f32) void
```
### fontstash.&C.FONScontext.set_blur
```v
pub fn (s &C.FONScontext) set_blur(blur f32) void
```
### fontstash.&C.FONScontext.set_align
```v
pub fn (s &C.FONScontext) set_align(align int) void
```
### fontstash.&C.FONScontext.set_font
```v
pub fn (s &C.FONScontext) set_font(font int) void
```
### fontstash.&C.FONScontext.draw_text
```v
pub fn (s &C.FONScontext) draw_text(x f32, y f32, str byteptr, end byteptr) f32
```
Draw text

### fontstash.&C.FONScontext.text_bounds
```v
pub fn (s &C.FONScontext) text_bounds(x f32, y f32, str byteptr, end byteptr, bounds &f32) f32
```
Measure text

### fontstash.&C.FONScontext.line_bounds
```v
pub fn (s &C.FONScontext) line_bounds(y f32, miny &f32, maxy &f32) void
```
### fontstash.&C.FONScontext.vert_metrics
```v
pub fn (s &C.FONScontext) vert_metrics(ascender &f32, descender &f32, lineh &f32) void
```
### fontstash.&C.FONScontext.text_iter_init
```v
pub fn (s &C.FONScontext) text_iter_init(iter &C.FONStextIter, x f32, y f32, str byteptr, end byteptr) int
```
Text iterator

### fontstash.&C.FONScontext.text_iter_next
```v
pub fn (s &C.FONScontext) text_iter_next(iter &C.FONStextIter, quad &C.FONSquad) int
```
### fontstash.&C.FONScontext.get_texture_data
```v
pub fn (s &C.FONScontext) get_texture_data(width &int, height &int) byteptr
```
Pull texture changes

### fontstash.&C.FONScontext.validate_texture
```v
pub fn (s &C.FONScontext) validate_texture(dirty &int) int
```
### fontstash.&C.FONScontext.draw_debug
```v
pub fn (s &C.FONScontext) draw_debug(x f32, y f32) void
```
Draws the stash texture for debugging
