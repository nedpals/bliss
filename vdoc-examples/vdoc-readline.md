# readline module
- readline_windows.v
- readline.v
## Contents
- [readline.Readline.read_line_utf8](#readlinereadlineread_line_utf)
- [readline.Readline.read_line](#readlinereadlineread_line)
- [readline.read_line_utf8](#readlineread_line_utf)
- [readline.read_line](#readlineread_line)

## Documentation
### readline.Readline.read_line_utf8
```v
fn (r mut Readline) read_line_utf8(prompt string) ?ustring
```
Only use standard os.get_line 
Need implementation for readline capabilities

### readline.Readline.read_line
```v
fn (r mut Readline) read_line(prompt string) ?string
```
Returns the string from the utf8 ustring

### readline.read_line_utf8
```v
fn read_line_utf8(prompt string) ?ustring
```
Standalone function without persistent functionnalities (eg: history) 
Returns utf8 based ustring

### readline.read_line
```v
fn read_line(prompt string) ?string
```
Standalone function without persistent functionnalities (eg: history) 
Return string from utf8 ustring
