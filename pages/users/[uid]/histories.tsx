import {useState, useEffect} from 'react'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {getHistoriesByUserId} from 'clients/history'
import {connect} from 'react-redux'
import {History} from 'models/history'
import HistoryTile from 'components/HistoryTile'

function HistoriesPage({userState}) {
  const [histories, setHistories] = useState<History[]>([])

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      const histories = await getHistoriesByUserId(userState.uid)
      if (!unmounted) {
        setHistories(histories)
      }
    })()

    return () => {
      unmounted = true
    }
  }, [userState])

  return (
    <Layout>
      <main>
        <div className="p-4 bg-white text-center text-lg font-semibold">
          履歴
        </div>
        <p className="p-4 bg-white">
          <Link href={`/users/${userState.uid}/records`}>
            <a className="text-blue-400">学習記録へ</a>
          </Link>
        </p>
        {histories.map((history) => {
          return (
            <div key={history.id} className="mt-1">
              <HistoryTile history={history}></HistoryTile>
            </div>
          )
        })}
      </main>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  return {userState: state}
}

export default connect(mapStateToProps)(HistoriesPage)
