# math module
- bits.v
- const.v
- math.v
- unsafe.v
## Contents
- [math.inf](#mathinf)
- [math.nan](#mathnan)
- [math.is_nan](#mathis_nan)
- [math.is_inf](#mathis_inf)

## Documentation
### math.inf
```v
fn inf(sign int) f64
```
inf returns positive infinity if sign >= 0, negative infinity if sign < 0.

### math.nan
```v
fn nan() f64
```
nan returns an IEEE 754 ``not-a-number'' value.

### math.is_nan
```v
fn is_nan(f f64) bool
```
is_nan reports whether f is an IEEE 754 ``not-a-number'' value.

### math.is_inf
```v
fn is_inf(f f64, sign int) bool
```
is_inf reports whether f is an infinity, according to sign. 
If sign > 0, is_inf reports whether f is positive infinity. 
If sign < 0, is_inf reports whether f is negative infinity. 
If sign == 0, is_inf reports whether f is either infinity.
