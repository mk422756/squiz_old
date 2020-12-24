import Header from '../components/header'

function Layout({children}) {
  return (
    <>
      <Header />
      <div>{children}</div>
    </>
  )
}

export default Layout
