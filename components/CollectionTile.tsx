import Link from 'next/link'
import {Collection} from 'models/collection'
import {useState, useEffect} from 'react'
import {getUser} from 'clients/user'

type Props = {
  collection: Collection
}

const CollectionTile = ({collection}: Props) => {
  const [user, setUser] = useState({name: ''})
  useEffect(() => {
    let unmounted = false

    ;(async () => {
      const user = await getUser(collection.creatorId)
      if (!unmounted) {
        setUser(user)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [])
  return (
    <div className="bg-white p-4">
      <div className="flex justify-between">
        <div className="break-normal">
          <Link href={`/collections/${collection.id}`}>
            <span className="text-xl font-semibold break-all">
              {collection.title}
            </span>
          </Link>
        </div>
        <div>
          <Link href={`/collections/${collection.id}`}>
            <img
              className="object-cover w-16 h-16"
              src="https://picsum.photos/300/100"
              alt="問題集イメージ"
            />
          </Link>
        </div>
      </div>
      <div>
        {/* TODO 問題集の合計問題数を取得 */}
        <span className="font-semibold">{100}問</span>
        <span className="pl-4 font-light">
          <Link href={`/users/${collection.creatorId}`}>
            <a>{user.name}</a>
          </Link>
        </span>
      </div>
    </div>
  )
}

export default CollectionTile
