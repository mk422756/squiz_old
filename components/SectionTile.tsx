import Link from 'next/link'
import {Section} from 'models/section'
import {dateToYYYYMMDD} from 'utils/dateUtils'
import {faPlay, faCog} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

type Props = {
  section: Section
  isMySection: boolean
}

const SectionTile = ({section, isMySection}: Props) => {
  return (
    <div className="border p-4 flex justify-between items-center bg-white">
      <div>
        <p className="font-semibold">{section.title}</p>
        {/* TODO 問題数を取得する */}
        <p className="font-semibold text-sm">100問</p>
        <p className="text-xs text-gray-400">
          更新日:{dateToYYYYMMDD(section.updatedAt)}
        </p>
      </div>
      <div>
        {isMySection && (
          <Link
            href={`/collections/${section.collectionId}/sections/${section.id}/play`}
          >
            <div className="bg-gray-400 p-4 rounded shadow inline-block">
              <a className="inline-block h-6 w-6 align-bottom">
                <FontAwesomeIcon icon={faCog} color="white" />
              </a>
            </div>
          </Link>
        )}
        <Link
          href={`/collections/${section.collectionId}/sections/${section.id}/play`}
        >
          <div className="bg-primary p-4 rounded shadow inline-block ml-2">
            <a className="inline-block h-6 w-6 align-bottom">
              <FontAwesomeIcon icon={faPlay} color="white" />
            </a>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default SectionTile
