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
- [log.Log.set_level](#loglogset_level)
- [log.Log.set_output_level](#loglogset_output_level)
- [log.Log.set_full_logpath](#loglogset_full_logpath)
- [log.Log.set_output_label](#loglogset_output_label)
- [log.Log.set_output_path](#loglogset_output_path)
- [log.Log.close](#loglogclose)
- [log.Log.fatal](#loglogfatal)
- [log.Log.error](#loglogerror)
- [log.Log.warn](#loglogwarn)
- [log.Log.info](#logloginfo)
- [log.Log.debug](#loglogdebug)

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
### log.Log.set_level
```v
fn (l mut Log) set_level(level int) void
```
### log.Log.set_output_level
```v
fn (l mut Log) set_output_level(level LogLevel) void
```
### log.Log.set_full_logpath
```v
fn (l mut Log) set_full_logpath(full_log_path string) void
```
### log.Log.set_output_label
```v
fn (l mut Log) set_output_label(label string) void
```
### log.Log.set_output_path
```v
fn (l mut Log) set_output_path(output_file_path string) void
```
### log.Log.close
```v
fn (l mut Log) close() void
```
### log.Log.fatal
```v
fn (l mut Log) fatal(s string) void
```
### log.Log.error
```v
fn (l mut Log) error(s string) void
```
### log.Log.warn
```v
fn (l mut Log) warn(s string) void
```
### log.Log.info
```v
fn (l mut Log) info(s string) void
```
### log.Log.debug
```v
fn (l mut Log) debug(s string) void
```