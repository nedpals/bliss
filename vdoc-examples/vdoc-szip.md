# szip module
- szip.v
## Contents
- [szip.open](#szipopen)
- [szip.close](#szipclose)
- [szip.open_entry](#szipopen_entry)
- [szip.close_entry](#szipclose_entry)
- [szip.name](#szipname)
- [szip.index](#szipindex)
- [szip.isdir](#szipisdir)
- [szip.size](#szipsize)
- [szip.crc32](#szipcrc)
- [szip.write_entry](#szipwrite_entry)
- [szip.create_entry](#szipcreate_entry)
- [szip.read_entry](#szipread_entry)
- [szip.extract_entry](#szipextract_entry)
- [szip.total](#sziptotal)

## Documentation
### szip.open
```v
fn open(name string, level int, mode string) ?zip_ptr
```
open opens zip archive with compression level using the given mode. 
 
 @param zipname zip archive file name. 
 @param level compression level (0-9 are the standard zlib-style levels). 
 @param mode file access mode. 
        - 'r': opens a file for reading/extracting (the file must exists). 
        - 'w': creates an empty file for writing. 
        - 'a': appends to an existing archive. 
 
 @return the zip archive handler or NULL on error

### szip.close
```v
fn (z mut zip_ptr) close() void
```
close closes the zip archive, releases resources - always finalize. 
 
 @param zip zip archive handler.

### szip.open_entry
```v
fn (zentry mut zip_ptr) open_entry(name string) bool
```
open_entry opens an entry by name in the zip archive. 
 
 For zip archive opened in 'w' or 'a' mode the function will append 
 a new entry. In readonly mode the function tries to locate the entry 
 in global dictionary. 
 
 @param zip zip archive handler. 
 @param entryname an entry name in local dictionary. 
 
 @return the return code - 0 on success, negative number (< 0) on error.

### szip.close_entry
```v
fn (zentry mut zip_ptr) close_entry() void
```
close_entry closes a zip entry, flushes buffer and releases resources. 
 
 @param zip zip archive handler. 
 
 @return the return code - 0 on success, negative number (< 0) on error.

### szip.name
```v
fn (zentry mut zip_ptr) name() string
```
name returns a local name of the current zip entry. 
 
 The main difference between user's entry name and local entry name 
 is optional relative path. 
 Following .ZIP File Format Specification - the path stored MUST not contain 
 a drive or device letter, or a leading slash. 
 All slashes MUST be forward slashes '/' as opposed to backwards slashes '\' 
 for compatibility with Amiga and UNIX file systems etc. 
 
 @param zip: zip archive handler. 
 
 @return the pointer to the current zip entry name, or NULL on error.

### szip.index
```v
fn (zentry mut zip_ptr) index() ?int
```
index returns an index of the current zip entry. 
 
 @param zip zip archive handler. 
 
 @return the index on success, negative number (< 0) on error.

### szip.isdir
```v
fn (zentry mut zip_ptr) isdir() ?bool
```
isdir determines if the current zip entry is a directory entry. 
 
 @param zip zip archive handler. 
 
 @return the return code - 1 (true), 0 (false), negative number (< 0) on 
         error.

### szip.size
```v
fn (zentry mut zip_ptr) size() i64
```
size returns an uncompressed size of the current zip entry. 
 
 @param zip zip archive handler. 
 
 @return the uncompressed size in bytes.

### szip.crc32
```v
fn (zentry mut zip_ptr) crc32() u32
```
crc32 returns CRC-32 checksum of the current zip entry. 
 
 @param zip zip archive handler. 
 
 @return the CRC-32 checksum.

### szip.write_entry
```v
fn (zentry mut zip_ptr) write_entry(data []byte) bool
```
write_entry compresses an input buffer for the current zip entry. 
 
 @param zip zip archive handler. 
 @param buf input buffer. 
 @param bufsize input buffer size (in bytes). 
 
 @return the return code - 0 on success, negative number (< 0) on error.

### szip.create_entry
```v
fn (zentry mut zip_ptr) create_entry(name string) bool
```
create_entry compresses a file for the current zip entry. 
 
 @param zip zip archive handler. 
 @param filename input file. 
 
 @return the return code - 0 on success, negative number (< 0) on error.

### szip.read_entry
```v
fn (zentry mut zip_ptr) read_entry() ?voidptr
```
read_entry extracts the current zip entry into output buffer. 
 
 The function allocates sufficient memory for an output buffer. 
 
 @param zip zip archive handler. 
 @param buf output buffer. 
 @param bufsize output buffer size (in bytes). 
 
 @note remember to release the memory allocated for an output buffer. 
       for large entries, please take a look at zip_entry_extract function. 
 
 @return the return code - the number of bytes actually read on success. 
         Otherwise a -1 on error.

### szip.extract_entry
```v
fn (zentry mut zip_ptr) extract_entry(path string) bool
```
extract_entry extracts the current zip entry into output file. 
 
 @param zip zip archive handler. 
 @param filename output file. 
 
 @return the return code - 0 on success, negative number (< 0) on error.

### szip.total
```v
fn (zentry mut zip_ptr) total() ?int
```
extract extracts the current zip entry using a callback function (on_extract). 
 
 @param zip zip archive handler. 
 @param on_extract callback function. 
 @param arg opaque pointer (optional argument, which you can pass to the 
        on_extract callback) 
 
 @return the return code - 0 on success, negative number (< 0) on error. 
 
n (zentry mut zip_ptr) extract(path string) bool { 
if C.access(path.str, 0) == -1 { 
return false 
eturn error('Cannot open directory for extracting, directory not exists') 
} 
res := C.zip_extract(zentry, path.str, 0, 0) 
return res == 0 
}*/ 
 
 total returns the number of all entries (files and directories) in the zip archive. 
 
 @param zip zip archive handler. 
 
 @return the return code - the number of entries on success, negative number 
         (< 0) on error.
