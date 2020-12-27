import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {getCollection} from 'clients/collection'
import {getSections, createSection} from 'clients/section'
import {getCurrentUser} from 'clients/auth'
import {faHeart} from '@fortawesome/free-solid-svg-icons'
import {faTwitter} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {dateToYYYYMMDD} from 'utils/dateUtils'
import Modal from 'react-modal'
import Button from 'components/Button'
import SectionTile from 'components/SectionTile'

Modal.setAppElement('#modal')

const NewSectonModal = ({modalIsOpen, closeModal, collectionId}) => {
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
    await createSection(title, collectionId)
    closeModal()
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

export default function CollectionPage() {
  const [isMyCollection, setIsMyCollection] = useState(false)
  const [collection, setCollection] = useState({
    id: '',
    title: '',
    description: '',
    updatedAt: new Date(),
  })
  const [sections, setSections] = useState([])
  const router = useRouter()
  const {collection_id} = router.query
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
      const collection = await getCollection(collection_id as string)
      const sections = await getSections(collection_id as string)
      const currentUser = getCurrentUser()
      if (!unmounted) {
        setCollection(collection)
        setSections(sections)
        if (collection.creatorId === currentUser?.uid) {
          setIsMyCollection(true)
        }
      }
    })()

    return () => {
      unmounted = true
    }
  }, [collection_id])

  return (
    <Layout>
      <main>
        <div>
          <img
            className="object-cover h-40 w-full"
            src="https://picsum.photos/300/100"
            alt="問題集イメージ"
          />
        </div>
        <div className="p-4 bg-white">
          <h1 className="text-2xl font-semibold">{collection.title}</h1>
          <div className="pt-4 text-primary">#tag1 #tag2</div>
          {/* TODO 説明文を実装する */}
          <pre className="pt-4">description</pre>
          {/* TODO 合計問題数を実装する */}
          <div className="pt-4 text-sm font-semibold">合計 100 問</div>
          <div className="text-xs text-gray-500">
            {/* TODO セクション更新の最新を取得する */}
            最終更新日 {dateToYYYYMMDD(collection.updatedAt)}
          </div>
          <div className="pt-4">
            <span className="inline-block h-5 w-5 align-middle">
              <FontAwesomeIcon icon={faHeart} color="gray" className="fa-lg" />
            </span>
            <span className="ml-1 align-middle text-sm text-gray-500">
              お気に入り
            </span>
            <span className="ml-4 inline-block h-5 w-5 align-middle">
              <FontAwesomeIcon
                icon={faTwitter}
                color="gray"
                className="fa-lg"
              />
            </span>
            <span className="ml-1 align-middle text-sm text-gray-500">
              ツイート
            </span>
          </div>

          {/* <div className="pt-4">
            <Link href={`/users/${user.id}`}>
              <a>
                <img
                  className="inline-block h-6 w-6 rounded-full bg-white"
                  src="/user_avatar.png"
                  alt="ユーザーイメージ"
                />
                <span className="ml-1 text-sm font-semibold">
                  userId{user.id}
                </span>
              </a>
            </Link>
          </div> */}

          {isMyCollection && (
            <div className="pt-4">
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
              {/* <Link href={`/collections/${collection.id}/sections/new`}>
                <a className="mx-2 underline text-gray-400">セクション作成</a>
              </Link> */}
              <a className="mx-2 underline text-gray-400" onClick={openModal}>
                セクション作成
              </a>

              <NewSectonModal
                modalIsOpen={modalIsOpen}
                closeModal={closeModal}
                collectionId={collection_id}
              ></NewSectonModal>
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
  )
}
