import {useState, useEffect} from 'react'
import Link from 'next/link'
import Layout from 'layouts/layout'
import {getRecords} from 'clients/record'
import {connect} from 'react-redux'
import {Record} from 'models/record'
import RecordChart from 'components/RecordChart'

function RecordsPage({userState}) {
  const [records, setRecords] = useState<Record[]>([])

  useEffect(() => {
    let unmounted = false

    ;(async () => {
      const records = await getRecords(userState.uid)
      if (!unmounted) {
        setRecords(records)
        records
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
        <p className="p-4 bg-white">
          <Link href={`/users/${userState.uid}/histories`}>
            <a className="text-blue-400">履歴へ</a>
          </Link>
        </p>
        <div className="mt-2 py-4">
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
