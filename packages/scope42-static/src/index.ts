import { copyApp } from '@scope42/app'

export async function exportStaticWorkspace() {
  await copyApp('./foo')
}
