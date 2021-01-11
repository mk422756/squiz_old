import '../styles/globals.css'
import '../lib/firebase'
import {Provider} from 'react-redux'
import {setupStore} from 'store/user'
// import {persistStore} from 'redux-persist'

const store = setupStore()

// let persistor = persistStore(store)

function MyApp({Component, pageProps}) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
