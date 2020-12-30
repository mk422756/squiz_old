import Head from 'next/head'
function LayoutQuiz({children}) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="md:w-3/5 mx-auto">{children}</div>
    </div>
  )
}

export default LayoutQuiz
