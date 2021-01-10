import Head from 'next/head'
import styles from 'styles/Default.module.css'

function LayoutQuiz({children}) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.default}>{children}</div>
    </div>
  )
}

export default LayoutQuiz
