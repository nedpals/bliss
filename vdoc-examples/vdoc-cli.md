# cli module
- command.v
- flag.v
- help.v
- version.v
## Contents
- [cli.Command](#clicommand)
- [cli.Command.full_name](#clicommandfull_name)
- [cli.Command.root](#clicommandroot)
- [cli.Command.add_command](#clicommandadd_command)
- [cli.Command.add_flag](#clicommandadd_flag)
- [cli.Command.parse](#clicommandparse)

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
### cli.Command.full_name
```v
fn (cmd Command) full_name() string
```
### cli.Command.root
```v
fn (cmd Command) root() Command
```
### cli.Command.add_command
```v
fn (cmd mut Command) add_command(command Command) void
```
### cli.Command.add_flag
```v
fn (cmd mut Command) add_flag(flag Flag) void
```
### cli.Command.parse
```v
fn (cmd mut Command) parse(args []string) void
```