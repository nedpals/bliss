# time module
- format.v
- parse.v
- time_nix.v
- time_windows.v
- time.v
- unix.v
## Contents
- [time.Time](#timetime)
- [time.FormatTime](#timeformattime)
- [time.FormatDate](#timeformatdate)
- [time.FormatDelimiter](#timeformatdelimiter)
- [time.now](#timenow)
- [time.Time.smonth](#timetimesmonth)
- [time.new_time](#timenew_time)
- [time.&Time.unix_time](#timetimeunix_time)
- [time.Time.add_seconds](#timetimeadd_seconds)
- [time.Time.add_days](#timetimeadd_days)
- [time.Time.relative](#timetimerelative)
- [time.day_of_week](#timeday_of_week)
- [time.Time.day_of_week](#timetimeday_of_week)
- [time.Time.weekday_str](#timetimeweekday_str)
- [time.ticks](#timeticks)
- [time.sleep](#timesleep)
- [time.sleep_ms](#timesleep_ms)
- [time.usleep](#timeusleep)
- [time.is_leap_year](#timeis_leap_year)
- [time.days_in_month](#timedays_in_month)
- [time.Time.str](#timetimestr)

## Documentation
### time.Time
```v
pub  struct Time {
    year   int
    month   int
    day   int
    hour   int
    minute   int
    second   int
    unix   int
}
```
### time.FormatTime
```v
pub  enum FormatTime {
    hhmm12
    hhmm24
    hhmmss12
    hhmmss24
    no_time
}
```
### time.FormatDate
```v
pub  enum FormatDate {
    ddmmyy
    ddmmyyyy
    mmddyy
    mmddyyyy
    mmmd
    mmmdd
    mmmddyyyy
    no_date
    yyyymmdd
}
```
### time.FormatDelimiter
```v
pub  enum FormatDelimiter {
    dot
    hyphen
    slash
    space
}
```
### time.now
```v
pub fn now() Time
```
now returns current local time.

### time.Time.smonth
```v
pub fn (t Time) smonth() string
```
smonth returns month name.

### time.new_time
```v
pub fn new_time(t Time) Time
```
new_time returns a time struct with calculated Unix time.

### time.&Time.unix_time
```v
pub fn (t &Time) unix_time() int
```
unix_time returns Unix time.

### time.Time.add_seconds
```v
pub fn (t Time) add_seconds(seconds int) Time
```
add_days returns a new time struct with an added number of seconds.

### time.Time.add_days
```v
pub fn (t Time) add_days(days int) Time
```
add_days returns a new time struct with an added number of days.

### time.Time.relative
```v
pub fn (t Time) relative() string
```
relative returns a string representation of difference between time 
and current time.

### time.day_of_week
```v
pub fn day_of_week(y, m, d int) int
```
day_of_week returns the current day of a given year, month, and day, 
as an integer.

### time.Time.day_of_week
```v
pub fn (t Time) day_of_week() int
```
day_of_week returns the current day as an integer.

### time.Time.weekday_str
```v
pub fn (t Time) weekday_str() string
```
weekday_str returns the current day as a string.

### time.ticks
```v
pub fn ticks() i64
```
ticks returns a number of milliseconds elapsed since system start.

### time.sleep
```v
pub fn sleep(seconds int) void
```
sleep makes the calling thread sleep for a given number of seconds.

### time.sleep_ms
```v
pub fn sleep_ms(milliseconds int) void
```
sleep_ms makes the calling thread sleep for a given number of milliseconds.

### time.usleep
```v
pub fn usleep(microseconds int) void
```
usleep makes the calling thread sleep for a given number of microseconds.

### time.is_leap_year
```v
pub fn is_leap_year(year int) bool
```
is_leap_year checks if a given a year is a leap year.

### time.days_in_month
```v
pub fn days_in_month(month, year int) ?int
```
days_in_month returns a number of days in a given month.

### time.Time.str
```v
pub fn (t Time) str() string
```
str returns time in the same format as `parse` expects ("YYYY-MM-DD HH:MM:SS").
