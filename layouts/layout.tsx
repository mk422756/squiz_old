import Head from 'next/head'
import Header from 'components/Header'
import styles from 'styles/Default.module.css'

function Layout({children}) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.default}>{children}</div>
    </div>
  )
}

export default Layout
