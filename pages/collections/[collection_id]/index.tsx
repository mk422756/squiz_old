import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {getCollection, getCollections} from 'clients/collection'
import {useCollection} from 'hooks/collection'
import {getSections, createSection} from 'clients/section'
import {getUser} from 'clients/user'
import {getCurrentUser} from 'clients/auth'
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import {faTwitter} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {dateToYYYYMMDD} from 'utils/dateUtils'
import Modal from 'react-modal'
import Button from 'components/Button'
import SectionTile from 'components/SectionTile'
import {TwitterShareButton} from 'react-twitter-embed'
import {GetStaticProps, InferGetStaticPropsType} from 'next'
import Head from 'next/head'

const NewSectonModal = ({
  modalIsOpen,
  closeModal,
  collectionId,
  reloadSections,
}) => {
  Modal.setAppElement('#modal')

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

  const onTitleChanged = (event) => {
    setTitle(event.target.value)
  }

  const submit = async () => {
    const currentUser = getCurrentUser()
    if (!currentUser.uid) {
      alert('エラーが発生しました。もう一度やり直してください')
      return
    }
    await createSection(title, collectionId, currentUser.uid)
    closeModal()
    await reloadSections()
  }

  return (
    <div>
      <Modal
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
      </Modal>
    </div>
  )
}

export default function CollectionPage({
  collection,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  if (router.isFallback) {
    return <h1>Loading...</h1>
  }
  const {collection_id} = router.query
  const [isMyCollection, setIsMyCollection] = useState(false)
  // const collection = useCollection(collection_id as string)
  const [sections, setSections] = useState([])
  const [user, setUser] = useState({} as any)

  const [modalIsOpen, setIsOpen] = useState(false)
  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  useEffect(() => {
    let unmounted = false
    ;(async () => {
      const [collection, sections] = await Promise.all([
        getCollection(collection_id as string),
        getSections(collection_id as string),
      ])
      const currentUser = getCurrentUser()
      if (!unmounted) {
        setSections(sections)
        if (collection.creatorId === currentUser?.uid) {
          setIsMyCollection(true)
        }
      }
      if (!collection?.creatorId) {
        return
      }
      const user = await getUser(collection.creatorId)
      if (!unmounted) {
        setUser(user)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [collection_id])

  async function reloadSections() {
    const sections = await getSections(collection_id as string)
    setSections(sections)
  }

  return (
    <>
      <Head>
        <title>SQUIZ</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={collection.title} />
        <meta
          property="og:description"
          content="SQUIZは新しい学習プラットフォームです"
        />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:url" content="https://squiz.vercel.app" />
        <meta property="og:site_name" content="squiz" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://squiz.vercel.app" />
        <meta name="twitter:title" content="squiz" />
        <link rel="canonical" href="https://squiz.vercel.app" />
      </Head>
      <Layout>
        <main>
          {collection.imageUrl && (
            <div>
              <img
                className="object-cover h-40 w-full"
                src={collection.imageUrl}
                alt="問題集イメージ"
              />
            </div>
          )}
          <div className="p-4 bg-white">
            <h1 className="text-2xl font-semibold break-words">
              {collection.title}
            </h1>
            <div className="pt-4 text-primary break-words">
              {collection.tags.map((tag, index) => {
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
            <pre className="pt-4">{collection.description}</pre>
            <div className="pt-4 text-sm font-semibold">
              合計 {collection.quizCount} 問
            </div>
            <div className="text-xs text-gray-500">
              最終更新日 {dateToYYYYMMDD(collection.updatedAt)}
            </div>
            <div className="pt-4">
              {/* <span className="inline-block h-5 w-5 align-middle">
              <FontAwesomeIcon icon={faHeart} color="gray" className="fa-lg" />
            </span>
            <span className="ml-1 align-middle text-sm text-gray-500">
              お気に入り
            </span> */}
              <span className="inline-block align-bottom">
                <TwitterShareButton
                  key={collection.id}
                  url={`${location.protocol}//${location.host}${location.pathname}`}
                  options={{text: `#squiz ${collection.title}`, size: 'large'}}
                />
              </span>
            </div>

            <div className="pt-4">
              <Link href={`/users/${user.id}`}>
                <a>
                  <img
                    className="inline-block h-6 w-6 rounded-full bg-white"
                    src={user.imageUrl}
                  />
                  <span className="ml-1 text-sm font-semibold">
                    {user.name}
                  </span>
                </a>
              </Link>
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
                      if (window.confirm('This will be deleted')) {
                        // TODO 削除処理
                        router.push('/collections')
                      }
                    }}
                  >
                    削除
                  </button>
                  <a
                    className="mx-2 underline text-gray-400"
                    onClick={openModal}
                  >
                    セクション作成
                  </a>

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
          <div>
            <ul className="mt-2">
              {sections.map((section) => (
                <li key={section.id} className="mt-1">
                  <SectionTile section={section} isMySection={isMyCollection} />
                </li>
              ))}
            </ul>
          </div>
        </main>
      </Layout>
    </>
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

export const getStaticProps: GetStaticProps = async (context) => {
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
