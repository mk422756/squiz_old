import {useState, useEffect} from 'react'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {getRecordsByYearMonth} from 'clients/record'
import {Record} from 'models/record'
import RecordChart from 'components/RecordChart'
import DatePicker, {registerLocale} from 'react-datepicker'
import {useRecoilValue} from 'recoil'
import {userState, userIsLoginState} from 'store/userState'
import 'react-datepicker/dist/react-datepicker.css'
import ja from 'date-fns/locale/ja'

registerLocale('ja', ja)

export default function RecordsPage() {
  const user = useRecoilValue(userState)
  const isLogin = useRecoilValue(userIsLoginState)
  const [records, setRecords] = useState<Record[]>([])
  const [startDate, setStartDate] = useState<Date>(new Date())

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      if (!user || !startDate) {
        return
      }
      const records = await getRecordsByYearMonth(user.id, startDate)
      if (!unmounted) {
        setRecords(records)
        records
      }
    })()

    return () => {
      unmounted = true
    }
  }, [user, startDate])

  const onChangeDate = (date: Date) => {
    setStartDate(date)
  }

  return (
    <Layout>
      <main>
        <div className="p-4 bg-white text-center text-lg font-semibold">
          学習記録
        </div>
        <div className="p-4 bg-white">
          {isLogin && user && (
            <Link href={`/users/${user.id}/histories`}>
              <a className="text-blue-400">履歴へ</a>
            </Link>
          )}
        </div>
        <div className="bg-white mt-2 p-4">
          <div className="border shadow-sm inline-block p-2">
            <DatePicker
              selected={startDate}
              onChange={onChangeDate}
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
