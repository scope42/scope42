import { resolve } from 'path'
import { cp } from 'node:fs/promises'

/**
 * Copies the app to the given directory.
 */
export async function copyApp(destinationPath: string, options?: any) {
  await cp(resolve(__dirname, '../build'), destinationPath, {
    recursive: true,
    filter: f => {
      console.log(f)
      return true
    },
    force: true
  })
}
