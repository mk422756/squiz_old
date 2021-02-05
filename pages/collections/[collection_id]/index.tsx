import {useState} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {Collection} from 'models/collection'
import {getCollection, getCollections} from 'clients/collection'
import {useSections} from 'hooks/section'
import {useUser} from 'hooks/user'
import {createSection} from 'clients/section'
import {getCurrentUser} from 'clients/auth'
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import {faTwitter} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {dateToYYYYMMDD} from 'utils/dateUtils'
import ReactModal from 'react-modal'
import Button from 'components/Button'
import SectionTile from 'components/SectionTile'
import {TwitterShareButton} from 'react-twitter-embed'
import {GetStaticProps} from 'next'
import {isBrowser} from 'utils/browser'
import Linkify from 'react-linkify'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import {purchasedCollectionsInfoState} from 'store/purchasedCollectionsInfoState'
import {userIsLoginState, userState} from 'store/userState'
import {loginInfoState} from 'store/loginInfoState'

const NewSectonModal = ({
  modalIsOpen,
  closeModal,
  collectionId,
  reloadSections,
}: any) => {
  document &&
    document.getElementById('modal') &&
    ReactModal.setAppElement('#modal')

  const [title, setTitle] = useState('')
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      bottom: 'auto',
      right: '10%',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  }

  const onTitleChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  const submit = async () => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      alert('エラーが発生しました。もう一度やり直してください')
      return
    }
    await createSection(title, collectionId, currentUser.uid)
    closeModal()
    await reloadSections()
  }

  return (
    <div>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="w-full">
          <h2 className="text-2xl font-semibold">セクション作成</h2>
          <div className="mt-4">
            <input
              type="text"
              placeholder="セクション名"
              className="p-2 border w-full"
              onChange={onTitleChanged}
            />
          </div>
          <div className="mt-4">
            <Button onClick={submit}>作成</Button>
            <span className="ml-2">
              <Button color="gray" onClick={closeModal}>
                キャンセル
              </Button>
            </span>
          </div>
        </div>
      </ReactModal>
    </div>
  )
}

interface StaticIndexProps {
  collection: Collection | null
}

