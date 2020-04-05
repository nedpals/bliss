# clipboard module
- clipboard_windows.v
- clipboard.v
## Contents
- [clipboard.Clipboard](#clipboardclipboard)
- [clipboard.new_primary](#clipboardnew_primary)

## Documentation
### clipboard.Clipboard
```v
 struct Clipboard {
    max_retries   int
    retry_delay   int
    hwnd   HWND
    foo   int
}
```
### clipboard.new_primary
```v
fn new_primary() &Clipboard
```