# os.v
- const_nix.v
- const_windows.v
- const.v
- os_nix.v
- os_windows.v
- os.v
## Contents
- [os.File](#os.File)
- [os.FileInfo](#os.FileInfo)
- [os.File.is_opened](#os.File.is_opened)
- [os.&File.read_bytes](#os.&File.read_bytes)
- [os.&File.read_bytes_at](#os.&File.read_bytes_at)
- [os.read_bytes](#os.read_bytes)
- [os.read_file](#os.read_file)
- [os.file_size](#os.file_size)
- [os.mv](#os.mv)
- [os.cp](#os.cp)
- [os.cp_r](#os.cp_r)
- [os.mv_by_cp](#os.mv_by_cp)
- [os.vfopen](#os.vfopen)
- [os.read_lines](#os.read_lines)
- [os.read_ulines](#os.read_ulines)
- [os.open_append](#os.open_append)
- [os.open_file](#os.open_file)
- [os.File.flush](#os.File.flush)
- [os.vpopen](#os.vpopen)
- [os.posix_wait4_to_exit_status](#os.posix_wait4_to_exit_status)
- [os.posix_get_error_msg](#os.posix_get_error_msg)
- [os.vpclose](#os.vpclose)
- [os.Result](#os.Result)
- [os.system](#os.system)
- [os.sigint_to_signal_name](#os.sigint_to_signal_name)
- [os.getenv](#os.getenv)
- [os.setenv](#os.setenv)
- [os.unsetenv](#os.unsetenv)
- [os.exists](#os.exists)
- [os.is_executable](#os.is_executable)
- [os.is_writable](#os.is_writable)
- [os.is_readable](#os.is_readable)
- [os.file_exists](#os.file_exists)
- [os.rm](#os.rm)
- [os.rmdir](#os.rmdir)
- [os.rmdir_recursive](#os.rmdir_recursive)
- [os.is_dir_empty](#os.is_dir_empty)
- [os.print_c_errno](#os.print_c_errno)
- [os.ext](#os.ext)
- [os.dir](#os.dir)
- [os.basedir](#os.basedir)
- [os.filename](#os.filename)
- [os.get_line](#os.get_line)
- [os.get_raw_line](#os.get_raw_line)
- [os.get_lines](#os.get_lines)
- [os.get_lines_joined](#os.get_lines_joined)
- [os.user_os](#os.user_os)
- [os.home_dir](#os.home_dir)
- [os.write_file](#os.write_file)
- [os.clear](#os.clear)
- [os.on_segfault](#os.on_segfault)
- [os.executable](#os.executable)
- [os.dir_exists](#os.dir_exists)
- [os.is_dir](#os.is_dir)
- [os.is_link](#os.is_link)
- [os.chdir](#os.chdir)
- [os.getwd](#os.getwd)
- [os.realpath](#os.realpath)
- [os.walk_ext](#os.walk_ext)
- [os.walk](#os.walk)
- [os.signal](#os.signal)
- [os.fork](#os.fork)
- [os.wait](#os.wait)
- [os.file_last_mod_unix](#os.file_last_mod_unix)
- [os.log](#os.log)
- [os.flush_stdout](#os.flush_stdout)
- [os.mkdir_all](#os.mkdir_all)
- [os.join](#os.join)
- [os.cachedir](#os.cachedir)
- [os.tmpdir](#os.tmpdir)
- [os.chmod](#os.chmod)
- [os.resource_abs_path](#os.resource_abs_path)

## Documentation
### os.File
```v
struct File {
    cfile  voidptr
    fd  int
    opened  bool
}
```
### os.FileInfo
```v
struct FileInfo {
    name  string
    size  int
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
### os.mv_by_cp
```v
pub fn mv_by_cp(source string, target string) ?bool
```
mv_by_cp first copies the source file, and if it is copied successfully, deletes the source file. 
mv_by_cp may be used when you are not sure that the source and target are on the same mount/partition.

### os.vfopen
```v
fn vfopen(path, mode string) &C.FILE
```
### os.read_lines
```v
pub fn read_lines(path string) ?[]string
```
read_lines reads the file in `path` into an array of lines.

### os.read_ulines
```v
fn read_ulines(path string) ?[]ustring
```
### os.open_append
```v
pub fn open_append(path string) ?File
```
### os.open_file
```v
pub fn open_file(path string, mode string, options ...int) ?File
```
open_file can be used to open or create a file with custom flags and permissions and returns a `File` object

### os.File.flush
```v
pub fn (f mut File) flush() void
```
pub fn (f mut File) write_bytes_at(data voidptr, size, pos int) { 
$if linux { 
} 
$else { 
C.fseek(f.cfile, pos, C.SEEK_SET) 
C.fwrite(data, 1, size, f.cfile) 
C.fseek(f.cfile, 0, C.SEEK_END) 
} 
}

### os.vpopen
```v
fn vpopen(path string) voidptr
```
system starts the specified command, waits for it to complete, and returns its code.

### os.posix_wait4_to_exit_status
```v
fn posix_wait4_to_exit_status(waitret int) (int,bool)
```
### os.posix_get_error_msg
```v
pub fn posix_get_error_msg(code int) string
```
posix_get_error_msg return error code representation in string.

### os.vpclose
```v
fn vpclose(f voidptr) int
```
### os.Result
```v
struct Result {
    exit_code  int
    output  string
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
### os.getenv
```v
pub fn getenv(key string) string
```
`getenv` returns the value of the environment variable named by the key.

### os.setenv
```v
pub fn setenv(name string, value string, overwrite bool) int
```
### os.unsetenv
```v
pub fn unsetenv(name string) int
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
### os.is_dir_empty
```v
pub fn is_dir_empty(path string) bool
```
### os.print_c_errno
```v
fn print_c_errno() void
```
### os.ext
```v
pub fn ext(path string) string
```
### os.dir
```v
pub fn dir(path string) string
```
### os.basedir
```v
pub fn basedir(path string) string
```
### os.filename
```v
pub fn filename(path string) string
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

### os.realpath
```v
pub fn realpath(fpath string) string
```
Returns the full absolute path for fpath, with all relative ../../, symlinks and so on resolved. 
See http://pubs.opengroup.org/onlinepubs/9699919799/functions/realpath.html 
Also https://insanecoding.blogspot.com/2007/11/pathmax-simply-isnt.html 
and https://insanecoding.blogspot.com/2007/11/implementing-realpath-in-c.html 
NB: this particular rabbit hole is *deep* ...

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
### os.mkdir_all
```v
pub fn mkdir_all(path string) void
```
### os.join
```v
pub fn join(base string, dirs ...string) string
```
### os.cachedir
```v
pub fn cachedir() string
```
cachedir returns the path to a *writable* user specific folder, suitable for writing non-essential data.

### os.tmpdir
```v
pub fn tmpdir() string
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
