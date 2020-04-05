# benchmark module
- benchmark.v
## Contents
- [benchmark.Benchmark](#benchmarkbenchmark)
- [benchmark.new_benchmark](#benchmarknew_benchmark)
- [benchmark.new_benchmark_pointer](#benchmarknew_benchmark_pointer)
- [benchmark.Benchmark.set_total_expected_steps](#benchmarkbenchmarkset_total_expected_steps)
- [benchmark.Benchmark.stop](#benchmarkbenchmarkstop)
- [benchmark.Benchmark.step](#benchmarkbenchmarkstep)
- [benchmark.Benchmark.fail](#benchmarkbenchmarkfail)
- [benchmark.Benchmark.ok](#benchmarkbenchmarkok)
- [benchmark.Benchmark.skip](#benchmarkbenchmarkskip)
- [benchmark.Benchmark.fail_many](#benchmarkbenchmarkfail_many)
- [benchmark.Benchmark.ok_many](#benchmarkbenchmarkok_many)
- [benchmark.Benchmark.neither_fail_nor_ok](#benchmarkbenchmarkneither_fail_nor_ok)
- [benchmark.start](#benchmarkstart)
- [benchmark.Benchmark.measure](#benchmarkbenchmarkmeasure)
- [benchmark.&Benchmark.step_message_with_label](#benchmarkbenchmarkstep_message_with_label)
- [benchmark.&Benchmark.step_message](#benchmarkbenchmarkstep_message)
- [benchmark.&Benchmark.step_message_ok](#benchmarkbenchmarkstep_message_ok)
- [benchmark.&Benchmark.step_message_fail](#benchmarkbenchmarkstep_message_fail)
- [benchmark.&Benchmark.step_message_skip](#benchmarkbenchmarkstep_message_skip)
- [benchmark.&Benchmark.total_message](#benchmarkbenchmarktotal_message)
- [benchmark.&Benchmark.total_duration](#benchmarkbenchmarktotal_duration)

## Documentation
### benchmark.Benchmark
```v
 struct Benchmark {
    bench_start_time   i64
    bench_end_time   i64
    step_start_time   i64
    step_end_time   i64
    ntotal   int
    nok   int
    nfail   int
    nskip   int
    verbose   bool
    nexpected_steps   int
    cstep   int
    bok   string
    bfail   string
}
```
### benchmark.new_benchmark
```v
fn new_benchmark() Benchmark
```
### benchmark.new_benchmark_pointer
```v
fn new_benchmark_pointer() &Benchmark
```
### benchmark.Benchmark.set_total_expected_steps
```v
fn (b mut Benchmark) set_total_expected_steps(n int) void
```
### benchmark.Benchmark.stop
```v
fn (b mut Benchmark) stop() void
```
### benchmark.Benchmark.step
```v
fn (b mut Benchmark) step() void
```
### benchmark.Benchmark.fail
```v
fn (b mut Benchmark) fail() void
```
### benchmark.Benchmark.ok
```v
fn (b mut Benchmark) ok() void
```
### benchmark.Benchmark.skip
```v
fn (b mut Benchmark) skip() void
```
### benchmark.Benchmark.fail_many
```v
fn (b mut Benchmark) fail_many(n int) void
```
### benchmark.Benchmark.ok_many
```v
fn (b mut Benchmark) ok_many(n int) void
```
### benchmark.Benchmark.neither_fail_nor_ok
```v
fn (b mut Benchmark) neither_fail_nor_ok() void
```
### benchmark.start
```v
fn start() Benchmark
```
### benchmark.Benchmark.measure
```v
fn (b mut Benchmark) measure(label string) i64
```
### benchmark.&Benchmark.step_message_with_label
```v
fn (b &Benchmark) step_message_with_label(label string, msg string) string
```
### benchmark.&Benchmark.step_message
```v
fn (b &Benchmark) step_message(msg string) string
```
### benchmark.&Benchmark.step_message_ok
```v
fn (b &Benchmark) step_message_ok(msg string) string
```
### benchmark.&Benchmark.step_message_fail
```v
fn (b &Benchmark) step_message_fail(msg string) string
```
### benchmark.&Benchmark.step_message_skip
```v
fn (b &Benchmark) step_message_skip(msg string) string
```
### benchmark.&Benchmark.total_message
```v
fn (b &Benchmark) total_message(msg string) string
```
### benchmark.&Benchmark.total_duration
```v
fn (b &Benchmark) total_duration() i64
```