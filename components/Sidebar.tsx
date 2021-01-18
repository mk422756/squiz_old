import Link from 'next/link'
import {connect} from 'react-redux'

export function AppSidebar({userState}) {
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
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {userState: state}
}

export default connect(mapStateToProps)(AppSidebar)
