scope42
=======

A tool for aim42

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/scope42.svg)](https://npmjs.org/package/scope42)
[![Downloads/week](https://img.shields.io/npm/dw/scope42.svg)](https://npmjs.org/package/scope42)
[![License](https://img.shields.io/npm/l/scope42.svg)](https://github.com/erikhofer/scope42/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g scope42
$ scope42 COMMAND
running command...
$ scope42 (-v|--version|version)
scope42/0.0.0 win32-x64 node-v14.17.1
$ scope42 --help [COMMAND]
USAGE
  $ scope42 COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`scope42 hello [FILE]`](#scope42-hello-file)
* [`scope42 help [COMMAND]`](#scope42-help-command)

## `scope42 hello [FILE]`

describe the command here

```
USAGE
  $ scope42 hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ scope42 hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/erikhofer/scope42/blob/v0.0.0/src/commands/hello.ts)_

## `scope42 help [COMMAND]`

display help for scope42

```
USAGE
  $ scope42 help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_
<!-- commandsstop -->
