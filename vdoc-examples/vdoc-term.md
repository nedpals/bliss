# term.v
- colors.v
- control.v
- term_nix.v
- term_windows.v
- term.v
## Contents
- [term.can_show_color_on_stdout](#termcan_show_color_on_stdout)
- [term.can_show_color_on_stderr](#termcan_show_color_on_stderr)
- [term.ok_message](#termok_message)
- [term.fail_message](#termfail_message)
- [term.h_divider](#termh_divider)
- [term.header](#termheader)
- [term.supports_escape_sequences](#termsupports_escape_sequences)

## Documentation
### term.can_show_color_on_stdout
```v
pub fn can_show_color_on_stdout() bool
```
can_show_color_on_stdout returns true if colors are allowed in stdout; 
returns false otherwise.

### term.can_show_color_on_stderr
```v
pub fn can_show_color_on_stderr() bool
```
can_show_color_on_stderr returns true if colors are allowed in stderr; 
returns false otherwise.

### term.ok_message
```v
pub fn ok_message(s string) string
```
ok_message returns a colored string with green color. 
If colors are not allowed, returns a given string.

### term.fail_message
```v
pub fn fail_message(s string) string
```
fail_message returns a colored string with red color. 
If colors are not allowed, returns a given string.

### term.h_divider
```v
pub fn h_divider(divider string) string
```
h_divider returns a horizontal divider line with a dynamic width, 
that depends on the current terminal settings.

### term.header
```v
pub fn header(text, divider string) string
```
header returns a horizontal divider line with a centered text in the middle. 
e.g: term.header('TEXT', '=') 
=============== TEXT ===============

### term.supports_escape_sequences
```v
fn supports_escape_sequences(fd int) bool
```