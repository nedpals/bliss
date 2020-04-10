# log module
- log.v
## Contents
- [log.LogLevel](#logloglevel)
- [log.FATAL](#logfatal)
- [log.ERROR](#logerror)
- [log.WARN](#logwarn)
- [log.INFO](#loginfo)
- [log.DEBUG](#logdebug)
- [log.Log](#loglog)
- [log.set_level](#logset_level)
- [log.set_output_level](#logset_output_level)
- [log.set_full_logpath](#logset_full_logpath)
- [log.set_output_label](#logset_output_label)
- [log.set_output_path](#logset_output_path)
- [log.close](#logclose)
- [log.fatal](#logfatal)
- [log.error](#logerror)
- [log.warn](#logwarn)
- [log.info](#loginfo)
- [log.debug](#logdebug)

## Documentation
### log.LogLevel
```v
 enum LogLevel {
    fatal
    error
    warn
    info
    debug
}
```
### log.FATAL
```v

```
### log.ERROR
```v

```
### log.WARN
```v

```
### log.INFO
```v

```
### log.DEBUG
```v

```
### log.Log
```v
 struct Log {
    level   LogLevel
    output_label   string
    ofile   os.File
    output_to_file   bool
    output_file_name   string
}
```
### log.set_level
```v
fn (l mut Log) set_level(level int) void
```
### log.set_output_level
```v
fn (l mut Log) set_output_level(level LogLevel) void
```
### log.set_full_logpath
```v
fn (l mut Log) set_full_logpath(full_log_path string) void
```
### log.set_output_label
```v
fn (l mut Log) set_output_label(label string) void
```
### log.set_output_path
```v
fn (l mut Log) set_output_path(output_file_path string) void
```
### log.close
```v
fn (l mut Log) close() void
```
### log.fatal
```v
fn (l mut Log) fatal(s string) void
```
### log.error
```v
fn (l mut Log) error(s string) void
```
### log.warn
```v
fn (l mut Log) warn(s string) void
```
### log.info
```v
fn (l mut Log) info(s string) void
```
### log.debug
```v
fn (l mut Log) debug(s string) void
```