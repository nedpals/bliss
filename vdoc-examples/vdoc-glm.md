# glm module
- glm.v
## Contents
- [glm.Mat4](#glmmat)
- [glm.vec3](#glmvec)
- [glm.Vec3.str](#glmvecstr)
- [glm.Vec2.str](#glmvecstr)
- [glm.Mat4.str](#glmmatstr)
- [glm.translate](#glmtranslate)
- [glm.ortho](#glmortho)
- [glm.scale](#glmscale)
- [glm.rotate_z](#glmrotate_z)
- [glm.identity](#glmidentity)
- [glm.identity2](#glmidentity)
- [glm.identity3](#glmidentity)

## Documentation
### glm.Mat4
```v
 struct Mat4 {
    data   &f32
}
```
#flag -lmyglm 
# f32* myglm_ortho(f32, f32, f32, f32); 
# f32* myglm_translate(f32, f32, f32); 
 
# f32* myglm_rotate(f32 *m, f32 angle, f32, f32, f32); 
# f32* myglm_perspective(f32, f32, f32, f32); 
# f32* myglm_look_at(glm__Vec3, glm__Vec3, glm__Vec3); 
# glm__Vec3 myglm_mult(glm__Vec3, glm__Vec3); 
# glm__Vec3 myglm_cross(glm__Vec3, glm__Vec3); 
# glm__Vec3 myglm_normalize(glm__Vec3);

### glm.vec3
```v
fn vec3(x, y, z f32) Vec3
```
### glm.Vec3.str
```v
fn (v Vec3) str() string
```
### glm.Vec2.str
```v
fn (v Vec2) str() string
```
### glm.Mat4.str
```v
fn (m Mat4) str() string
```
### glm.translate
```v
fn translate(m Mat4, v Vec3) Mat4
```
fn translate(vec Vec3) *f32 {

### glm.ortho
```v
fn ortho(left, right, bottom, top f32) Mat4
```
fn normalize(vec Vec3) Vec3 { 
# return myglm_normalize(vec); 
return Vec3{} 
} 
 
https://github.com/g-truc/glm/blob/0ceb2b755fb155d593854aefe3e45d416ce153a4/glm/ext/matrix_clip_space.inl

### glm.scale
```v
fn scale(m Mat4, v Vec3) Mat4
```
fn scale(a *f32, v Vec3) *f32 {

### glm.rotate_z
```v
fn rotate_z(m Mat4, rad f32) Mat4
```
fn rotate_z(a *f32, rad f32) *f32 {

### glm.identity
```v
fn identity() Mat4
```
### glm.identity2
```v
fn identity2(res mut &f32) void
```
returns *f32 without allocation

### glm.identity3
```v
fn identity3() []f32
```