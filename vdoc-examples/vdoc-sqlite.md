# sqlite.v
- sqlite.v
## Contents
- [sqlite.DB](#sqlite.DB)
- [sqlite.Row](#sqlite.Row)
- [sqlite.connect](#sqlite.connect)
- [sqlite.DB.q_int](#sqlite.DB.q_int)
- [sqlite.DB.q_string](#sqlite.DB.q_string)
- [sqlite.DB.exec](#sqlite.DB.exec)
- [sqlite.DB.exec_one](#sqlite.DB.exec_one)
- [sqlite.DB.exec_none](#sqlite.DB.exec_none)

## Documentation
### sqlite.DB
```v
struct DB {
    conn  &C.sqlite3
}
```
### sqlite.Row
```v
struct Row {
    vals  []string
}
```
### sqlite.connect
```v
pub fn connect(path string) DB
```
Opens the connection with a database.

### sqlite.DB.q_int
```v
pub fn (db DB) q_int(query string) int
```
Returns a single cell with value int.

### sqlite.DB.q_string
```v
pub fn (db DB) q_string(query string) string
```
Returns a single cell with value string.

### sqlite.DB.exec
```v
pub fn (db DB) exec(query string) ([]Row,int)
```
Execute the query on db, return an array of all the results, alongside any result code. 
Result codes: https://www.sqlite.org/rescode.html

### sqlite.DB.exec_one
```v
pub fn (db DB) exec_one(query string) ?Row
```
Execute a query, handle error code 
Return the first row from the resulting table

### sqlite.DB.exec_none
```v
pub fn (db DB) exec_none(query string) int
```
In case you don't expect any result, but still want an error code 
e.g. INSERT INTO ... VALUES (...)
