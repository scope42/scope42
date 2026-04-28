import { Command } from 'commander'
import { makeInitCommand } from './commands/init'
import { makeLintCommand } from './commands/lint'

const program = new Command()

program.name('scope42').description('scope42 CLI').version('0.0.0')

program.addCommand(makeInitCommand())
program.addCommand(makeLintCommand())

program.parseAsync(process.argv)
