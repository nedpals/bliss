# time module
- format.v
- parse.v
- time_nix.v
- time_windows.v
- time.v
- unix.v
## Contents
- [time.Time.format](#timetimeformat)
- [time.Time.format_ss](#timetimeformat_ss)
- [time.Time.hhmm](#timetimehhmm)
- [time.Time.hhmmss](#timetimehhmmss)
- [time.Time.hhmm12](#timetimehhmm)
- [time.Time.ymmdd](#timetimeymmdd)
- [time.Time.ddmmy](#timetimeddmmy)
- [time.Time.md](#timetimemd)
- [time.Time.clean](#timetimeclean)
- [time.Time.clean12](#timetimeclean)
- [time.Time.get_fmt_time_str](#timetimeget_fmt_time_str)
- [time.Time.get_fmt_date_str](#timetimeget_fmt_date_str)
- [time.Time.get_fmt_str](#timetimeget_fmt_str)

## Documentation
### time.Time.format
```v
fn (t Time) format() string
```
format returns a date string in "YYYY-MM-DD HH:MM" format (24h).

### time.Time.format_ss
```v
fn (t Time) format_ss() string
```
format_ss returns a date string in "YYYY-MM-DD HH:MM:SS" format (24h).

### time.Time.hhmm
```v
fn (t Time) hhmm() string
```
hhmm returns a date string in "HH:MM" format (24h).

### time.Time.hhmmss
```v
fn (t Time) hhmmss() string
```
hhmmss returns a date string in "HH:MM:SS" format (24h).

### time.Time.hhmm12
```v
fn (t Time) hhmm12() string
```
hhmm12 returns a date string in "HH:MM" format (12h).

### time.Time.ymmdd
```v
fn (t Time) ymmdd() string
```
ymmdd returns a date string in "YYYY-MM-DD" format.

### time.Time.ddmmy
```v
fn (t Time) ddmmy() string
```
ddmmy returns a date string in "DD.MM.YYYY" format.

### time.Time.md
```v
fn (t Time) md() string
```
md returns a date string in "MMM D" format.

### time.Time.clean
```v
fn (t Time) clean() string
```
clean returns a date string in a following format: 
 - a date string in "HH:MM" format (24h) for current day 
 - a date string in "MMM D HH:MM" format (24h) for date of current year 
 - a date string formatted with format function for other dates

### time.Time.clean12
```v
fn (t Time) clean12() string
```
clean12 returns a date string in a following format: 
 - a date string in "HH:MM" format (12h) for current day 
 - a date string in "MMM D HH:MM" format (12h) for date of current year 
 - a date string formatted with format function for other dates

### time.Time.get_fmt_time_str
```v
fn (t Time) get_fmt_time_str(fmt_time FormatTime) string
```
get_fmt_time_str returns a date string with specified FormatTime type.

### time.Time.get_fmt_date_str
```v
fn (t Time) get_fmt_date_str(fmt_dlmtr FormatDelimiter, fmt_date FormatDate) string
```
get_fmt_time_str returns a date string with specified 
FormatDelimiter and FormatDate type.

### time.Time.get_fmt_str
```v
fn (t Time) get_fmt_str(fmt_dlmtr FormatDelimiter, fmt_time FormatTime, fmt_date FormatDate) string
```
get_fmt_str returns a date string with specified FormatDelimiter, 
FormatTime type, and FormatDate type.
