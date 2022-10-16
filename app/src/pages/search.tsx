import { Input } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader } from '../features/layout'
import { getAllPossibleStatuses } from '../components/Status'
import { selectAllItems, useStore } from '../data/store'
import { Item } from '../data/types'
import { exists } from '../data/util'
import { ItemsTablePage } from '../features/items'
import { search } from '../features/search'

const allPossibleStatuses = getAllPossibleStatuses()

export default function SearchPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [items, setItems] = useState<Item[]>([])
  const allItems = useStore(state => state.items)

  const query = useMemo(
    () => new URLSearchParams(location.search).get('q') || '',
    [location.search]
  )

  useEffect(() => {
    if (query === '') {
      setItems(selectAllItems({ items: allItems }))
    } else {
      search(query).then(ids => {
        setItems(ids.map(id => allItems[id]).filter(exists))
      })
    }
  }, [query, setItems, allItems])

  return (
    <div>
      <PageHeader title="Search">
        <Input
          size="large"
          placeholder="Search..."
          value={query}
          onChange={e =>
            navigate(
              { search: new URLSearchParams({ q: e.target.value }).toString() },
              { replace: true }
            )
          }
        />
      </PageHeader>
      <ItemsTablePage
        id="search"
        items={items}
        possibleStatuses={allPossibleStatuses}
        defaultVisibleStatuses={null}
      ></ItemsTablePage>
    </div>
  )
}
