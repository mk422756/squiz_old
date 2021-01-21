import '../styles/globals.css'
import '../lib/firebase'
import {Provider} from 'react-redux'
import {setupStore} from 'store/user'
import {persistStore} from 'redux-persist'
import {PersistGate} from 'redux-persist/integration/react'
import {RecoilRoot} from 'recoil'
import FirebaseAuthRoot from 'components/FirebaseAuthRoot'
const store = setupStore()

let persistor = persistStore(store)

function MyApp({Component, pageProps}) {
  return (
    <RecoilRoot>
      <FirebaseAuthRoot>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Component {...pageProps} />
          </PersistGate>
        </Provider>
      </FirebaseAuthRoot>
    </RecoilRoot>
  )
}

export default MyApp
