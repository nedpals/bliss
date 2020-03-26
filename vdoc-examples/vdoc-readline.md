# readline module
- readline_windows.v
- readline.v
## Contents
- [readline.Readline](#readlinereadline)

## Documentation
### readline.Readline
```v
pub  struct Readline {
    is_raw   bool
    orig_termios   Termios
    current   ustring
    cursor   int
    overwrite   bool
    cursor_row_offset   int
    prompt   string
    prompt_offset   int
    previous_lines   []ustring
    search_index   int
    is_tty   bool
}
```