export default function CollectionPage({collection}: StaticIndexProps) {
  const router = useRouter()
  if (router.isFallback || !collection) {
    return <h1>Loading...</h1>
  }

  const {collection_id} = router.query
  const [sections, reloadSections] = useSections(collection_id as string)
  const creator = useUser(collection.creatorId)
  const user = useRecoilValue(userState)

  const isMyCollection = collection.creatorId === user?.id

  const setLoginInfoState = useSetRecoilState(loginInfoState)
  const isLogin = useRecoilValue(userIsLoginState)
  const purchasedCollectionsInfo = useRecoilValue(purchasedCollectionsInfoState)
  const purchasedCollectionInfo = purchasedCollectionsInfo.find(
    (info) => info.collectionId === collection_id
  )

  const [modalIsOpen, setIsOpen] = useState(false)
  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  function goPurchasePage() {
    if (isLogin) {
      router.push(`/collections/${collection_id}/purchase`)
    } else {
      setLoginInfoState({
        urlAfterLogin: `/collections/${collection_id}/purchase`,
      })
      router.push(`/login`)
    }
  }

  return (
    <Layout>
      <main>
        {collection.imageUrl && (
          <div>
            <img
              className="object-cover max-h-60 w-full"
              src={collection.imageUrl}
              alt="問題集イメージ"
            />
          </div>
        )}
        <div className="p-4 bg-white">
          <h1 className="pt-4 text-2xl font-semibold break-words">
            {collection.title}
          </h1>
          <Linkify
            properties={{
              target: '_blank',
              style: {color: 'blue'},
            }}
          >
            <pre className="pt-8 whitespace-pre-wrap">
              {collection.description}
            </pre>
          </Linkify>

          <div className="pt-4 text-sm font-semibold">
            合計 {collection.quizCount} 問
          </div>
          <div className="text-xs text-gray-500">
            最終更新日 {dateToYYYYMMDD(collection.updatedAt)}
          </div>
          <div className="pt-4">
            <Link href={`/users/${creator.id}`}>
              <a>
                <img
                  className="inline-block h-6 w-6 rounded-full bg-white"
                  src={creator.imageUrl ? creator.imageUrl : '/user_avatar.png'}
                />
                <span className="ml-1 text-sm font-semibold">
                  {creator.name}
                </span>
              </a>
            </Link>
          </div>
          <div className="pt-4 text-primary break-words">
            {collection.tags.map((tag: string, index: number) => {
              return (
                <span key={index}>
                  <Link href={`/tags/${tag}`}>
                    <a>
                      <span>#{tag}</span>
                      <span className="ml-1" />
                    </a>
                  </Link>
                </span>
              )
            })}
          </div>
          <div className="pt-4">
            {/* <span className="inline-block h-5 w-5 align-middle">
              <FontAwesomeIcon icon={faHeart} color="gray" className="fa-lg" />
            </span>
            <span className="ml-1 align-middle text-sm text-gray-500">
              お気に入り
            </span> */}
            <span className="inline-block align-bottom">
              {isBrowser() && (
                <TwitterShareButton
                  key={collection.id}
                  url={`${location.protocol}//${location.host}${location.pathname}`}
                  options={{
                    text: `#squiz ${collection.title}`,
                    size: 'large',
                  }}
                />
              )}
            </span>
          </div>

          {isMyCollection && (
            <div className="pt-4">
              <div>
                <span className="text-gray-400">公開状況:</span>
                <span className="text-red-400 ml-1">
                  {collection.isPublic ? '公開' : '非公開'}
                </span>
              </div>
              <div className="mt-1">
                <Link href={`/collections/${collection.id}/edit`}>
                  <a className="underline text-gray-400">編集</a>
                </Link>
                <button
                  type="button"
                  className="mx-2 underline text-gray-400"
                  onClick={async () => {
                    if (confirm('This will be deleted')) {
                      // TODO 削除処理
                      router.push('/collections')
                    }
                  }}
                >
                  削除
                </button>
                <a className="mx-2 underline text-gray-400" onClick={openModal}>
                  セクション作成
                </a>
                {/* 
                <ReactModal
                  isOpen={modalIsOpen}
                  contentLabel="Minimal Modal Example"
                >
                  <button onClick={closeModal}>Close Modal</button>
                </ReactModal> */}

                <NewSectonModal
                  modalIsOpen={modalIsOpen}
                  closeModal={closeModal}
                  collectionId={collection_id}
                  reloadSections={reloadSections}
                ></NewSectonModal>
              </div>
            </div>
          )}
          <div id="modal"></div>
        </div>
        {collection.needPayment && (
          <div className="mt-2 p-4 bg-white">
            {purchasedCollectionInfo ? (
              <div>
                <p className="font-semibold">購入済み</p>
                <p className="text-xs text-gray-500">
                  購入日 {dateToYYYYMMDD(purchasedCollectionInfo.purchasedAt)}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-3 text-2xl font-semibold">
                  <span>価格: {collection.price}円</span>
                </div>

                <Button fullWidth={true} onClick={goPurchasePage}>
                  購入
                </Button>
              </>
            )}
          </div>
        )}
        <div>
          <ul className="mt-2">
            {sections.map((section) => (
              <li key={section.id} className="mt-1">
                <SectionTile
                  section={section}
                  isMySection={isMyCollection}
                  needPayment={collection.needPayment}
                  parchased={!!purchasedCollectionInfo}
                />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </Layout>
  )
}

export async function getStaticPaths() {
  const collections = await getCollections()
  const paths = collections.map((collection) => {
    return {params: {collection_id: collection.id}}
  })
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (context: any) => {
  const collectionId = context.params.collection_id
  const collection = await getCollection(collectionId as string)
  // const [collection, sections] = await Promise.all([
  //   getCollection(collectionId as string),
  //   getSections(collectionId as string),
  // ])
  return {
    props: {
      collection,
    },
  }
}
