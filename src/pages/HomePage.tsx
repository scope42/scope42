import { PageHeader } from '../components/PageHeader'
import { Welcome } from '../components/Welcome'
import { selectAllItems, useStore } from '../data/store'

export default function HomePage() {
  const noItems = useStore(state => selectAllItems(state).length === 0)

  if (noItems) {
    return <Welcome />
  }

  return (
    <div>
      <PageHeader title='Dashboard' />
    </div>
  )
}
