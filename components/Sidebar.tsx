import Link from 'next/link'
import {connect} from 'react-redux'
import {logout} from 'clients/auth'
import {logout as storeLogout} from 'store/user'
import {useRouter} from 'next/router'

export function AppSidebar({userState, storeLogout}) {
  const router = useRouter()

  const handleLogout = () => {
    logout()
    storeLogout()
    router.push('/')
  }

  if (!userState.isLogin || !userState.user) {
    return null
  }

  return (
    <div>
      <div className="p-4">
        <span>
          <img
            className="inline-block h-8 w-8 rounded-full bg-white"
            src={userState.user.imageUrl}
          />
          <span className="ml-2">{userState.user.name}</span>
        </span>
      </div>
      <hr></hr>
      <div className="p-4">
        <p className="my-4 font-semibold">
          <Link href={`/users/${userState.uid}`}>
            <a>マイページ</a>
          </Link>
        </p>
        <hr></hr>
        <p className="my-4 font-semibold">
          <span onClick={handleLogout}>ログアウト</span>
        </p>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {userState: state}
}

const mapDispatchToProps = (dispatch) => {
  return {storeLogout: () => dispatch(storeLogout())}
}

export default connect(mapStateToProps, mapDispatchToProps)(AppSidebar)
