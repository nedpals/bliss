# readline.v
- readline_windows.v
- readline.v
## Contents
- [readline.Termios](#readline.Termios)
- [readline.Winsize](#readline.Winsize)
- [readline.Readline](#readline.Readline)

## Documentation
### readline.Termios
```v
struct Termios {
    c_iflag  int
    c_oflag  int
    c_cflag  int
    c_lflag  int
    c_cc  [12]int
}
```
Linux 
Used to change the terminal options

### readline.Winsize
```v
struct Winsize {
    ws_row  u16
    ws_col  u16
    ws_xpixel  u16
    ws_ypixel  u16
}
```
Linux 
Used to collect the screen information

### readline.Readline
```v
struct Readline {
    is_raw  bool
    orig_termios  Termios
    current  ustring
    cursor  int
    overwrite  bool
    cursor_row_offset  int
    prompt  string
    prompt_offset  int
    previous_lines  []ustring
    search_index  int
    is_tty  bool
}
```