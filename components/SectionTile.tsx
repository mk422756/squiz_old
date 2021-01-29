import Link from 'next/link'
import {Section} from 'models/section'
import {dateToYYYYMMDD} from 'utils/dateUtils'
import {faPlay, faCog} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

type Props = {
  section: Section
  isMySection: boolean
  needPayment: boolean
  parchased: boolean
}

const SectionTile = ({section, isMySection, needPayment, parchased}: Props) => {
  const bgColor =
    section.isFree || !needPayment || parchased ? 'bg-white' : 'bg-gray-200'
  const showPlayButton =
    section.isFree ||
    (section.quizCount > 0 && !needPayment) ||
    (section.quizCount > 0 && needPayment && parchased)

  const showIsFree = needPayment && section.isFree && !parchased

  return (
    <div className={`border p-4 flex justify-between items-center ${bgColor}`}>
      <div className="w-4/6">
        {showIsFree && (
          <p>
            <span className="p-1 bg-primary rounded text-white text-xs">
              無料公開
            </span>
          </p>
        )}
        <p className="font-semibold">{section.title}</p>
        <p className="font-semibold text-sm">{section.quizCount}問</p>
        <p className="text-xs text-gray-400">
          更新日:{dateToYYYYMMDD(section.updatedAt)}
        </p>
      </div>
      <div className="w-2/6">
        {showPlayButton && (
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
