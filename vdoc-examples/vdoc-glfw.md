# glfw module
- glfw.v
## Contents
- [glfw.RESIZABLE](#glfwresizable)
- [glfw.DECORATED](#glfwdecorated)
- [glfw.KEY_ESCAPE](#glfwkey_escape)
- [glfw.key_space](#glfwkey_space)
- [glfw.KEY_LEFT_SUPER](#glfwkey_left_super)
- [glfw.KeyUp](#glfwkeyup)
- [glfw.KeyLeft](#glfwkeyleft)
- [glfw.KeyRight](#glfwkeyright)
- [glfw.KeyDown](#glfwkeydown)
- [glfw.WinCfg](#glfwwincfg)
- [glfw.Window](#glfwwindow)
- [glfw.Size](#glfwsize)
- [glfw.Pos](#glfwpos)
- [glfw.init_glfw](#glfwinit_glfw)
- [glfw.&glfw.Window.destroy](#glfwglfwwindowdestroy)
- [glfw.terminate](#glfwterminate)
- [glfw.mouse_move](#glfwmouse_move)
- [glfw.window_hint](#glfwwindow_hint)
- [glfw.create_window](#glfwcreate_window)
- [glfw.&glfw.Window.set_title](#glfwglfwwindowset_title)
- [glfw.&glfw.Window.make_context_current](#glfwglfwwindowmake_context_current)
- [glfw.&glfw.Window.scale](#glfwglfwwindowscale)
- [glfw.swap_interval](#glfwswap_interval)
- [glfw.wait_events](#glfwwait_events)
- [glfw.poll_events](#glfwpoll_events)
- [glfw.set_should_close](#glfwset_should_close)
- [glfw.&glfw.Window.set_should_close](#glfwglfwwindowset_should_close)
- [glfw.&glfw.Window.should_close](#glfwglfwwindowshould_close)
- [glfw.&glfw.Window.swap_buffers](#glfwglfwwindowswap_buffers)
- [glfw.glfw.Window.onmousemove](#glfwglfwwindowonmousemove)
- [glfw.glfw.Window.set_mouse_button_callback](#glfwglfwwindowset_mouse_button_callback)
- [glfw.glfw.Window.on_resize](#glfwglfwwindowon_resize)
- [glfw.glfw.Window.on_click](#glfwglfwwindowon_click)
- [glfw.&glfw.Window.set_scroll_callback](#glfwglfwwindowset_scroll_callback)
- [glfw.&glfw.Window.on_scroll](#glfwglfwwindowon_scroll)
- [glfw.post_empty_event](#glfwpost_empty_event)
- [glfw.glfw.Window.onkeydown](#glfwglfwwindowonkeydown)
- [glfw.glfw.Window.onchar](#glfwglfwwindowonchar)
- [glfw.get_time](#glfwget_time)
- [glfw.key_pressed](#glfwkey_pressed)
- [glfw.&glfw.Window.get_clipboard_text](#glfwglfwwindowget_clipboard_text)
- [glfw.&glfw.Window.set_clipboard_text](#glfwglfwwindowset_clipboard_text)
- [glfw.get_cursor_pos](#glfwget_cursor_pos)
- [glfw.&glfw.Window.get_cursor_pos](#glfwglfwwindowget_cursor_pos)
- [glfw.set_cursor](#glfwset_cursor)
- [glfw.&glfw.Window.set_cursor](#glfwglfwwindowset_cursor)
- [glfw.&glfw.Window.user_ptr](#glfwglfwwindowuser_ptr)
- [glfw.&glfw.Window.set_user_ptr](#glfwglfwwindowset_user_ptr)
- [glfw.get_monitor_size](#glfwget_monitor_size)
- [glfw.&glfw.Window.get_window_size](#glfwglfwwindowget_window_size)
- [glfw.&glfw.Window.get_framebuffer_size](#glfwglfwwindowget_framebuffer_size)
- [glfw.str](#glfwstr)
- [glfw.get_window_user_pointer](#glfwget_window_user_pointer)

## Documentation
### glfw.RESIZABLE
```v

```
#flag darwin -framework Carbon 
#flag darwin -framework Cocoa 
#flag darwin -framework CoreVideo 
#flag darwin -framework IOKit

### glfw.DECORATED
```v

```
#flag darwin -framework Carbon 
#flag darwin -framework Cocoa 
#flag darwin -framework CoreVideo 
#flag darwin -framework IOKit

### glfw.KEY_ESCAPE
```v

```
### glfw.key_space
```v

```
### glfw.KEY_LEFT_SUPER
```v

```
### glfw.KeyUp
```v

```
### glfw.KeyLeft
```v

```
### glfw.KeyRight
```v

```
### glfw.KeyDown
```v

```
### glfw.WinCfg
```v
 struct WinCfg {
    width   int
    height   int
    title   string
    ptr   voidptr
    borderless   bool
    is_modal   int
    is_browser   bool
    url   string
    always_on_top   bool
    scale_to_monitor   bool
}
```
### glfw.Window
```v
 struct Window {
    data   voidptr
    title   string
    mx   int
    my   int
    scale_   f32
}
```
data  *C.GLFWwindow 
TODO change data to cobj

### glfw.Size
```v
 struct Size {
    width   int
    height   int
}
```
### glfw.Pos
```v
 struct Pos {
    x   int
    y   int
}
```
### glfw.init_glfw
```v
fn init_glfw() void
```
TODO broken 
fn init() { 
init_glfw() 
}

### glfw.&glfw.Window.destroy
```v
fn (w &glfw.Window) destroy() void
```
### glfw.terminate
```v
fn terminate() void
```
### glfw.mouse_move
```v
fn mouse_move(w voidptr, x, y f64) void
```
pub fn mouse_move(w * GLFWwindow, x, y double) {

### glfw.window_hint
```v
fn window_hint(key, val int) void
```
### glfw.create_window
```v
fn create_window(c WinCfg) &glfw.Window
```
### glfw.&glfw.Window.set_title
```v
fn (w &glfw.Window) set_title(title string) void
```
### glfw.&glfw.Window.make_context_current
```v
fn (w &glfw.Window) make_context_current() void
```
### glfw.&glfw.Window.scale
```v
fn (w &glfw.Window) scale() f32
```
### glfw.swap_interval
```v
fn swap_interval(interval int) void
```
### glfw.wait_events
```v
fn wait_events() void
```
### glfw.poll_events
```v
fn poll_events() void
```
### glfw.set_should_close
```v
fn set_should_close(w voidptr, close bool) void
```
### glfw.&glfw.Window.set_should_close
```v
fn (w &glfw.Window) set_should_close(close bool) void
```
### glfw.&glfw.Window.should_close
```v
fn (w &glfw.Window) should_close() bool
```
### glfw.&glfw.Window.swap_buffers
```v
fn (w &glfw.Window) swap_buffers() void
```
### glfw.glfw.Window.onmousemove
```v
fn (w mut glfw.Window) onmousemove(cb voidptr) void
```
### glfw.glfw.Window.set_mouse_button_callback
```v
fn (w mut glfw.Window) set_mouse_button_callback(cb voidptr) void
```
### glfw.glfw.Window.on_resize
```v
fn (w mut glfw.Window) on_resize(cb voidptr) void
```
### glfw.glfw.Window.on_click
```v
fn (w mut glfw.Window) on_click(cb voidptr) void
```
### glfw.&glfw.Window.set_scroll_callback
```v
fn (w &glfw.Window) set_scroll_callback(cb voidptr) void
```
### glfw.&glfw.Window.on_scroll
```v
fn (w &glfw.Window) on_scroll(cb voidptr) void
```
### glfw.post_empty_event
```v
fn post_empty_event() void
```
### glfw.glfw.Window.onkeydown
```v
fn (w mut glfw.Window) onkeydown(cb voidptr) void
```
### glfw.glfw.Window.onchar
```v
fn (w mut glfw.Window) onchar(cb voidptr) void
```
### glfw.get_time
```v
fn get_time() f64
```
### glfw.key_pressed
```v
fn key_pressed(wnd voidptr, key int) bool
```
### glfw.&glfw.Window.get_clipboard_text
```v
fn (w &glfw.Window) get_clipboard_text() string
```
### glfw.&glfw.Window.set_clipboard_text
```v
fn (w &glfw.Window) set_clipboard_text(s string) void
```
### glfw.get_cursor_pos
```v
fn get_cursor_pos(cwindow voidptr) (f64, f64)
```
### glfw.&glfw.Window.get_cursor_pos
```v
fn (w &glfw.Window) get_cursor_pos() Pos
```
### glfw.set_cursor
```v
fn set_cursor(c Cursor) void
```
### glfw.&glfw.Window.set_cursor
```v
fn (w &glfw.Window) set_cursor(c Cursor) void
```
### glfw.&glfw.Window.user_ptr
```v
fn (w &glfw.Window) user_ptr() voidptr
```
### glfw.&glfw.Window.set_user_ptr
```v
fn (w &glfw.Window) set_user_ptr(ptr voidptr) void
```
### glfw.get_monitor_size
```v
fn get_monitor_size() Size
```
### glfw.&glfw.Window.get_window_size
```v
fn (w &glfw.Window) get_window_size() Size
```
get_window_size in screen coordinates

### glfw.&glfw.Window.get_framebuffer_size
```v
fn (w &glfw.Window) get_framebuffer_size() Size
```
get_framebuffer_size in pixels

### glfw.str
```v
fn (size Size) str() string
```
### glfw.get_window_user_pointer
```v
fn get_window_user_pointer(gwnd voidptr) voidptr
```