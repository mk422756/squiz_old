import Head from 'next/head'
import Header from 'components/Header'
import AppSidebar from 'components/Sidebar'
import styles from 'styles/Default.module.css'
import Sidebar from 'react-sidebar'
import {useState} from 'react'

function Layout({children}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const onSetSidebarOpen = (open) => {
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
      sidebarClassName="w-64"
      styles={{sidebar: {background: 'white'}}}
    >
      <Header openSidebar={openSidebar} />
      <div className={styles.default}>{children}</div>
    </Sidebar>
  )
}

export default Layout
