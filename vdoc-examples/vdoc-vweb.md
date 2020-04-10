# vweb module
- vweb.v
## Contents
- [vweb.methods_with_form](#vwebmethods_with_form)
- [vweb.method_all](#vwebmethod_all)
- [vweb.HEADER_SERVER](#vwebheader_server)
- [vweb.HEADER_CONNECTION_CLOSE](#vwebheader_connection_close)
- [vweb.HEADERS_CLOSE](#vwebheaders_close)
- [vweb.HTTP_404](#vwebhttp_)
- [vweb.HTTP_500](#vwebhttp_)
- [vweb.mime_types](#vwebmime_types)
- [vweb.MAX_HTTP_POST_SIZE](#vwebmax_http_post_size)
- [vweb.Default_Port](#vwebdefault_port)
- [vweb.Context](#vwebcontext)
- [vweb.html](#vwebhtml)
- [vweb.text](#vwebtext)
- [vweb.json](#vwebjson)
- [vweb.redirect](#vwebredirect)
- [vweb.not_found](#vwebnot_found)
- [vweb.set_cookie](#vwebset_cookie)
- [vweb.&Context.get_cookie](#vwebcontextget_cookie)
- [vweb.add_header](#vwebadd_header)
- [vweb.&Context.get_header](#vwebcontextget_header)
- [vweb.foo<T>](#vwebfoot)
- [vweb.run<T>](#vwebrunt)

## Documentation
### vweb.methods_with_form
```v

```
### vweb.method_all
```v

```
### vweb.HEADER_SERVER
```v

```
### vweb.HEADER_CONNECTION_CLOSE
```v

```
### vweb.HEADERS_CLOSE
```v

```
### vweb.HTTP_404
```v

```
### vweb.HTTP_500
```v

```
### vweb.mime_types
```v

```
### vweb.MAX_HTTP_POST_SIZE
```v

```
### vweb.Default_Port
```v

```
### vweb.Context
```v
 struct Context {
    static_files   map[string]string
    static_mime_types   map[string]string
    req   http.Request
    conn   net.Socket
    form   map[string]string
    headers   string
    done   bool
}
```
### vweb.html
```v
fn (ctx mut Context) html(s string) void
```
### vweb.text
```v
fn (ctx mut Context) text(s string) void
```
### vweb.json
```v
fn (ctx mut Context) json(s string) void
```
### vweb.redirect
```v
fn (ctx mut Context) redirect(url string) void
```
### vweb.not_found
```v
fn (ctx mut Context) not_found(s string) void
```
### vweb.set_cookie
```v
fn (ctx mut Context) set_cookie(key, val string) void
```
### vweb.&Context.get_cookie
```v
fn (ctx &Context) get_cookie(key string) ?string
```
### vweb.add_header
```v
fn (ctx mut Context) add_header(key, val string) void
```
### vweb.&Context.get_header
```v
fn (ctx &Context) get_header(key string) string
```
### vweb.foo<T>
```v
fn foo<T>() void
```
n handle_conn(conn net.Socket) { 
rintln('handle')

### vweb.run<T>
```v
fn run<T>(port int) void
```