import {useState, useEffect} from 'react'
import Layout from 'layouts/layout'
import {getRecords} from 'clients/record'
import {connect} from 'react-redux'
import {Record} from 'models/record'
import HistoryTile from 'components/HistoryTile'

function RecordsPage({userState}) {
  const [records, setRecords] = useState<Record[]>([])

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      const records = await getRecords(userState.uid)
      if (!unmounted) {
        setRecords(records)
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
          学習記録
        </div>
        {records.map((record) => {
          return (
            <div key={record.date} className="mt-1">
              {record.answerCount}
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

export default connect(mapStateToProps)(RecordsPage)
