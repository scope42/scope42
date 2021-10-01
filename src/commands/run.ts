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

    const workspace = args.workspace ? resolve(args.workspace) : process.cwd()
    this.log(`Running scope42 in workspace: ${workspace}`)

    const basePath = dirname(require.resolve('../../package.json'))
    const uiPath = resolve(basePath, 'ui')

    const tasks = new Listr([
      {
        title: 'Install Dependencies',
        task: () => new Promise(resolve => setTimeout(resolve, 1000)),
      },
      {
        title: 'Start CMS',
        task: async (ctx, task) => {
          ctx.cmsPort = await getPort()
          execa('npx', ['netlify-cms-proxy-server'], { cwd: basePath, env: { PORT: `${ctx.cmsPort}`, GIT_REPO_DIRECTORY: workspace } }).catch(error => task.report(error))
          task.output = ctx.cmsPort
          return waitOn({ resources: [`http://localhost:${ctx.cmsPort}`], validateStatus: status => status === 404 })
        },
      },
      {
        title: 'Start UI',
        task: async (ctx, task) => {
          const port = await getPort()
          // We use "dev" here so that we have access to env variables and data is reloaded
          execa('npm', ['run', 'dev', '--', '-p', `${port}`], { cwd: uiPath, env: { WORKSPACE: workspace } }).catch(error => task.report(error))
          ctx.uiUrl = `http://localhost:${port}`
          return waitOn({ resources: [ctx.uiUrl] })
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
