import Head from 'next/head'
import Header from 'components/Header'
function Layout({children}) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div>{children}</div>
    </>
  )
}

export default Layout
