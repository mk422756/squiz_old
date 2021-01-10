import Head from 'next/head'
import Header from 'components/Header'
import styles from 'styles/Default.module.css'

function Layout({children}) {
  return (
    <div>
      <Head>
        <title>SQUIZ</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="SQUIZ" />
        <meta
          property="og:description"
          content="SQUIZは新しい学習プラットフォームです"
        />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:url" content="https://squiz.vercel.app" />
        <meta property="og:site_name" content="squiz" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://squiz.vercel.app" />
        <meta name="twitter:title" content="squiz" />
        <link rel="canonical" href="https://squiz.vercel.app" />
      </Head>
      <Header />
      <div className={styles.default}>{children}</div>
    </div>
  )
}

export default Layout
