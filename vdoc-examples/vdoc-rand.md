# rand module
- pcg32.v
- rand.v
- splitmix64.v
## Contents
- [rand.Pcg32](#randpcg)
- [rand.new_pcg32](#randnew_pcg)
- [rand.Pcg32.next](#randpcgnext)
- [rand.Pcg32.bounded_next](#randpcgbounded_next)

## Documentation
### rand.Pcg32
```v
 struct Pcg32 {
    state   u64
    inc   u64
}
```
Ported from http://www.pcg-random.org/download.html 
and https://github.com/imneme/pcg-c-basic/blob/master/pcg_basic.c

### rand.new_pcg32
```v
fn new_pcg32(initstate u64, initseq u64) Pcg32
```
new_pcg32 - a Pcg32 PRNG generator 
 @param initstate - the initial state of the PRNG. 
 @param initseq - the stream/step of the PRNG. 
 @return a new Pcg32 PRNG instance

### rand.Pcg32.next
```v
fn (rng mut Pcg32) next() u32
```
Pcg32.next - update the PRNG state and get back the next random number 
 @return the generated pseudo random number

### rand.Pcg32.bounded_next
```v
fn (rng mut Pcg32) bounded_next(bound u32) u32
```
Pcg32.bounded_next - update the PRNG state. Get the next number <  bound 
 @param bound - the returned random number will be < bound 
 @return the generated pseudo random number
