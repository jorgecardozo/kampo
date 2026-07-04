import React, { useState, createContext, useEffect } from 'react'
import { FiCamera } from 'react-icons/fi'
import { BsFillAwardFill } from "react-icons/bs";
import { FaCreditCard } from "react-icons/fa6";
import {
  FaShoppingCart,
  FaUser,
  FaCashRegister,
  FaBoxes,
  FaPeopleArrows,
  FaBell,
  FaShieldAlt,
  FaUsers,
  FaChartBar,
  FaExchangeAlt,
  FaThLarge,
  FaTruck,
  FaBox,
  FaFileAlt,
  FaSyringe,
  FaCalendarAlt,
  FaUserMd,
  FaUserTie,
  FaMoneyBillWave,
  FaTags,
  FaMapMarkedAlt,
  FaNotesMedical,
  FaLayerGroup,
  FaBalanceScale,
  FaTractor,
} from 'react-icons/fa'
import { GiArchiveRegister, GiCow } from 'react-icons/gi'
import { MdOutlineMoveDown } from 'react-icons/md'
import { FaDollarSign, FaShopify } from 'react-icons/fa6'
import { FaPeopleGroup } from 'react-icons/fa6'
import { motion, AnimatePresence } from 'framer-motion'
import { paths } from 'lib/utils/paths'
import { useRouter } from 'next/router'
import { useSelectors } from 'store/selectors'
import { ROLES } from 'lib/utils/constants'
import { useMediaQuery } from 'hooks/useMediaQuery'
import { isEmptyObject, isResponseValid } from 'lib/utils/helpers'
import { toast } from 'react-toastify'
import { useActions } from 'store/actions'
import { getCookie, setCookie } from 'lib/utils/cookies'
import {
  ChevronDown,
  Search,
  X,
  Menu,
} from 'lucide-react'
import { useEffectOnce } from 'hooks/useEffectOnce'
import { Separator } from 'components/ui/separator'
import { TextBodySm } from 'components/Text'
import { usePermisos } from '@shared/context/PermisosProvider'

const ThemeContext = createContext()

