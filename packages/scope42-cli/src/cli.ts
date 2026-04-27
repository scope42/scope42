import { Command } from 'commander'

const program = new Command()

program.name('scope42').description('scope42 CLI').version('0.0.0')

program.parseAsync(process.argv)
