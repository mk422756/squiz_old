import {useState, useEffect} from 'react'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {getRecordsByYearMonth} from 'clients/record'
import {connect} from 'react-redux'
import {Record} from 'models/record'
import RecordChart from 'components/RecordChart'
import DatePicker, {registerLocale} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ja from 'date-fns/locale/ja'
registerLocale('ja', ja)

function RecordsPage({userState}) {
  const [records, setRecords] = useState<Record[]>([])
  const [startDate, setStartDate] = useState(new Date())

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      if (!userState.uid && !startDate) {
        return
      }
      const records = await getRecordsByYearMonth(userState.uid, startDate)
      if (!unmounted) {
        setRecords(records)
        records
      }
    })()

    return () => {
      unmounted = true
    }
  }, [userState, startDate])

  return (
    <Layout>
      <main>
        <div className="p-4 bg-white text-center text-lg font-semibold">
          学習記録
        </div>
        <div className="p-4 bg-white">
          <Link href={`/users/${userState.uid}/histories`}>
            <a className="text-blue-400">履歴へ</a>
          </Link>
        </div>
        <div className="bg-white mt-2 p-4">
          <div className="border shadow-sm inline-block p-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="▼ yyyy年M月"
              locale="ja"
              showMonthYearPicker
            />
          </div>
        </div>
        <div>
          <RecordChart records={records} />
        </div>
      </main>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  return {userState: state}
}

export default connect(mapStateToProps)(RecordsPage)
