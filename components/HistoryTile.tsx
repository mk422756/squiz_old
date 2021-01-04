import Link from 'next/link'
import {History} from 'models/history'

type Props = {
  history: History
}

const HistoryTile = ({history}: Props) => {
  return (
    <div className="bg-white p-4">
      <div className="break-normal">
        <Link href={`/collections/${history.collectionId}`}>
          <span className="text-xg font-semibold break-all">
            {history.collectionTitle} {history.sectionTitle}
          </span>
        </Link>
      </div>
    </div>
  )
}

export default HistoryTile
