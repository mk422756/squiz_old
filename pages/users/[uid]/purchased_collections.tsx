import Layout from 'layouts/layout'
import {useRecoilValue} from 'recoil'
import {userState} from 'store/userState'
import {usePurchasedCollections} from 'hooks/collection'
import CollectionTile from 'components/CollectionTile'
import {dateToYYYYMMDD} from 'utils/dateUtils'

export default function HistoriesPage() {
  const user = useRecoilValue(userState)

  if (!user) {
    return <div>now loading</div>
  }

  const collections = usePurchasedCollections(user.id)

  return (
    <Layout>
      <main>
        <div className="p-4 bg-white text-center text-lg font-semibold">
          購入済み問題集
        </div>
        <div className="mt-2">
          {collections.map((collection) => {
            return (
              <div className="mt-1" key={collection.collection.id}>
                <CollectionTile
                  collection={collection.collection}
                ></CollectionTile>
                <p className="bg-white px-4 pb-4 text-gray-400 text-sm">
                  購入日: {dateToYYYYMMDD(collection.purchasedAt)}
                </p>
              </div>
            )
          })}
        </div>
      </main>
    </Layout>
  )
}
