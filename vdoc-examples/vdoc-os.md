# os module
- const_nix.v
- const_windows.v
- const.v
- environment.v
- os_nix.v
- os_windows.v
- os.v
## Contents
- [os.File](#osfile)
- [os.File.is_opened](#osfileis_opened)
- [os.&File.read_bytes](#osfileread_bytes)
- [os.&File.read_bytes_at](#osfileread_bytes_at)
- [os.read_bytes](#osread_bytes)
- [os.read_file](#osread_file)
- [os.file_size](#osfile_size)
- [os.mv](#osmv)
- [os.cp](#oscp)
- [os.cp_r](#oscp_r)
- [os.cp_all](#oscp_all)
- [os.mv_by_cp](#osmv_by_cp)
- [os.read_lines](#osread_lines)
- [os.open_append](#osopen_append)
- [os.open_file](#osopen_file)
- [os.File.write_bytes_at](#osfilewrite_bytes_at)
- [os.File.flush](#osfileflush)
- [os.posix_get_error_msg](#osposix_get_error_msg)
- [os.Result](#osresult)
- [os.system](#ossystem)
- [os.sigint_to_signal_name](#ossigint_to_signal_name)
- [os.exists](#osexists)
- [os.is_executable](#osis_executable)
- [os.is_writable](#osis_writable)
- [os.is_readable](#osis_readable)
- [os.file_exists](#osfile_exists)
- [os.rm](#osrm)
- [os.rmdir](#osrmdir)
- [os.rmdir_recursive](#osrmdir_recursive)
- [os.rmdir_all](#osrmdir_all)
- [os.is_dir_empty](#osis_dir_empty)
- [os.ext](#osext)
- [os.dir](#osdir)
- [os.base_dir](#osbase_dir)
- [os.file_name](#osfile_name)
- [os.get_line](#osget_line)
- [os.get_raw_line](#osget_raw_line)
- [os.get_lines](#osget_lines)
- [os.get_lines_joined](#osget_lines_joined)
- [os.user_os](#osuser_os)
- [os.home_dir](#oshome_dir)
- [os.write_file](#oswrite_file)
- [os.clear](#osclear)
- [os.on_segfault](#oson_segfault)
- [os.executable](#osexecutable)
- [os.find_abs_path_of_executable](#osfind_abs_path_of_executable)
- [os.dir_exists](#osdir_exists)
- [os.is_dir](#osis_dir)
- [os.is_link](#osis_link)
- [os.chdir](#oschdir)
- [os.getwd](#osgetwd)
- [os.real_path](#osreal_path)
- [os.is_abs_path](#osis_abs_path)
- [os.join_path](#osjoin_path)
- [os.walk_ext](#oswalk_ext)
- [os.walk](#oswalk)
- [os.signal](#ossignal)
- [os.fork](#osfork)
- [os.wait](#oswait)
- [os.file_last_mod_unix](#osfile_last_mod_unix)
- [os.log](#oslog)
- [os.flush_stdout](#osflush_stdout)
- [os.flush](#osflush)
- [os.mkdir_all](#osmkdir_all)
- [os.cache_dir](#oscache_dir)
- [os.temp_dir](#ostemp_dir)
- [os.chmod](#oschmod)
- [os.resource_abs_path](#osresource_abs_path)

## Documentation
### os.File
```v
pub  struct File {
    cfile   voidptr
    fd   int
    opened   bool
}
```
### os.File.is_opened
```v
pub fn (f File) is_opened() bool
```
### os.&File.read_bytes
```v
pub fn (f &File) read_bytes(size int) []byte
```
read_bytes reads an amount of bytes from the beginning of the file

### os.&File.read_bytes_at
```v
pub fn (f &File) read_bytes_at(size, pos int) []byte
```
read_bytes_at reads an amount of bytes at the given position in the file

### os.read_bytes
```v
pub fn read_bytes(path string) ?[]byte
```
### os.read_file
```v
pub fn read_file(path string) ?string
```
read_file reads the file in `path` and returns the contents.

### os.file_size
```v
pub fn file_size(path string) int
```
file_size returns the size of the file located in `path`.

### os.mv
```v
pub fn mv(old, new string) void
```
### os.cp
```v
pub fn cp(old, new string) ?bool
```
TODO implement actual cp for linux

### os.cp_r
```v
pub fn cp_r(osource_path, odest_path string, overwrite bool) ?bool
```
### os.cp_all
```v
pub fn cp_all(osource_path, odest_path string, overwrite bool) ?bool
```
### os.mv_by_cp
```v
pub fn mv_by_cp(source string, target string) ?bool
```
mv_by_cp first copies the source file, and if it is copied successfully, deletes the source file. 
mv_by_cp may be used when you are not sure that the source and target are on the same mount/partition.

### os.read_lines
```v
pub fn read_lines(path string) ?[]string
```
read_lines reads the file in `path` into an array of lines.

### os.open_append
```v
pub fn open_append(path string) ?File
```
### os.open_file
```v
pub fn open_file(path string, mode string, options ...int) ?File
```
open_file can be used to open or create a file with custom flags and permissions and returns a `File` object

### os.File.write_bytes_at
```v
pub fn (f mut File) write_bytes_at(data voidptr, size, pos int) void
```
### os.File.flush
```v
pub fn (f mut File) flush() void
```
### os.posix_get_error_msg
```v
pub fn posix_get_error_msg(code int) string
```
posix_get_error_msg return error code representation in string.

### os.Result
```v
pub  struct Result {
    exit_code   int
    output   string
}
```
### os.system
```v
pub fn system(cmd string) int
```
`system` works like `exec()`, but only returns a return code.

### os.sigint_to_signal_name
```v
pub fn sigint_to_signal_name(si int) string
```
### os.exists
```v
pub fn exists(path string) bool
```
exists returns true if `path` exists.

### os.is_executable
```v
pub fn is_executable(path string) bool
```
`is_executable` returns `true` if `path` is executable.

### os.is_writable
```v
pub fn is_writable(path string) bool
```
`is_writable` returns `true` if `path` is writable.

### os.is_readable
```v
pub fn is_readable(path string) bool
```
`is_readable` returns `true` if `path` is readable.

### os.file_exists
```v
pub fn file_exists(_path string) bool
```
### os.rm
```v
pub fn rm(path string) void
```
rm removes file in `path`.

### os.rmdir
```v
pub fn rmdir(path string) void
```
rmdir removes a specified directory.

### os.rmdir_recursive
```v
pub fn rmdir_recursive(path string) void
```
### os.rmdir_all
```v
pub fn rmdir_all(path string) void
```
### os.is_dir_empty
```v
pub fn is_dir_empty(path string) bool
```
### os.ext
```v
pub fn ext(path string) string
```
### os.dir
```v
pub fn dir(path string) string
```
### os.base_dir
```v
pub fn base_dir(path string) string
```
### os.file_name
```v
pub fn file_name(path string) string
```
### os.get_line
```v
pub fn get_line() string
```
get_line returns a one-line string from stdin

### os.get_raw_line
```v
pub fn get_raw_line() string
```
get_raw_line returns a one-line string from stdin along with '\n' if there is any

### os.get_lines
```v
pub fn get_lines() []string
```
### os.get_lines_joined
```v
pub fn get_lines_joined() string
```
### os.user_os
```v
pub fn user_os() string
```
user_os returns current user operating system name.

### os.home_dir
```v
pub fn home_dir() string
```
home_dir returns path to user's home directory.

### os.write_file
```v
pub fn write_file(path, text string) void
```
write_file writes `text` data to a file in `path`.

### os.clear
```v
pub fn clear() void
```
clear clears current terminal screen.

### os.on_segfault
```v
pub fn on_segfault(f voidptr) void
```
### os.executable
```v
pub fn executable() string
```
executable returns the path name of the executable that started the current 
process.

### os.find_abs_path_of_executable
```v
pub fn find_abs_path_of_executable(exepath string) ?string
```
find_exe_path walks the environment PATH, just like most shell do, it returns 
the absolute path of the executable if found

### os.dir_exists
```v
pub fn dir_exists(path string) bool
```
### os.is_dir
```v
pub fn is_dir(path string) bool
```
is_dir returns a boolean indicating whether the given path is a directory.

### os.is_link
```v
pub fn is_link(path string) bool
```
is_link returns a boolean indicating whether the given path is a link.

### os.chdir
```v
pub fn chdir(path string) void
```
chdir changes the current working directory to the new directory path.

### os.getwd
```v
pub fn getwd() string
```
getwd returns the absolute path name of the current directory.

### os.real_path
```v
pub fn real_path(fpath string) string
```
Returns the full absolute path for fpath, with all relative ../../, symlinks and so on resolved. 
See http://pubs.opengroup.org/onlinepubs/9699919799/functions/realpath.html 
Also https://insanecoding.blogspot.com/2007/11/pathmax-simply-isnt.html 
and https://insanecoding.blogspot.com/2007/11/implementing-realpath-in-c.html 
NB: this particular rabbit hole is *deep* ...

### os.is_abs_path
```v
pub fn is_abs_path(path string) bool
```
is_abs_path returns true if `path` is absolute.

### os.join_path
```v
pub fn join_path(base string, dirs ...string) string
```
join returns path as string from string parameter(s).

### os.walk_ext
```v
pub fn walk_ext(path, ext string) []string
```
walk_ext returns a recursive list of all file paths ending with `ext`.

### os.walk
```v
pub fn walk(path string, f fn(path string)) void
```
walk recursively traverses the given directory path. 
When a file is encountred it will call the callback function with current file as argument.

### os.signal
```v
pub fn signal(signum int, handler voidptr) void
```
### os.fork
```v
pub fn fork() int
```
### os.wait
```v
pub fn wait() int
```
### os.file_last_mod_unix
```v
pub fn file_last_mod_unix(path string) int
```
### os.log
```v
pub fn log(s string) void
```
### os.flush_stdout
```v
pub fn flush_stdout() void
```
### os.flush
```v
pub fn flush() void
```
### os.mkdir_all
```v
pub fn mkdir_all(path string) void
```
### os.cache_dir
```v
pub fn cache_dir() string
```
cache_dir returns the path to a *writable* user specific folder, suitable for writing non-essential data.

### os.temp_dir
```v
pub fn temp_dir() string
```
tmpdir returns the path to a folder, that is suitable for storing temporary files

### os.chmod
```v
pub fn chmod(path string, mode int) void
```
### os.resource_abs_path
```v
pub fn resource_abs_path(path string) string
```
resource_abs_path returns an absolute path, for the given `path` 
(the path is expected to be relative to the executable program) 
See https://discordapp.com/channels/592103645835821068/592294828432424960/630806741373943808 
It gives a convenient way to access program resources like images, fonts, sounds and so on, 
*no matter* how the program was started, and what is the current working directory.
