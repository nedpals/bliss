# sync module
- pool.v
- sync_nix.v
- sync_windows.v
- waitgroup.v
## Contents
- [sync.no_result](#syncno_result)
- [sync.PoolProcessor](#syncpoolprocessor)
- [sync.ThreadCB](#syncthreadcb)
- [sync.PoolProcessorConfig](#syncpoolprocessorconfig)
- [sync.new_pool_processor](#syncnew_pool_processor)
- [sync.PoolProcessor.set_max_jobs](#syncpoolprocessorset_max_jobs)
- [sync.PoolProcessor.work_on_items<T>](#syncpoolprocessorwork_on_itemst)
- [sync.PoolProcessor.work_on_pointers](#syncpoolprocessorwork_on_pointers)
- [sync.&PoolProcessor.get_item<T>](#syncpoolprocessorget_itemt)
- [sync.&PoolProcessor.get_string_item](#syncpoolprocessorget_string_item)
- [sync.&PoolProcessor.get_int_item](#syncpoolprocessorget_int_item)
- [sync.&PoolProcessor.get_result<T>](#syncpoolprocessorget_resultt)
- [sync.&PoolProcessor.get_results<T>](#syncpoolprocessorget_resultst)
- [sync.PoolProcessor.set_shared_context](#syncpoolprocessorset_shared_context)
- [sync.&PoolProcessor.get_shared_context](#syncpoolprocessorget_shared_context)
- [sync.PoolProcessor.set_thread_context](#syncpoolprocessorset_thread_context)
- [sync.&PoolProcessor.get_thread_context](#syncpoolprocessorget_thread_context)

## Documentation
### sync.no_result
```v

```
### sync.PoolProcessor
```v
 struct PoolProcessor {
    thread_cb   voidptr
    njobs   int
    items   []voidptr
    results   []voidptr
    ntask   int
    ntask_mtx   &Mutex
    waitgroup   &WaitGroup
    shared_context   voidptr
    thread_contexts   []voidptr
}
```
### sync.ThreadCB
```v

```
### sync.PoolProcessorConfig
```v
 struct PoolProcessorConfig {
    maxjobs   int
    callback   ThreadCB
}
```
### sync.new_pool_processor
```v
fn new_pool_processor(context PoolProcessorConfig) &PoolProcessor
```
new_pool_processor returns a new PoolProcessor instance.

### sync.PoolProcessor.set_max_jobs
```v
fn (pool mut PoolProcessor) set_max_jobs(njobs int) void
```
set_max_jobs gives you the ability to override the number 
of jobs *after* the PoolProcessor had been created already.

### sync.PoolProcessor.work_on_items<T>
```v
fn (pool mut PoolProcessor) work_on_items<T>(items []T) void
```
work_on_items receives a list of items of type T, 
then starts a work pool of pool.njobs threads, each running 
pool.thread_cb in a loop, untill all items in the list, 
are processed. 
When pool.njobs is 0, the number of jobs is determined 
by the number of available cores on the system. 
work_on_items returns *after* all threads finish. 
You can optionally call get_results after that.

### sync.PoolProcessor.work_on_pointers
```v
fn (pool mut PoolProcessor) work_on_pointers(items []voidptr) void
```
### sync.&PoolProcessor.get_item<T>
```v
fn (pool &PoolProcessor) get_item<T>(idx int) T
```
get_item - called by the worker callback. 
Retrieves a type safe instance of the currently processed item

### sync.&PoolProcessor.get_string_item
```v
fn (pool &PoolProcessor) get_string_item(idx int) string
```
get_string_item - called by the worker callback. 
It does not use generics so it does not mess up vfmt. 
TODO: remove the need for this when vfmt becomes smarter.

### sync.&PoolProcessor.get_int_item
```v
fn (pool &PoolProcessor) get_int_item(idx int) int
```
get_int_item - called by the worker callback. 
It does not use generics so it does not mess up vfmt. 
TODO: remove the need for this when vfmt becomes smarter.

### sync.&PoolProcessor.get_result<T>
```v
fn (pool &PoolProcessor) get_result<T>(idx int) T
```
### sync.&PoolProcessor.get_results<T>
```v
fn (pool &PoolProcessor) get_results<T>() []T
```
get_results - can be called to get a list of type safe results.

### sync.PoolProcessor.set_shared_context
```v
fn (pool mut PoolProcessor) set_shared_context(context voidptr) void
```
set_shared_context - can be called during the setup so that you can 
provide a context that is shared between all worker threads, like 
common options/settings.

### sync.&PoolProcessor.get_shared_context
```v
fn (pool &PoolProcessor) get_shared_context() voidptr
```
get_shared_context - can be called in each worker callback, to get 
the context set by pool.set_shared_context

### sync.PoolProcessor.set_thread_context
```v
fn (pool mut PoolProcessor) set_thread_context(idx int, context voidptr) void
```
set_thread_context - can be called during the setup at the start of 
each worker callback, so that the worker callback can have some thread 
local storage area where it can write/read information that is private 
to the given thread, without worrying that it will get overwritten by 
another thread

### sync.&PoolProcessor.get_thread_context
```v
fn (pool &PoolProcessor) get_thread_context(idx int) voidptr
```
get_thread_context - returns a pointer, that was set with 
pool.set_thread_context . This pointer is private to each thread.
