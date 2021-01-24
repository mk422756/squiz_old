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
      <div className="w-4/6">
        <p className="font-semibold">{section.title}</p>
        <p className="font-semibold text-sm">{section.quizCount}問</p>
        <p className="text-xs text-gray-400">
          更新日:{dateToYYYYMMDD(section.updatedAt)}
        </p>
      </div>
      <div className="w-2/6">
        {section.quizCount > 0 && (
          <Link
            href={`/collections/${section.collectionId}/sections/${section.id}/play`}
          >
            <a className="bg-primary p-3 rounded shadow inline-block ml-2 text-center w-12 h-12 float-right">
              <FontAwesomeIcon icon={faPlay} color="white" size="2x" />
            </a>
          </Link>
        )}
        {isMySection && (
          <Link
            href={`/collections/${section.collectionId}/sections/${section.id}`}
          >
            <a className="bg-gray-400 p-3 rounded shadow inline-block w-12 h-12 float-right">
              <FontAwesomeIcon icon={faCog} color="white" size="2x" />
            </a>
          </Link>
        )}
      </div>
    </div>
  )
}

export default SectionTile
