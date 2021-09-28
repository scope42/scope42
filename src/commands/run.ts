import { Command, flags } from '@oclif/command'
import { dirname, resolve } from 'path'
import Listr from 'listr'
import execa from 'execa'
import getPort from 'get-port'
import waitOn from 'wait-on'
import open from 'open'

export default class Run extends Command {
  static description = 'runs the scope42 UI'

  static examples = [
    '$ scope42 run',
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [{ name: 'workspace' }]

  async run() {
    const { args } = this.parse(Run)

    const workspace = args.workspace ?? process.cwd()
    this.log(`Running scope42 in workspace: ${workspace}`)

    const basePath = dirname(require.resolve('../../package.json'))
    const uiPath = resolve(basePath, 'ui')

    const tasks = new Listr([
      {
        title: 'Install Dependencies',
        task: () => new Promise(resolve => setTimeout(resolve, 1000)),
      },
      {
        title: 'Start UI',
        task: async (ctx, task) => {
          const port = await getPort()
          execa('npm', ['start', '--', '-p', `${port}`], { cwd: uiPath }).catch(error => task.report(error))
          ctx.uiUrl = `http://localhost:${port}`
          return waitOn({ resources: [`http://localhost:${port}`] })
        },
      },
      {
        title: 'Open UI',
        skip: ctx => !ctx.uiUrl,
        task: ctx => open(ctx.uiUrl),
      },
    ])

    const ctx = await tasks.run()

    this.log(`scope42 has been started at ${ctx.uiUrl}`)
  }
}
