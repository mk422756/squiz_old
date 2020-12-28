import Head from 'next/head'
import Header from 'components/Header'
function Layout({children}) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {children}
    </div>
  )
}

export default Layout
