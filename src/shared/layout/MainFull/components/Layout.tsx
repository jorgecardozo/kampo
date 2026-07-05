import { useState } from 'react'
import ContentWrapper from './ContentWrapper'
import { NavBarTop } from './NavBarTop'
import Sidebar from './SidebarNew'
import NavBarMobile from './NavBarMobile'
// import { NavBarTop } from 'components/NavBarTop'

const Layout = ({ component: Component, children, withPadding = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <>
      {/* NavBar para móvil */}
      <NavBarMobile isOpen={isMobileNavOpen} setIsOpen={setIsMobileNavOpen} />

      <div className='relative flex h-screen flex-col overflow-hidden bg-main-50 dark:bg-gray-900'>
        {/* La sidebar se abre al pasar el mouse por encima y se cierra al salir.
            Sin overlay/blur: el contenido queda visible al costado. */}
        <div
          className='fixed h-full z-50 hidden md:block'
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <div className="w-full h-full flex flex-col md:pl-[105px] px-3 sm:px-6 pt-20 md:pt-7 pb-4 sm:pb-7 bg-main-50 dark:bg-gray-900 overflow-hidden">
          {children ?? (Component ? <Component /> : null)}
        </div>
      </div>
    </>
  )
}

export default Layout
