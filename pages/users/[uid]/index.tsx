import {useState, useEffect} from 'react'
import Layout from 'layouts/layout'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {getUser} from 'clients/user'
import {getCurrentUser, logout} from 'clients/auth'
import {getCollectionsByUserId} from 'clients/collection'
import {faTwitter, faFacebookSquare} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import CollectionTile from 'components/CollectionTile'
import {connect} from 'react-redux'
import {logout as storeLogout} from 'store/user'

enum SELECT_TYPE {
  DESCRIPTION = 'description',
  COLLECTIONS = 'collections',
}

function UserPage({storeLogout}) {
  const [user, setUser] = useState({} as any)
  const [collections, setCollections] = useState([])
  const [isMyPage, setIsMyPage] = useState(false)
  const [selectedDisplayType, setSelectedDisplayType] = useState(
    SELECT_TYPE.DESCRIPTION
  )
  const router = useRouter()
  const {uid} = router.query

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      if (!uid) {
        return
      }
      const user = await getUser(uid as string)
      const collections = await getCollectionsByUserId(uid as string)
      const currentUser = getCurrentUser()
      if (!unmounted) {
        setUser(user)
        setCollections(collections)
        if (user.id === currentUser?.uid) {
          setIsMyPage(true)
        }
      }
    })()

    return () => {
      unmounted = true
    }
  }, [uid])

  const handleLogout = () => {
    logout()
    storeLogout()
    router.push('/')
  }

  const selectDisplayType = (event) => {
    switch (event.target.id) {
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
              <img
                className="rounded-full bg-white"
                src={user.imageUrl}
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
              <button className="ml-3" onClick={handleLogout}>
                ログアウト
              </button>
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
            <pre className="p-4 mt-1 bg-white">{user.description}</pre>
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

const mapDispatchToProps = (dispatch) => {
  return {storeLogout: () => dispatch(storeLogout())}
}

export default connect(null, mapDispatchToProps)(UserPage)
