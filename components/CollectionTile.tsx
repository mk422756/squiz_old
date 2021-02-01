import Link from 'next/link'
import Image from 'next/image'
import {Collection} from 'models/collection'
import {useUser} from 'hooks/user'

type Props = {
  collection: Collection
}

const CollectionTile = ({collection}: Props) => {
  const user = useUser(collection.creatorId)

  return (
    <div className="bg-white p-4">
      <div className="flex justify-between">
        <div className="break-normal mr-2 w-full">
          <div>
            <Link href={`/collections/${collection.id}`}>
              <span className="text-lg font-semibold break-all">
                {collection.title}
              </span>
            </Link>
          </div>
          <div>
            <span className="font-semibold text-sm">
              {collection.quizCount}問
            </span>
            <span className="pl-4 text-gray-400 text-xs">
              <Link href={`/users/${collection.creatorId}`}>
                <a>{user.name}</a>
              </Link>
            </span>
          </div>
        </div>
        {collection.imageUrl && (
          <div className="h-20 w-32 relative">
            <Link href={`/collections/${collection.id}`}>
              <a>
                <Image
                  src={collection.imageUrl}
                  alt="問題集イメージ"
                  layout="fill"
                  objectFit="cover"
                />
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionTile
