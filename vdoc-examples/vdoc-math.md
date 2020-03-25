# math.v
- bits.v
- const.v
- math.v
- unsafe.v
## Contents
- [math.abs](#mathabs)
- [math.acos](#mathacos)
- [math.asin](#mathasin)
- [math.atan](#mathatan)
- [math.atan2](#mathatan)
- [math.cbrt](#mathcbrt)
- [math.ceil](#mathceil)
- [math.cos](#mathcos)
- [math.cosh](#mathcosh)
- [math.degrees](#mathdegrees)
- [math.exp](#mathexp)
- [math.digits](#mathdigits)
- [math.erf](#matherf)
- [math.erfc](#matherfc)
- [math.exp2](#mathexp)
- [math.floor](#mathfloor)
- [math.fmod](#mathfmod)
- [math.gamma](#mathgamma)
- [math.gcd](#mathgcd)
- [math.hypot](#mathhypot)
- [math.lcm](#mathlcm)
- [math.log](#mathlog)
- [math.log2](#mathlog)
- [math.log10](#mathlog)
- [math.log_gamma](#mathlog_gamma)
- [math.log_n](#mathlog_n)
- [math.max](#mathmax)
- [math.min](#mathmin)
- [math.pow](#mathpow)
- [math.radians](#mathradians)
- [math.round](#mathround)
- [math.sin](#mathsin)
- [math.sinh](#mathsinh)
- [math.sqrt](#mathsqrt)
- [math.sqrtf](#mathsqrtf)
- [math.tan](#mathtan)
- [math.tanh](#mathtanh)
- [math.trunc](#mathtrunc)
- [math.aprox_sin](#mathaprox_sin)
- [math.aprox_cos](#mathaprox_cos)

## Documentation
### math.abs
```v
pub fn abs(a f64) f64
```
NOTE 
When adding a new function, please make sure it's in the right place. 
All functions are sorted alphabetically. 
Returns the absolute value.

### math.acos
```v
pub fn acos(a f64) f64
```
acos calculates inverse cosine (arccosine).

### math.asin
```v
pub fn asin(a f64) f64
```
asin calculates inverse sine (arcsine).

### math.atan
```v
pub fn atan(a f64) f64
```
atan calculates inverse tangent (arctangent).

### math.atan2
```v
pub fn atan2(a, b f64) f64
```
atan2 calculates inverse tangent with two arguments, returns the angle between the X axis and the point.

### math.cbrt
```v
pub fn cbrt(a f64) f64
```
cbrt calculates cubic root.

### math.ceil
```v
pub fn ceil(a f64) f64
```
ceil returns the nearest f64 greater or equal to the provided value.

### math.cos
```v
pub fn cos(a f64) f64
```
cos calculates cosine.

### math.cosh
```v
pub fn cosh(a f64) f64
```
cosh calculates hyperbolic cosine.

### math.degrees
```v
pub fn degrees(radians f64) f64
```
degrees convert from degrees to radians.

### math.exp
```v
pub fn exp(a f64) f64
```
exp calculates exponent of the number (math.pow(math.E, a)).

### math.digits
```v
pub fn digits(_n, base int) []int
```
digits returns an array of the digits of n in the given base.

### math.erf
```v
pub fn erf(a f64) f64
```
erf computes the error function value

### math.erfc
```v
pub fn erfc(a f64) f64
```
erfc computes the complementary error function value

### math.exp2
```v
pub fn exp2(a f64) f64
```
exp2 returns the base-2 exponential function of a (math.pow(2, a)).

### math.floor
```v
pub fn floor(a f64) f64
```
floor returns the nearest f64 lower or equal of the provided value.

### math.fmod
```v
pub fn fmod(a, b f64) f64
```
fmod returns the floating-point remainder of number / denom (rounded towards zero):

### math.gamma
```v
pub fn gamma(a f64) f64
```
gamma computes the gamma function value

### math.gcd
```v
pub fn gcd(a_, b_ i64) i64
```
gcd calculates greatest common (positive) divisor (or zero if a and b are both zero).

### math.hypot
```v
pub fn hypot(a, b f64) f64
```
Returns hypotenuse of a right triangle.

### math.lcm
```v
pub fn lcm(a, b i64) i64
```
lcm calculates least common (non-negative) multiple.

### math.log
```v
pub fn log(a f64) f64
```
log calculates natural (base-e) logarithm of the provided value.

### math.log2
```v
pub fn log2(a f64) f64
```
log2 calculates base-2 logarithm of the provided value.

### math.log10
```v
pub fn log10(a f64) f64
```
log10 calculates the common (base-10) logarithm of the provided value.

### math.log_gamma
```v
pub fn log_gamma(a f64) f64
```
log_gamma computes the log-gamma function value

### math.log_n
```v
pub fn log_n(a, b f64) f64
```
log_n calculates base-N logarithm of the provided value.

### math.max
```v
pub fn max(a, b f64) f64
```
max returns the maximum value of the two provided.

### math.min
```v
pub fn min(a, b f64) f64
```
min returns the minimum value of the two provided.

### math.pow
```v
pub fn pow(a, b f64) f64
```
pow returns base raised to the provided power.

### math.radians
```v
pub fn radians(degrees f64) f64
```
radians convert from radians to degrees.

### math.round
```v
pub fn round(f f64) f64
```
round returns the integer nearest to the provided value.

### math.sin
```v
pub fn sin(a f64) f64
```
sin calculates sine.

### math.sinh
```v
pub fn sinh(a f64) f64
```
sinh calculates hyperbolic sine.

### math.sqrt
```v
pub fn sqrt(a f64) f64
```
sqrt calculates square-root of the provided value.

### math.sqrtf
```v
pub fn sqrtf(a f32) f32
```
sqrtf calculates square-root of the provided float32 value.

### math.tan
```v
pub fn tan(a f64) f64
```
tan calculates tangent.

### math.tanh
```v
pub fn tanh(a f64) f64
```
tanh calculates hyperbolic tangent.

### math.trunc
```v
pub fn trunc(a f64) f64
```
trunc rounds a toward zero, returning the nearest integral value that is not 
larger in magnitude than a.

### math.aprox_sin
```v
pub fn aprox_sin(a f64) f64
```
Faster approximate sin() and cos() implemented from lolremez

### math.aprox_cos
```v
pub fn aprox_cos(a f64) f64
```