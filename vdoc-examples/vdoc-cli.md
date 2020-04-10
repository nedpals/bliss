# cli module
- command.v
- flag.v
- help.v
- version.v
## Contents
- [cli.Command](#clicommand)
- [cli.full_name](#clifull_name)
- [cli.root](#cliroot)
- [cli.add_command](#cliadd_command)
- [cli.add_flag](#cliadd_flag)
- [cli.parse](#cliparse)

## Documentation
### cli.Command
```v
 struct Command {
    name   string
    description   string
    version   string
    pre_execute   fn(cmd Command)
    execute   fn(cmd Command)
    post_execute   fn(cmd Command)
    disable_help   bool
    disable_version   bool
    parent   &Command
    commands   []Command
    flags   []Flag
    args   []string
}
```
### cli.full_name
```v
fn (cmd Command) full_name() string
```
### cli.root
```v
fn (cmd Command) root() Command
```
### cli.add_command
```v
fn (cmd mut Command) add_command(command Command) void
```
### cli.add_flag
```v
fn (cmd mut Command) add_flag(flag Flag) void
```
### cli.parse
```v
fn (cmd mut Command) parse(args []string) void
```