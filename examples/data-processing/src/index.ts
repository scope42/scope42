import { Workspace } from '@scope42/data'
import { NodeDirectoryHandle } from '@scope42/data/dist/io/adapters/node'

const workspace = new Workspace(new NodeDirectoryHandle('../../example'))

workspace.readItems().then(console.log)
