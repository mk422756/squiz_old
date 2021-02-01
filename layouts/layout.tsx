import Header from 'components/Header'
import AppSidebar from 'components/Sidebar'
import Footer from 'components/Footer'
import styles from 'styles/Default.module.css'
import Sidebar from 'react-sidebar'
import {useState} from 'react'

function Layout({children}: any) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const onSetSidebarOpen = (open: boolean) => {
    setSidebarOpen(open)
  }

  const openSidebar = () => {
    setSidebarOpen(true)
  }

  return (
    <Sidebar
      sidebar={<AppSidebar></AppSidebar>}
      open={sidebarOpen}
      onSetOpen={onSetSidebarOpen}
      pullRight={true}
      sidebarClassName="w-64 bg-white"
      contentClassName="overflow-y-scroll "
    >
      <div className="flex flex-col h-screen justify-between">
        <div className="mb-auto">
          <Header openSidebar={openSidebar} />
          <div className={styles.default}>{children}</div>
        </div>

        <div className="mt-16">
          <Footer></Footer>
        </div>
      </div>
    </Sidebar>
  )
}

export default Layout
