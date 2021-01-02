import '../styles/globals.css'
import '../lib/firebase'
import {Provider} from 'react-redux'
import {setupStore} from 'store/user'

const store = setupStore()

function MyApp({Component, pageProps}) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
