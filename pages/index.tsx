import {useState, useEffect} from 'react'
import Layout from 'layouts/layout'
import {getCollections} from 'clients/collection'
import CollectionTile from 'components/CollectionTile'

export default function Home() {
  const [collections, setCollections] = useState([])
  useEffect(() => {
    let unmounted = false

    ;(async () => {
      const collections = await getCollections()
      if (!unmounted) {
        setCollections(collections)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [])
  return (
    <Layout>
      <main>
        {collections.map((collection) => {
          return (
            <CollectionTile
              key={collection.id}
              collection={collection}
            ></CollectionTile>
          )
        })}
      </main>
    </Layout>
  )
}
