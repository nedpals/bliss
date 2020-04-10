# gx module
- gx.v
## Contents
- [gx.Color](#gxcolor)
- [gx.Blue](#gxblue)
- [gx.blue](#gxblue)
- [gx.Red](#gxred)
- [gx.red](#gxred)
- [gx.Green](#gxgreen)
- [gx.green](#gxgreen)
- [gx.Yellow](#gxyellow)
- [gx.Orange](#gxorange)
- [gx.orange](#gxorange)
- [gx.Purple](#gxpurple)
- [gx.Black](#gxblack)
- [gx.black](#gxblack)
- [gx.Gray](#gxgray)
- [gx.gray](#gxgray)
- [gx.Indigo](#gxindigo)
- [gx.Pink](#gxpink)
- [gx.Violet](#gxviolet)
- [gx.White](#gxwhite)
- [gx.white](#gxwhite)
- [gx.DarkBlue](#gxdarkblue)
- [gx.DarkGray](#gxdarkgray)
- [gx.dark_gray](#gxdark_gray)
- [gx.DarkGreen](#gxdarkgreen)
- [gx.DarkRed](#gxdarkred)
- [gx.LightBlue](#gxlightblue)
- [gx.light_blue](#gxlight_blue)
- [gx.LightGray](#gxlightgray)
- [gx.LightGreen](#gxlightgreen)
- [gx.LightRed](#gxlightred)
- [gx.ALIGN_LEFT](#gxalign_left)
- [gx.ALIGN_RIGHT](#gxalign_right)
- [gx.TextCfg](#gxtextcfg)
- [gx.Image](#gximage)
- [gx.is_empty](#gxis_empty)
- [gx.str](#gxstr)
- [gx.eq](#gxeq)
- [gx.rgb](#gxrgb)
- [gx.hex](#gxhex)

## Documentation
### gx.Color
```v
 struct Color {
    r   int
    g   int
    b   int
}
```
### gx.Blue
```v

```
### gx.blue
```v

```
### gx.Red
```v

```
### gx.red
```v

```
### gx.Green
```v

```
### gx.green
```v

```
### gx.Yellow
```v

```
### gx.Orange
```v

```
### gx.orange
```v

```
### gx.Purple
```v

```
### gx.Black
```v

```
### gx.black
```v

```
### gx.Gray
```v

```
### gx.gray
```v

```
### gx.Indigo
```v

```
### gx.Pink
```v

```
### gx.Violet
```v

```
### gx.White
```v

```
### gx.white
```v

```
### gx.DarkBlue
```v

```
### gx.DarkGray
```v

```
### gx.dark_gray
```v

```
### gx.DarkGreen
```v

```
### gx.DarkRed
```v

```
### gx.LightBlue
```v

```
### gx.light_blue
```v

```
### gx.LightGray
```v

```
### gx.LightGreen
```v

```
### gx.LightRed
```v

```
### gx.ALIGN_LEFT
```v

```
### gx.ALIGN_RIGHT
```v

```
### gx.TextCfg
```v
 struct TextCfg {
    color   Color
    size   int
    align   int
    max_width   int
    family   string
    bold   bool
    mono   bool
}
```
### gx.Image
```v
 struct Image {
    obj   voidptr
    id   int
    width   int
    height   int
}
```
### gx.is_empty
```v
fn (img Image) is_empty() bool
```
### gx.str
```v
fn (c Color) str() string
```
### gx.eq
```v
fn (a Color) eq(b Color) bool
```
### gx.rgb
```v
fn rgb(r, g, b int) Color
```
### gx.hex
```v
fn hex(color int) Color
```