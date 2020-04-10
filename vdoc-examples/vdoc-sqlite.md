# sqlite module
- sqlite.v
## Contents
- [sqlite.DB](#sqlitedb)
- [sqlite.Row](#sqliterow)
- [sqlite.connect](#sqliteconnect)
- [sqlite.q_int](#sqliteq_int)
- [sqlite.q_string](#sqliteq_string)
- [sqlite.exec](#sqliteexec)
- [sqlite.exec_one](#sqliteexec_one)
- [sqlite.exec_none](#sqliteexec_none)

## Documentation
### sqlite.DB
```v
 struct DB {
    conn   &C.sqlite3
}
```
### sqlite.Row
```v
 struct Row {
    vals   []string
}
```
### sqlite.connect
```v
fn connect(path string) DB
```
Opens the connection with a database.

### sqlite.q_int
```v
fn (db DB) q_int(query string) int
```
Returns a single cell with value int.

### sqlite.q_string
```v
fn (db DB) q_string(query string) string
```
Returns a single cell with value string.

### sqlite.exec
```v
fn (db DB) exec(query string) ([]Row,int)
```
Execute the query on db, return an array of all the results, alongside any result code. 
Result codes: https://www.sqlite.org/rescode.html

### sqlite.exec_one
```v
fn (db DB) exec_one(query string) ?Row
```
Execute a query, handle error code 
Return the first row from the resulting table

### sqlite.exec_none
```v
fn (db DB) exec_none(query string) int
```
In case you don't expect any result, but still want an error code 
e.g. INSERT INTO ... VALUES (...)
