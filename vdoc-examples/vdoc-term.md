# term module
- colors.v
- control.v
- term_nix.v
- term_windows.v
- term.v
## Contents
- [term.format](#termformat)
- [term.format_rgb](#termformat_rgb)
- [term.rgb](#termrgb)
- [term.bg_rgb](#termbg_rgb)
- [term.hex](#termhex)
- [term.bg_hex](#termbg_hex)
- [term.bg_black](#termbg_black)
- [term.bright_bg_black](#termbright_bg_black)
- [term.bg_blue](#termbg_blue)
- [term.bright_bg_blue](#termbright_bg_blue)
- [term.bg_cyan](#termbg_cyan)
- [term.bright_bg_cyan](#termbright_bg_cyan)
- [term.bg_green](#termbg_green)
- [term.bright_bg_green](#termbright_bg_green)
- [term.bg_magenta](#termbg_magenta)
- [term.bright_bg_magenta](#termbright_bg_magenta)
- [term.bg_red](#termbg_red)
- [term.bright_bg_red](#termbright_bg_red)
- [term.bg_white](#termbg_white)
- [term.bright_bg_white](#termbright_bg_white)
- [term.bg_yellow](#termbg_yellow)
- [term.bright_bg_yellow](#termbright_bg_yellow)
- [term.black](#termblack)
- [term.bright_black](#termbright_black)
- [term.blue](#termblue)
- [term.bright_blue](#termbright_blue)
- [term.bold](#termbold)
- [term.cyan](#termcyan)
- [term.bright_cyan](#termbright_cyan)
- [term.dim](#termdim)
- [term.green](#termgreen)
- [term.bright_green](#termbright_green)
- [term.gray](#termgray)
- [term.hidden](#termhidden)
- [term.italic](#termitalic)
- [term.inverse](#terminverse)
- [term.magenta](#termmagenta)
- [term.bright_magenta](#termbright_magenta)
- [term.reset](#termreset)
- [term.red](#termred)
- [term.bright_red](#termbright_red)
- [term.strikethrough](#termstrikethrough)
- [term.underline](#termunderline)
- [term.white](#termwhite)
- [term.bright_white](#termbright_white)
- [term.yellow](#termyellow)
- [term.bright_yellow](#termbright_yellow)

## Documentation
### term.format
```v
fn format(msg, open, close string) string
```
### term.format_rgb
```v
fn format_rgb(r, g, b int, msg, open, close string) string
```
### term.rgb
```v
fn rgb(r, g, b int, msg string) string
```
### term.bg_rgb
```v
fn bg_rgb(r, g, b int, msg string) string
```
### term.hex
```v
fn hex(hex int, msg string) string
```
### term.bg_hex
```v
fn bg_hex(hex int, msg string) string
```
### term.bg_black
```v
fn bg_black(msg string) string
```
### term.bright_bg_black
```v
fn bright_bg_black(msg string) string
```
### term.bg_blue
```v
fn bg_blue(msg string) string
```
### term.bright_bg_blue
```v
fn bright_bg_blue(msg string) string
```
### term.bg_cyan
```v
fn bg_cyan(msg string) string
```
### term.bright_bg_cyan
```v
fn bright_bg_cyan(msg string) string
```
### term.bg_green
```v
fn bg_green(msg string) string
```
### term.bright_bg_green
```v
fn bright_bg_green(msg string) string
```
### term.bg_magenta
```v
fn bg_magenta(msg string) string
```
### term.bright_bg_magenta
```v
fn bright_bg_magenta(msg string) string
```
### term.bg_red
```v
fn bg_red(msg string) string
```
### term.bright_bg_red
```v
fn bright_bg_red(msg string) string
```
### term.bg_white
```v
fn bg_white(msg string) string
```
### term.bright_bg_white
```v
fn bright_bg_white(msg string) string
```
### term.bg_yellow
```v
fn bg_yellow(msg string) string
```
### term.bright_bg_yellow
```v
fn bright_bg_yellow(msg string) string
```
### term.black
```v
fn black(msg string) string
```
### term.bright_black
```v
fn bright_black(msg string) string
```
### term.blue
```v
fn blue(msg string) string
```
### term.bright_blue
```v
fn bright_blue(msg string) string
```
### term.bold
```v
fn bold(msg string) string
```
### term.cyan
```v
fn cyan(msg string) string
```
### term.bright_cyan
```v
fn bright_cyan(msg string) string
```
### term.dim
```v
fn dim(msg string) string
```
### term.green
```v
fn green(msg string) string
```
### term.bright_green
```v
fn bright_green(msg string) string
```
### term.gray
```v
fn gray(msg string) string
```
### term.hidden
```v
fn hidden(msg string) string
```
### term.italic
```v
fn italic(msg string) string
```
### term.inverse
```v
fn inverse(msg string) string
```
### term.magenta
```v
fn magenta(msg string) string
```
### term.bright_magenta
```v
fn bright_magenta(msg string) string
```
### term.reset
```v
fn reset(msg string) string
```
### term.red
```v
fn red(msg string) string
```
### term.bright_red
```v
fn bright_red(msg string) string
```
### term.strikethrough
```v
fn strikethrough(msg string) string
```
### term.underline
```v
fn underline(msg string) string
```
### term.white
```v
fn white(msg string) string
```
### term.bright_white
```v
fn bright_white(msg string) string
```
### term.yellow
```v
fn yellow(msg string) string
```
### term.bright_yellow
```v
fn bright_yellow(msg string) string
```