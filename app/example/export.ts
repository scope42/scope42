import { Workspace } from '@scope42/data'
import { NodeDirectoryHandle } from '@scope42/data/dist/io/adapters/node'
import superjson from 'superjson'
import fs from 'fs'

async function main() {
  const workspace = new Workspace(new NodeDirectoryHandle(__dirname))
  const items = await workspace.readItemsIndexed()
  fs.writeFileSync('./public/example.json', superjson.stringify(items))
}

main()
