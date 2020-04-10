# pg module
- pg.v
## Contents
- [pg.DB](#pgdb)
- [pg.Row](#pgrow)
- [pg.Config](#pgconfig)
- [pg.connect](#pgconnect)
- [pg.q_int](#pgq_int)
- [pg.q_string](#pgq_string)
- [pg.q_strings](#pgq_strings)
- [pg.exec](#pgexec)
- [pg.exec_one](#pgexec_one)
- [pg.exec_param_many](#pgexec_param_many)
- [pg.exec_param2](#pgexec_param)
- [pg.exec_param](#pgexec_param)

## Documentation
### pg.DB
```v
 struct DB {
    conn   &C.PGconn
}
```
### pg.Row
```v
 struct Row {
    vals   []string
}
```
### pg.Config
```v
 struct Config {
    host   string
    port   int
    user   string
    password   string
    dbname   string
}
```
### pg.connect
```v
fn connect(config pg.Config) ?DB
```
### pg.q_int
```v
fn (db DB) q_int(query string) int
```
### pg.q_string
```v
fn (db DB) q_string(query string) string
```
### pg.q_strings
```v
fn (db DB) q_strings(query string) []pg.Row
```
### pg.exec
```v
fn (db DB) exec(query string) []pg.Row
```
### pg.exec_one
```v
fn (db DB) exec_one(query string) ?pg.Row
```
### pg.exec_param_many
```v
fn (db DB) exec_param_many(query string, params []string) []pg.Row
```
The entire function can be considered unsafe because of the malloc and the 
free. This prevents warnings and doesn't seem to affect behavior.

### pg.exec_param2
```v
fn (db DB) exec_param2(query string, param, param2 string) []pg.Row
```
### pg.exec_param
```v
fn (db DB) exec_param(query string, param string) []pg.Row
```