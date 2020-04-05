# pg module
- pg.v
## Contents
- [pg.DB](#pgdb)
- [pg.Row](#pgrow)
- [pg.Config](#pgconfig)
- [pg.connect](#pgconnect)
- [pg.DB.q_int](#pgdbq_int)
- [pg.DB.q_string](#pgdbq_string)
- [pg.DB.q_strings](#pgdbq_strings)
- [pg.DB.exec](#pgdbexec)
- [pg.DB.exec_one](#pgdbexec_one)
- [pg.DB.exec_param_many](#pgdbexec_param_many)
- [pg.DB.exec_param2](#pgdbexec_param)
- [pg.DB.exec_param](#pgdbexec_param)

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
### pg.DB.q_int
```v
fn (db DB) q_int(query string) int
```
### pg.DB.q_string
```v
fn (db DB) q_string(query string) string
```
### pg.DB.q_strings
```v
fn (db DB) q_strings(query string) []pg.Row
```
### pg.DB.exec
```v
fn (db DB) exec(query string) []pg.Row
```
### pg.DB.exec_one
```v
fn (db DB) exec_one(query string) ?pg.Row
```
### pg.DB.exec_param_many
```v
fn (db DB) exec_param_many(query string, params []string) []pg.Row
```
The entire function can be considered unsafe because of the malloc and the 
free. This prevents warnings and doesn't seem to affect behavior.

### pg.DB.exec_param2
```v
fn (db DB) exec_param2(query string, param, param2 string) []pg.Row
```
### pg.DB.exec_param
```v
fn (db DB) exec_param(query string, param string) []pg.Row
```