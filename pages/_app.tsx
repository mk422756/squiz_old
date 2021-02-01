import 'styles/globals.css'
import 'lib/firebase'
import {RecoilRoot} from 'recoil'
import FirebaseAuthRoot from 'components/FirebaseAuthRoot'

function MyApp({Component, pageProps}: any) {
  return (
    <RecoilRoot>
      <FirebaseAuthRoot>
        <Component {...pageProps} />
      </FirebaseAuthRoot>
    </RecoilRoot>
  )
}

export default MyApp
