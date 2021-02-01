import {useState} from 'react'
import Layout from 'layouts/layout'
import Link from 'next/link'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {useUser} from 'hooks/user'
import {faTwitter, faFacebookSquare} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import CollectionTile from 'components/CollectionTile'
import Linkify from 'react-linkify'
import {useRecoilValue} from 'recoil'
import {userState} from 'store/userState'
import {useCollectionsByUserId} from 'hooks/collection'

enum SELECT_TYPE {
  DESCRIPTION = 'description',
  COLLECTIONS = 'collections',
}

export default function UserPage() {
  const currentUser = useRecoilValue(userState)

  const [selectedDisplayType, setSelectedDisplayType] = useState(
    SELECT_TYPE.DESCRIPTION
  )
  const router = useRouter()
  const {uid} = router.query
  const userId = uid ? (uid as string) : ''
  const user = useUser(userId)
  const collections = useCollectionsByUserId(userId)

  const isMyPage = user.id === currentUser?.id

  if (!user) {
    return <div>now loading</div>
  }

  const selectDisplayType = (event: any) => {
    const id: string = event.target.id
    switch (id) {
      case SELECT_TYPE.COLLECTIONS:
        setSelectedDisplayType(SELECT_TYPE.COLLECTIONS)
        break
      case SELECT_TYPE.DESCRIPTION:
        setSelectedDisplayType(SELECT_TYPE.DESCRIPTION)
        break
    }
  }

  return (
    <Layout>
      <main>
        <div className="bg-white">
          <div className="p-4 flow-root">
            <div className="h-16 w-16 float-left mt-2">
              <Image
                className="rounded-full bg-white"
                width="60"
                height="60"
                src={user.imageUrl ? user.imageUrl : '/user_avatar.png'}
                alt="ユーザーイメージ"
              />
            </div>
            <div className="float-left ml-4 mt-2 w-9/12">
              <p className="font-semibold">{user?.name}</p>
              {user.twitterId && (
                <span className="inline-block h-5 w-5 align-middle">
                  <a
                    href={`https://twitter.com/${user.twitterId}`}
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      icon={faTwitter}
                      color="gray"
                      className="fa-lg"
                    />
                  </a>
                </span>
              )}
              {user.facebookId && (
                <span className="inline-block h-5 w-5 align-middle ml-2">
                  <a
                    href={`https://www.facebook.com/${user.facebookId}`}
                    target="_blank"
                  >
                    <FontAwesomeIcon
                      icon={faFacebookSquare}
                      color="gray"
                      className="fa-lg"
                    />
                  </a>
                </span>
              )}
            </div>
          </div>
          {isMyPage && (
            <div className="px-4 py-6 text-blue-400">
              <Link href={`${uid}/edit`}>
                <a>アカウント設定</a>
              </Link>
              <span className="ml-3">
                <Link href={`${uid}/create_collection`}>
                  <a>問題集作成</a>
                </Link>
              </span>
            </div>
          )}
        </div>
        <div className="p-4 bg-white mt-1">
          <p
            className={
              selectedDisplayType === SELECT_TYPE.DESCRIPTION
                ? 'inline-block font-semibold border-b-2 border-black'
                : 'inline-block'
            }
            id="description"
            onClick={selectDisplayType}
          >
            自己紹介
          </p>
          <p
            className={
              selectedDisplayType === SELECT_TYPE.COLLECTIONS
                ? 'inline-block font-semibold ml-4 border-b-2 border-black'
                : 'inline-block ml-4'
            }
            id="collections"
            onClick={selectDisplayType}
          >
            問題集
          </p>
        </div>
        <div>
          {selectedDisplayType === SELECT_TYPE.DESCRIPTION ? (
            <Linkify
              properties={{
                target: '_blank',
                style: {color: 'blue'},
              }}
            >
              <pre className="p-4 mt-1 bg-white whitespace-pre-wrap">
                {user.description}
              </pre>
            </Linkify>
          ) : (
            <div>
              {collections.map((collection) => {
                return (
                  <div className="mt-1" key={collection.id}>
                    <CollectionTile
                      key={collection.id}
                      collection={collection}
                    ></CollectionTile>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}
