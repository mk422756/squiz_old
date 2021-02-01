import Link from 'next/link'
import Layout from 'layouts/layout'
import HistoryTile from 'components/HistoryTile'
import {useRecoilValue} from 'recoil'
import {userState, userIsLoginState} from 'store/userState'
import {useHistories} from 'hooks/history'

export default function HistoriesPage() {
  const user = useRecoilValue(userState)
  const isLogin = useRecoilValue(userIsLoginState)

  if (!user) {
    return <div>now loading</div>
  }

  const histories = useHistories(user.id)

  return (
    <Layout>
      <main>
        <div className="p-4 bg-white text-center text-lg font-semibold">
          履歴
        </div>
        {isLogin && (
          <p className="p-4 bg-white">
            <Link href={`/users/${user.id}/records`}>
              <a className="text-blue-400">学習記録へ</a>
            </Link>
          </p>
        )}
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
