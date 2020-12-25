import Head from 'next/head'
import Header from 'components/Header'
function Layout({children}) {
  return (
    <div className="bg-gray-100 h-screen">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div>{children}</div>
    </div>
  )
}

export default Layout
