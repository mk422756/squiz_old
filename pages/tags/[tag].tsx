import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Layout from 'layouts/layout'
import CollectionTile from 'components/CollectionTile'
import {getCollectionsByTag} from 'clients/collection'
import {Collection} from 'models/collection'

export default function Home() {
  const [collections, setCollections] = useState<Collection[]>([])

  const router = useRouter()
  const {tag} = router.query

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      if (!tag) {
        return
      }
      const collections = await getCollectionsByTag(tag as string)
      if (!unmounted) {
        setCollections(collections)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [tag])
  return (
    <Layout>
      <main>
        <p className="text-lg font-semibold p-4 bg-white">#{tag}</p>
        <div className="mt-2">
          {collections.map((collection) => {
            return (
              <div className="mt-1">
                <CollectionTile
                  key={collection.id}
                  collection={collection}
                ></CollectionTile>
              </div>
            )
          })}
        </div>
      </main>
    </Layout>
  )
}
