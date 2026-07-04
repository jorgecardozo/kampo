// Libraries
import { useRouter } from 'next/router'
import clsx from 'clsx'

// Components
import Image from 'next/image'
import { TextBody, TextHeadingH5 } from 'components/Text'

// Types
import { SidebarProps } from './Sidebar.types'

// Assets
import Hamburger from 'assets/images/hamburger.svg'
import Close from 'assets/icons/close.svg'
import Power from 'assets/images/power.svg'
import Simulation from 'assets/icons/simulation.svg'
import Dashboard from 'assets/icons/dashboard.svg'
import ChevronDown from 'assets/icons/chevron-down.svg'
// Utils
import { paths } from 'lib/utils/paths'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { COLORS, TABS } from 'lib/utils/constants'
import { ChevronIcon } from 'components/Icons/ChevronIcon'
import { HamburgerIcon } from 'components/Icons/HamburgerIcon'
import { AgricultureIcon } from 'components/Icons/AgricultureIcon'
import { PowerIcon } from 'components/Icons/PowerIcon'
import { CloseIcon } from 'components/Icons/CloseIcon'
import { useSession } from 'hooks/useSession'

const SidebarTemplate = ({
  isOpen,
  setIsOpen,
  className = '',
}: SidebarProps) => {
  const router = useRouter()
  // const { logout } = useSession()
  const [isJobsOpen, setIsJobsOpen] = useState(false)
  const sidebarRef = useRef(null)
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null)

  const { logout } = useSession()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const [openSubTabs, setOpenSubTabs] = useState({})
  const [openNestedSubTabs, setOpenNestedSubTabs] = useState({})

  const toggleSubTabs = (tabName) => {
    setOpenSubTabs((prev) => ({
      ...prev,
      [tabName]: !prev[tabName],
    }))
  }

  const toggleNestedSubTabs = (tabName) => {
    setOpenNestedSubTabs((prev) => ({
      ...prev,
      [tabName]: !prev[tabName],
    }))
  }

  const routerHandler = (path: string) => {
    router.push(path)
  }

  const handleClickOutside = (event) => {
    if (sidebarRef.current && sidebarRef.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  const handlerHover = (index) => {
    setHoveredMenuItem(index)
  }

  const handlerMouseLeave = () => {
    setHoveredMenuItem(null)
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const renderTabs = (tabs: any, depth = 0) => {
    return tabs.map((tab, index) => (
      <div key={`tab-${depth}-${index}`} className={`pl-${depth * 4}`}>
        {!tab.subTabs ? (
          <div className={`${!tab.subTabs ? 'pb-2' : ''}`}>
            <Link href={tab.path}>
              <div className="p-4 bg-sidebar-item-bg text-sidebar-item-text hover:text-sidebar-item-hover-text hover:bg-sidebar-item-hover-bg cursor-pointer rounded-lg font-bold">
                {tab.name}
              </div>
            </Link>
          </div>
        ) : (
          <>
            <div
              className={clsx(
                'p-4 flex justify-between items-center cursor-pointer rounded-lg',
                // tab.subTabs ? 'pt-' : '',
                openSubTabs[tab.name]
                  ? 'bg-sidebar-item-hover-bg text-sidebar-item-hover-text'
                  : 'bg-sidebar-item-bg text-sidebar-item-text hover:text-sidebar-item-hover-text hover:bg-sidebar-item-hover-bg'
              )}
              onClick={() => toggleSubTabs(tab.name)}
              onMouseEnter={() => handlerHover(`${index}-${depth}`)}
              onMouseLeave={handlerMouseLeave}
            >
              <TextBody className="font-bold">{tab.name}</TextBody>
              <ChevronIcon
                className={`transition-transform duration-300 text-red-300 ${
                  openSubTabs[tab.name] ? 'rotate-180 bg-white' : ''
                }`}
                fill={
                  openSubTabs[tab.name]
                    ? '#131313'
                    : hoveredMenuItem === `${index}-${depth}`
                    ? '#131313'
                    : '#FFFFFF'
                }
              />
            </div>
            <div
              className={clsx(
                'transition-all duration-300 ease-in overflow-y-hidden rounded-lg',
                tab.subTabs ? 'pt-2' : '',
                openSubTabs[tab.name]
                  ? 'max-h-[800px] opacity-100'
                  : 'max-h-0 opacity-0'
              )}
            >
              <div className="pl-4">{renderTabs(tab.subTabs, depth + 1)}</div>
            </div>
          </>
        )}
      </div>
    ))
  }

  return (
    // <div className={className}>
    //   <button
    //     onClick={toggleMenu}
    //     className="flex shrink-0 items-center justify-center"
    //     title="Menú"
    //   >
    //     <HamburgerIcon
    //       fill={COLORS['HamburgerIcon']}
    //       hoverFill={COLORS['HamburgerIconHover']}
    //     />
    //     <TextBody className="ml-2 hidden font-bold sm:flex">Menú</TextBody>
    //   </button>

    //   {isOpen && (
    //     <div
    //       className="fixed inset-0 z-30 bg-black backdrop-blur-[2px] left-[0px] bg-opacity-75 transition-all duration-900 ease-in-out"
    //       ref={sidebarRef}
    //     />
    //   )}

    //   <div
    //     className={clsx(
    //       'fixed left-0 top-0 z-40 flex h-screen w-80 flex-col justify-between bg-bright-turquoise-600 bg-opacity-70 backdrop-blur-[2px] px-8 py-5 text-black transition-all duration-300 ease-in',
    //       isOpen ? 'left-0' : 'left-[-320px]'
    //     )}
    //   >
    //     <div>
    //       <button
    //         onClick={toggleMenu}
    //         className="mb-4 flex items-center gap-2 p-1 text-sm font-bold"
    //       >
    //         <CloseIcon
    //           fill={COLORS['CloseIcon']}
    //           hoverFill={COLORS['CloseIconHover']}
    //           width={16}
    //           height={16}
    //           title="Cerrar"
    //         />
    //         <TextBody>Cerrar</TextBody>
    //       </button>

    //       <div className="flex gap-2 items-center justify-center mb-4">
    //         <AgricultureIcon
    //           className="rounded-xl p-2 border border-white"
    //           fill={COLORS['AgricultureIconInSideBar']}
    //         />

    //         <TextHeadingH5 className="text-white">Agri Math</TextHeadingH5>
    //       </div>

    //       {TABS.map((link, index) => (
    //         <div key={`tab-${index}`}>
    //           {!link.subTabs ? (
    //             <div className="pb-2">
    //               <Link href={link.path}>
    //                 <div className="p-4 bg-sidebar-item-bg text-sidebar-item-text hover:text-sidebar-item-hover-text hover:bg-sidebar-item-hover-bg cursor-pointer rounded-lg font-bold">
    //                   {link.name}
    //                 </div>
    //               </Link>
    //             </div>
    //           ) : (
    //             <div className="flex flex-col gap-y-2 pb-0">
    //               <div
    //                 className={clsx(
    //                   'p-4 hover:bg-white cursor-pointer flex justify-between items-center hover:text-black rounded-lg',
    //                   openSubTabs[link.name]
    //                     ? 'bg-sidebar-item-hover-bg text-sidebar-item-hover-text'
    //                     : 'bg-sidebar-item-bg',
    //                   openSubTabs[link.name] ? 'text-black' : 'text-white'
    //                 )}
    //                 onClick={() => toggleSubTabs(link.name)}
    //                 onMouseEnter={() => handlerHover(index)}
    //                 onMouseLeave={handlerMouseLeave}
    //               >
    //                 <TextBody className="font-bold">{link.name}</TextBody>
    //                 <ChevronIcon
    //                   className={`transition-transform duration-300 text-red-300 ${
    //                     openSubTabs[link.name] ? 'rotate-180 bg-white' : ''
    //                   }`}
    //                   fill={
    //                     openSubTabs[link.name]
    //                       ? '#131313'
    //                       : hoveredMenuItem === index
    //                       ? '#131313'
    //                       : '#FFFFFF'
    //                   }
    //                 />
    //               </div>
    //               <div
    //                 className={clsx(
    //                   'transition-all duration-300 ease-in text-black bg-white text-black rounded-lg overflow-y-hidden',
    //                   openSubTabs[link.name]
    //                     ? 'max-h-[400px] opacity-100 mb-2'
    //                     : 'max-h-0 opacity-0'
    //                 )}
    //               >
    //                 <div className="p-2">
    //                   {link.subTabs.map((subTab, subIndex) => (
    //                     <div
    //                       onClick={() => routerHandler(subTab.path)}
    //                       key={`subTab-${subIndex}`}
    //                       className="hover:bg-bright-turquoise-600 hover:text-white rounded-lg border border-bright-turquoise-600 mb-2"
    //                     >
    //                       <TextBody className="pl-8 p-2 cursor-pointer font-bold">
    //                         {subTab.name}
    //                       </TextBody>
    //                     </div>
    //                   ))}
    //                 </div>
    //               </div>
    //             </div>
    //           )}
    //         </div>
    //       ))}
    //     </div>

    //     <button
    //       className="mb-2 flex items-center gap-2 p-1 font-bold z-[9999]"
    //       onClick={() => logout()}
    //     >
    //       {/* //TODO: Review this */}
    //       <PowerIcon
    //         // fill={COLORS['PowerIconInSideBar']}
    //         // hoverFill={COLORS['PowerIconInSideBarHover']}
    //         fill="#FFFFFF"
    //         hoverFill="#000000"
    //         title="Cerrar Sesión"
    //         key={'333'}
    //         className="cursor-pointer"
    //       />
    //       {/* <PowerIcon
    //         className="cursor-pointer z-[999]"
    //         fill="#FFFFFF"
    //         hoverFill="#07969a"
    //         title="Cerrar Sesión"
    //       /> */}
    //       <TextBody>Salir</TextBody>
    //     </button>
    //   </div>
    // </div>

    <div className={className}>
      <button
        onClick={toggleMenu}
        className="flex shrink-0 items-center justify-center"
        title="Menú"
      >
        <HamburgerIcon
          fill={COLORS['HamburgerIcon']}
          hoverFill={COLORS['HamburgerIconHover']}
        />
        <TextBody className="ml-2 hidden font-bold sm:flex">Menú</TextBody>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black backdrop-blur-[2px] left-[0px] bg-opacity-75 transition-all duration-900 ease-in-out"
          ref={sidebarRef}
        />
      )}

      <div
        className={clsx(
          'fixed left-0 top-0 z-40 flex h-screen w-80 flex-col justify-between bg-bright-turquoise-600 bg-opacity-70 backdrop-blur-[2px] px-8 py-5 text-black transition-all duration-300 ease-in overflow-scroll',
          isOpen ? 'left-0' : 'left-[-320px]'
        )}
      >
        <div className="flex-grow">
          <button
            onClick={toggleMenu}
            className="mb-4 flex items-center gap-2 p-1 text-sm font-bold"
          >
            <CloseIcon
              fill={COLORS['CloseIcon']}
              hoverFill={COLORS['CloseIconHover']}
              width={16}
              height={16}
              title="Cerrar"
            />
            <TextBody>Cerrar</TextBody>
          </button>

          <div className="flex gap-2 items-center justify-center mb-4">
            <AgricultureIcon
              className="rounded-xl p-2 border border-white"
              fill={COLORS['AgricultureIconInSideBar']}
            />
            <TextHeadingH5 className="text-white">Agri Math</TextHeadingH5>
          </div>

          {renderTabs(TABS)}
        </div>

        <button
          className="mb-2 flex items-end gap-2 p-1 font-bold flex-grow"
          onClick={() => logout()}
        >
          <PowerIcon fill="#FFFFFF" hoverFill="#000000" title="Cerrar Sesión" />
          <TextBody>Salir</TextBody>
        </button>
      </div>
    </div>
  )
}

export default SidebarTemplate