const NavBarTemplate = ({ isOpen, setIsOpen }) => {
  const { isSuperAdmin } = usePermisos()
  const [activeSubMenu, setActiveSubMenu] = useState(null)
  const [activeSubMenuBis, setActiveSubMenuBis] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null)
  const [hoveredSubMenuItem, setHoveredSubMenuItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { usuario } = useSelectors()
  const [isUploading, setIsUploading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(true)

  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { subirImagen, setUserData, obtenerUsuario } = useActions()

  const toggleSubMenu = (index) => {
    setActiveSubMenu(index)
  }

  const toggleMenu = (index) => {
    setActiveMenu(index)
  }

  useEffectOnce(() => {
    setActiveMenu(getCookie('activeMenu'))
    setActiveSubMenu(getCookie('activeSubMenu'))
    setMenuOpen(getCookie('menuOpen') == 'true' ? true : false)

    // Agregar estilos de scrollbar personalizados para NavBar
    const style = document.createElement('style')
    style.innerHTML = `
      #navbar-scroll-container::-webkit-scrollbar {
        width: 8px;
      }
      #navbar-scroll-container::-webkit-scrollbar-track {
        background: transparent;
      }
      #navbar-scroll-container::-webkit-scrollbar-thumb {
        background: rgba(61, 97, 224, 0.6);
        border-radius: 4px;
      }
      #navbar-scroll-container::-webkit-scrollbar-thumb:hover {
        background: rgba(61, 97, 224, 0.8);
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  })

  useEffect(() => {
    setCookie('menuOpen', menuOpen ? 'true' : 'false', { path: '/' })
    setCookie('activeMenu', activeMenu, { path: '/' })
    setCookie('activeSubMenu', activeSubMenu, { path: '/' })
  }, [menuOpen, activeMenu, activeSubMenu])

  // Función para filtrar las secciones según la búsqueda
  const filterMenuSections = (sections, query) => {
    if (!query.trim()) return sections

    const lowerQuery = query.toLowerCase()

    return sections
      .map(section => {
        const filteredItems = section.items.filter(item => {
          // Buscar en el título del item
          const itemMatch = item.title.toLowerCase().includes(lowerQuery)

          // Buscar en los submenús si existen
          const submenuMatch = item.submenu?.some(subItem =>
            subItem.title.toLowerCase().includes(lowerQuery)
          )

          return itemMatch || submenuMatch
        })

        return {
          ...section,
          items: filteredItems
        }
      })
      .filter(section => section.items.length > 0)
  }

  const menuSections = [
    {
      title: 'INICIO',
      items: [
        {
          title: 'Dashboard',
          icon: <FaThLarge size={16} className='text-main-600' />,
          activeIcon: <FaThLarge size={16} className='text-white' />,
          path: paths.dashboard.path,
          submenu: null,
        }
      ]
    },
    {
      title: 'GANADERÍA',
      items: [
        {
          title: 'Dashboard',
          icon: <FaChartBar size={16} className="text-main-600" />,
          activeIcon: <FaChartBar size={16} className="text-white" />,
          path: paths.ganaderia.dashboard.path,
          submenu: null,
        },
        {
          title: 'Animales',
          icon: <GiCow size={16} className="text-main-600" />,
          activeIcon: <GiCow size={16} className="text-white" />,
          path: paths.ganaderia.animales.path,
          submenu: null,
        },
        {
          title: 'Vacunaciones',
          icon: <FaSyringe size={16} className="text-main-600" />,
          activeIcon: <FaSyringe size={16} className="text-white" />,
          path: paths.ganaderia.vacunaciones.path,
          submenu: null,
        },
        {
          title: 'Campañas',
          icon: <FaLayerGroup size={16} className="text-main-600" />,
          activeIcon: <FaLayerGroup size={16} className="text-white" />,
          path: paths.ganaderia.campanias.path,
          submenu: null,
        },
        {
          title: 'Calendario Sanitario',
          icon: <FaCalendarAlt size={16} className="text-main-600" />,
          activeIcon: <FaCalendarAlt size={16} className="text-white" />,
          path: paths.ganaderia.calendario.path,
          submenu: null,
        },
        {
          title: 'Veterinarios',
          icon: <FaUserMd size={16} className="text-main-600" />,
          activeIcon: <FaUserMd size={16} className="text-white" />,
          path: paths.ganaderia.veterinarios.path,
          submenu: null,
        },
        {
          title: 'Dueños',
          icon: <FaUserTie size={16} className="text-main-600" />,
          activeIcon: <FaUserTie size={16} className="text-white" />,
          path: paths.ganaderia.duenos.path,
          submenu: null,
        },
      ]
    },
    {
      title: 'GASTOS DEL CAMPO',
      items: [
        {
          title: 'Dashboard',
          icon: <FaChartBar size={16} className="text-main-600" />,
          activeIcon: <FaChartBar size={16} className="text-white" />,
          path: paths.gastos.dashboard.path,
          submenu: null,
        },
        {
          title: 'Gastos',
          icon: <FaMoneyBillWave size={16} className="text-main-600" />,
          activeIcon: <FaMoneyBillWave size={16} className="text-white" />,
          path: paths.gastos.lista.path,
          submenu: null,
        },
        {
          title: 'Categorías',
          icon: <FaTags size={16} className="text-main-600" />,
          activeIcon: <FaTags size={16} className="text-white" />,
          path: paths.gastos.categorias.path,
          submenu: null,
        },
      ]
    },
    {
      title: 'FINANZAS',
      items: [
        {
          title: 'Ventas',
          icon: <FaDollarSign size={16} className="text-main-600" />,
          activeIcon: <FaDollarSign size={16} className="text-white" />,
          path: paths.ventas.path,
          submenu: null,
        },
      ]
    },
    {
      title: 'CONFIGURACIÓN',
      items: [
        {
          title: 'Campos / Establecimientos',
          icon: <FaTractor size={16} className="text-main-600" />,
          activeIcon: <FaTractor size={16} className="text-white" />,
          path: paths.campos.path,
          submenu: null,
        },
        {
          title: 'Potreros',
          icon: <FaMapMarkedAlt size={16} className="text-main-600" />,
          activeIcon: <FaMapMarkedAlt size={16} className="text-white" />,
          path: paths.potreros.path,
          submenu: null,
        },
        {
          title: 'Precio por kg',
          icon: <FaBalanceScale size={16} className="text-main-600" />,
          activeIcon: <FaBalanceScale size={16} className="text-white" />,
          path: paths.ganaderia.precios.path,
          submenu: null,
        },
        {
          title: 'Tipos de Vacuna',
          icon: <FaNotesMedical size={16} className="text-main-600" />,
          activeIcon: <FaNotesMedical size={16} className="text-white" />,
          path: paths.ganaderia.tiposVacuna.path,
          submenu: null,
        },
        {
          title: 'Usuarios del campo',
          icon: <FaUsers size={16} className="text-main-600" />,
          activeIcon: <FaUsers size={16} className="text-white" />,
          path: paths.usuariosCampo.path,
          submenu: null,
        },
        ...(isSuperAdmin
          ? [
              {
                title: 'Super-admin',
                icon: <FaShieldAlt size={16} className="text-main-600" />,
                activeIcon: <FaShieldAlt size={16} className="text-white" />,
                path: paths.superadmin.path,
                submenu: null,
              },
            ]
          : []),
      ]
    }
  ]

  const obtenerUsuarioData = async (id: number) => {
    setIsUploading(true)
    const response = await obtenerUsuario(id)

    if (!isResponseValid(response)) {
      toast.error('¡Ocurrió un error al obtener el usuario!', {
        theme: 'colored',
      })
    }

    setUserData(response?.data?.usuario)
    setIsUploading(false)
  }

  useEffect(() => {
    const userCookie = getCookie('user')

    if (isEmptyObject(usuario) && !isEmptyObject(userCookie)) {
      setUserData(userCookie)
    }

    if (usuario?.id || userCookie?.id) {
      obtenerUsuarioData(usuario?.id || userCookie?.id)
    }
  }, [])

  // Solo mostrar en mobile
  if (!isMobile) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {/* Barra superior fija en móvil */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 z-40 flex items-center justify-between px-4">
        {/* Botón de hamburguesa */}
        <button
          className="bg-main-600 text-white p-2 rounded-lg hover:bg-main-700 transition-colors duration-200"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Iconos de la derecha */}
        <div className="flex items-center gap-2">
          {/* Icono de notificaciones */}
          <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200">
            <FaBell size={24} className="text-gray-700 dark:text-gray-300" />
            {/* Badge de notificaciones (opcional) */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Icono de usuario */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-main-600">
            <img
              src={
                usuario.imagen_perfil ||
                'https://delivery-flutter.s3.us-east-1.amazonaws.com/users/no-image.png'
              }
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  'https://delivery-flutter.s3.us-east-1.amazonaws.com/users/no-image.png'
              }}
            />
          </div>
        </div>
      </div>

      {/* Overlay - visible cuando el menú está abierto */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* NavBar móvil - desliza desde la izquierda */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-screen w-[85%] bg-white dark:bg-gray-800 text-black dark:text-white shadow-2xl z-[60]"
          >
            {/* Header: Logo y botón de cerrar - misma altura que barra superior */}
            <div className="relative flex items-center justify-center h-16 px-5">
              {/* Logo de la empresa - centrado */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-bold tracking-tight">
                  <span className="text-black dark:text-white">ST</span>
                  <span className="text-main-600">OO</span>
                  <span className="text-black dark:text-white">KI</span>
                </h1>
              </motion.div>

              {/* Botón de cerrar - posición absoluta a la derecha */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-5 bg-main-600 text-white p-2 rounded-full hover:bg-main-700 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Contenido con padding y scroll */}
            <div
              id="navbar-scroll-container"
              className="px-5 pb-20 overflow-y-auto overflow-x-hidden scrollbar-thin-auto"
              style={{
                height: 'calc(100dvh - 64px)'
              }}
            >
              {/* Separador */}
              <div className="mb-4">
                <Separator className="bg-gray-300 dark:bg-gray-700" />
              </div>

              {/* Barra de búsqueda */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-2"
              >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-main-600 size-4" />
                <input
                  type="text"
                  placeholder="Buscar menú..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-main-600 dark:border-main-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-500 text-sm transition-all duration-200 bg-white dark:bg-gray-700 text-black dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </motion.div>

            {/* Menú */}
            <div className="pt-0 pb-4">
              {filterMenuSections(menuSections, searchQuery).map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + sectionIndex * 0.05 }}
                >
                  {/* Título de la sección */}
                  <div className="px-4 py-2 mt-4 mb-2">
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>

                  {/* Items del menú */}
                  <ul>
                    {section.items.map((item, index) => {
                      const itemId = `${section.title}-${item.title}-${index}`
                      const isActive = item.path ? router.pathname === item.path : false
                      return (
                      <motion.li
                        key={itemId}
                        className="relative"
                        onMouseEnter={() => setHoveredMenuItem(itemId)}
                        onMouseLeave={() => setHoveredMenuItem(null)}
                        whileTap={{ scale: 0.98 }}
                        onClick={
                          item.submenu ? () => { } : () => {
                            toggleMenu(item.title)
                            router.push(item.path)
                            setIsOpen(false) // Cerrar el menú al navegar
                          }
                        }
                      >
                        <motion.div
                          className={`flex items-center gap-x-4 cursor-pointer p-2 justify-start
                            rounded-md mt-2 transition-colors duration-200
                            ${isActive
                              ? 'bg-main-600 text-white hover:bg-main-700'
                              : 'hover:bg-main-600 hover:text-white'
                            }`}
                          onClick={
                            !item.submenu ? () => { } : () => {
                              toggleMenu(item.title)
                              setMenuOpen(!menuOpen)
                            }
                          }
                        >
                          <span className={`transition-colors duration-200 ${hoveredMenuItem === itemId && !isActive ? '[&_svg]:!text-white' : ''}`}>
                            {isActive || hoveredMenuItem === itemId ? item.activeIcon : item.icon}
                          </span>
                          <motion.span
                            className="flex-1"
                          >
                            <TextBodySm>{item.title}</TextBodySm>
                          </motion.span>
                          {item.submenu && (
                            <motion.span
                              animate={{ rotate: activeSubMenu === item.title || (activeMenu === item.title && menuOpen) ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className={`transition-colors duration-200 ${isActive || hoveredMenuItem === itemId ? 'text-white' : 'text-main-600'}`} />
                            </motion.span>
                          )}
                        </motion.div>

                        {/* Submenú */}
                        <AnimatePresence>
                          {menuOpen && item.submenu && activeMenu === item.title && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-8 mt-2 flex flex-col gap-y-2"
                            >
                              {item.submenu.map((subItem, subIndex) => (
                                <motion.li
                                  key={subItem.title}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: subIndex * 0.1 }}
                                  className={`flex items-center gap-x-4 cursor-pointer p-2 rounded-md transition-colors duration-200
                                    ${activeSubMenu === subItem.title
                                      ? 'bg-main-600 text-white hover:bg-main-700'
                                      : 'bg-white hover:bg-main-600 hover:text-white'
                                    }`}
                                  whileTap={{ scale: 0.98 }}
                                  onMouseEnter={() => setHoveredSubMenuItem(subItem.title)}
                                  onMouseLeave={() => setHoveredSubMenuItem(null)}
                                  onClick={() => {
                                    if (activeSubMenuBis !== `${subIndex}-${index}`) {
                                      toggleSubMenu(subItem.title)
                                      router.push(subItem.path)
                                      setIsOpen(false) // Cerrar el menú al navegar
                                    }
                                  }}
                                >
                                  <span>
                                    {activeSubMenu === subItem.title || hoveredSubMenuItem === subItem.title ? subItem.activeIcon : subItem.icon}
                                  </span>
                                  <TextBodySm>{subItem.title}</TextBodySm>
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </motion.li>
                      )
                    })}
                  </ul>

                  {/* Separador entre secciones */}
                  {sectionIndex < menuSections.length - 1 && (
                    <div className="my-4">
                      <Separator className="bg-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  )
}

export default NavBarTemplate
