# eventbus module
- eventbus.v
## Contents
- [eventbus.EventHandlerFn](#eventbuseventhandlerfn)
- [eventbus.Publisher](#eventbuspublisher)
- [eventbus.Subscriber](#eventbussubscriber)
- [eventbus.EventBus](#eventbuseventbus)
- [eventbus.new](#eventbusnew)
- [eventbus.&EventBus.publish](#eventbuseventbuspublish)
- [eventbus.&EventBus.clear_all](#eventbuseventbusclear_all)
- [eventbus.&EventBus.has_subscriber](#eventbuseventbushas_subscriber)
- [eventbus.Subscriber.subscribe](#eventbussubscribersubscribe)
- [eventbus.Subscriber.subscribe_method](#eventbussubscribersubscribe_method)
- [eventbus.Subscriber.subscribe_once](#eventbussubscribersubscribe_once)
- [eventbus.&Subscriber.is_subscribed](#eventbussubscriberis_subscribed)
- [eventbus.Subscriber.unsubscribe](#eventbussubscriberunsubscribe)

## Documentation
### eventbus.EventHandlerFn
```v

```
### eventbus.Publisher
```v
 struct Publisher {
    registry   &Registry
}
```
### eventbus.Subscriber
```v
 struct Subscriber {
    registry   &Registry
}
```
### eventbus.EventBus
```v
 struct EventBus {
    registry   &Registry
    publisher   &Publisher
    subscriber   &Subscriber
}
```
### eventbus.new
```v
fn new() &EventBus
```
### eventbus.&EventBus.publish
```v
fn (eb &EventBus) publish(name string, sender voidptr, args voidptr) void
```
EventBus Methods

### eventbus.&EventBus.clear_all
```v
fn (eb &EventBus) clear_all() void
```
### eventbus.&EventBus.has_subscriber
```v
fn (eb &EventBus) has_subscriber(name string) bool
```
### eventbus.Subscriber.subscribe
```v
fn (s mut Subscriber) subscribe(name string, handler EventHandlerFn) void
```
Subscriber Methods

### eventbus.Subscriber.subscribe_method
```v
fn (s mut Subscriber) subscribe_method(name string, handler EventHandlerFn, receiver voidptr) void
```
### eventbus.Subscriber.subscribe_once
```v
fn (s mut Subscriber) subscribe_once(name string, handler EventHandlerFn) void
```
### eventbus.&Subscriber.is_subscribed
```v
fn (s &Subscriber) is_subscribed(name string) bool
```
### eventbus.Subscriber.unsubscribe
```v
fn (s mut Subscriber) unsubscribe(name string, handler EventHandlerFn) void
```