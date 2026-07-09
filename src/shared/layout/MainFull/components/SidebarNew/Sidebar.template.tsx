import React, { useState, createContext, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useUser } from '@auth0/nextjs-auth0/client'
import { FiUpload, FiCamera, FiSave } from 'react-icons/fi'
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
  BadgeDollarSign,
  ArrowLeft,
  CreditCard,
  Award,
  ChevronDown,
  ChevronsLeft,
  Search,
  LogOut,
} from 'lucide-react'
import { useEffectOnce } from 'hooks/useEffectOnce'
import { Separator } from 'components/ui/separator'
import { TextBodySm } from 'components/Text'
import { ThemeToggle } from 'components/ThemeToggle'
import { usePermisos } from '@shared/context/PermisosProvider'

const ThemeContext = createContext()

const SidebarTemplate = ({ isOpen, setIsOpen }) => {
  const { user } = useUser()
  const { isSuperAdmin } = usePermisos()
  const [activeSubMenu, setActiveSubMenu] = useState(null)
  const [activeSubMenuBis, setActiveSubMenuBis] = useState(null)
  const [activeMenu, setActiveMenu] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [hoveredItem, setHoveredItem] = useState(null)
  // Posición (viewport) del ítem con hover, para renderizar el tooltip con
  // position:fixed y evitar que el overflow del contenedor de scroll lo recorte.
  const [hoverRect, setHoverRect] = useState(null)
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null)
  const [hoveredSubMenuItem, setHoveredSubMenuItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { usuario } = useSelectors()
  const [isUploading, setIsUploading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(true)
  // Acordeón de secciones (cuando la sidebar está expandida).
  const [openSections, setOpenSections] = useState({})
  const toggleSection = (title, defaultOpen) =>
    setOpenSections((p) => ({ ...p, [title]: !(title in p ? p[title] : defaultOpen) }))
  // Si la foto del proveedor (Auth0/Gravatar) falla o no existe, mostramos iniciales.
  const [avatarError, setAvatarError] = useState(false)

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

    // Agregar estilos de scrollbar personalizados
    const style = document.createElement('style')
    style.innerHTML = `
      #sidebar-scroll-container::-webkit-scrollbar {
        width: 8px;
      }
      #sidebar-scroll-container::-webkit-scrollbar-track {
        background: transparent;
      }
      #sidebar-scroll-container::-webkit-scrollbar-thumb {
        background: rgba(61, 97, 224, 0.6);
        border-radius: 4px;
      }
      #sidebar-scroll-container::-webkit-scrollbar-thumb:hover {
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

  const GradientIcon = ({ icon: Icon }) => (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <defs>
        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14b8a6" /> {/* teal-500 */}
          <stop offset="100%" stopColor="#10b981" /> {/* emerald-500 */}
        </linearGradient>
      </defs>
      <g fill="url(#icon-gradient)">
        {React.cloneElement(Icon, { fill: 'url(#icon-gradient)' })}
      </g>
    </svg>
  )

  // const menuItems = [
  //   {
  //     title: 'Perfil',
  //     icon: <GradientIcon icon={<FaUser size={20} className=''/>} />,
  //     path: paths.perfil.path,
  //     submenu: null,
  //   },
  //   {
  //     title: 'Cajas',
  //     icon: <GradientIcon icon={<FaCashRegister size={20} />} />,
  //     path: paths.cajas.path,
  //     submenu: null,
  //   },
  //   {
  //     title: 'Productos',
  //     icon: <GradientIcon icon={<FaBoxes size={20} />} />,
  //     path: paths.productos.path,
  //     // submenu: [
  //     //   { title: 'Fruits', icon: <FaAppleAlt size={16} /> },
  //     //   { title: 'Vegetables', icon: <FaCarrot size={16} /> },
  //     //   { title: 'Bakery', icon: <FaBreadSlice size={16} /> },
  //     // ],
  //   },
  //   {
  //     title: 'Stocks',
  //     icon: <GradientIcon icon={<FaShoppingCart size={20} />} />,
  //     submenu: [
  //       // {
  //       //   title: 'Registro',
  //       //   icon: <GradientIcon icon={<GiArchiveRegister size={20} />} />,
  //       //   path: paths.proveedores.registro.path,
  //       // },
  //       {
  //         title: 'Movimientos',
  //         icon: <GradientIcon icon={<MdOutlineMoveDown size={20} />} />,
  //         path: paths.stock.movimientos.path,
  //       },
  //     ],
  //   },

  //   {
  //     title: 'Proveedores',
  //     icon: <GradientIcon icon={<FaPeopleArrows size={20} />} />,
  //     submenu: [
  //       {
  //         title: 'Registro',
  //         icon: <GradientIcon icon={<GiArchiveRegister size={20} />} />,
  //         path: paths.proveedores.registro.path,
  //       },
  //       {
  //         title: 'Compras',
  //         icon: <GradientIcon icon={<FaShopify size={20} />} />,
  //         path: paths.proveedores.compras.path,
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Clientes',
  //     icon: <GradientIcon icon={<FaPeopleGroup size={20} />} />,
  //     path: paths.clientes.path,
  //     submenu: null,
  //   },
  // ]

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

  // const menuSections = [
  //   {
  //     title: 'Configuración',
  //     items: [
  //       {
  //         title: 'Perfil',
  //         icon: <FaUser size={16} className='text-main-600' />,
  //         activeIcon: <FaUser size={16} className='text-white' />,
  //         path: paths.perfil.path,
  //         submenu: null,
  //       },
  //       {
  //         title: 'Medios de Pago',
  //         icon: <FaCreditCard size={16} className='text-main-600' />,
  //         activeIcon: <FaCreditCard size={16} className='text-white' />,
  //         path: paths.mediosDePago.path,
  //         submenu: null,
  //       },
  //       {
  //         title: 'Calidades',
  //         icon: <BsFillAwardFill size={16} className='text-main-600' />,
  //         activeIcon: <BsFillAwardFill size={16} className='text-white' />,
  //         path: paths.calidades.path,
  //         submenu: null,
  //       },
  //     ]
  //   },
  //   {
  //     title: 'Operaciones de Venta',
  //     items: [
  //       {
  //         title: 'Cajas',
  //         icon: <FaCashRegister size={16} className="text-main-600" />,
  //         activeIcon: <FaCashRegister size={16} className="text-white" />,
  //         path: paths.cajas.path,
  //         submenu: null,
  //       },
  //       {
  //         title: 'Ventas',
  //         icon: <FaDollarSign size={16} className="text-main-600" />,
  //         activeIcon: <FaDollarSign size={16} className="text-white" />,
  //         submenu: [
  //           {
  //             title: 'Nueva Ventas',
  //             icon: <FaDollarSign size={16} className="text-main-600" />,
  //             activeIcon: <FaDollarSign size={16} className="text-white" />,
  //             path: paths.ventas.nuevaVenta.path,
  //           },
  //           {
  //             title: 'Historial',
  //             icon: <FaDollarSign size={16} className="text-main-600" />,
  //             activeIcon: <FaDollarSign size={16} className="text-white" />,
  //             path: paths.ventas.historial.path,
  //           }
  //         ],
  //       },
  //     ]
  //   },
  //   {
  //     title: 'Inventario',
  //     items: [
  //       {
  //         title: 'Productos',
  //         icon: <FaBoxes size={16} className="text-main-600" />,
  //         activeIcon: <FaBoxes size={16} className="text-white" />,
  //         path: paths.productos.path,
  //       },
  //       {
  //         title: 'Stocks',
  //         icon: <FaShoppingCart size={16} className="text-main-600" />,
  //         activeIcon: <FaShoppingCart size={16} className="text-white" />,
  //         submenu: [
  //           {
  //             title: 'General',
  //             icon: <MdOutlineMoveDown size={16} className="text-main-600" />,
  //             activeIcon: <MdOutlineMoveDown size={16} className="text-white" />,
  //             path: paths.stock.general.path,
  //           },
  //           {
  //             title: 'Lote',
  //             icon: <MdOutlineMoveDown size={16} className="text-main-600" />,
  //             activeIcon: <MdOutlineMoveDown size={16} className="text-white" />,
  //             path: paths.stock.lote.path,
  //           },
  //         ],
  //       },
  //     ]
  //   },
  //   {
  //     title: 'Relaciones Comerciales',
  //     items: [
  //       {
  //         title: 'Proveedores',
  //         icon: <FaPeopleArrows size={16} className="text-main-600" />,
  //         activeIcon: <FaPeopleArrows size={16} className="text-white" />,
  //         path: paths.proveedores.path
  //       },
  //       {
  //         title: 'Clientes',
  //         icon: <FaPeopleGroup size={16} className="text-main-600" />,
  //         activeIcon: <FaPeopleGroup size={16} className="text-white" />,
  //         path: paths.clientes.path,
  //         submenu: null,
  //       },
  //     ]
  //   }
  // ]

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

  // Sección que contiene la ruta actual (abierta por defecto en el acordeón).
  const activeSectionTitle = menuSections.find((s) =>
    s.items.some((it) => it.path === router.pathname)
  )?.title

  const obtenerUsuarioData = async (id: number) => {
    setIsUploading(true)
    const response = await obtenerUsuario(id)
    console.log('usuarios', response)

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      console.log('file', file)
      try {
        const userCookie = getCookie('user')
        console.log('user', userCookie)
        console.log('usuario', usuario)
        if (isEmptyObject(usuario) && !isEmptyObject(userCookie)) {
          setUserData(userCookie)
        }

        if (usuario?.id || userCookie?.id) {
          const formData = new FormData()
          formData.append('imagen_perfil', file)
          console.log('formData', formData)
          const response = await subirImagen({
            id: usuario?.id,
            formData: formData,
          })

          console.log('response', response)
          if (isResponseValid(response)) {
            setUserData(response.data.usuario)
            toast.success('¡La foto de perfil se ha editado con éxito!', {
              theme: 'colored',
            })
          } else {
            toast.error('¡Ocurrió un error en la edición!', {
              theme: 'colored',
            })
          }
        }
      } catch (error) { }
      setIsUploading(false)
    }
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className={`${isOpen ? 'w-64' : isMobile ? 'w-0' : 'w-20'}
          bg-white dark:bg-slate-900 text-gray-800 dark:text-white
          h-screen pt-4 relative transition-all duration-300 shadow-lg z-50 flex flex-col`}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute cursor-pointer ${!isOpen && isMobile ? '-right-8 top-9' : '-right-4 top-9'}  w-7 h-7
            border-2 rounded-full bg-main-600 border-main-600
            flex items-center justify-center`}
          onClick={() => setIsOpen(!isOpen)}
          title={!isOpen ? 'Abrir Menú' : 'Cerrar Menú'}
        >
          <motion.div
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronsLeft size={16} className="text-white" />
          </motion.div>
        </motion.div>

        {/* Logo de la empresa */}
        <div className="flex flex-col items-center justify-center mb-6 px-5">
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-main-600 text-xl font-bold text-white shadow-md">
                  K
                </span>
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="text-gray-800 dark:text-white">KA</span>
                  <span className="text-main-600">MP</span>
                  <span className="text-gray-800 dark:text-white">O</span>
                </h1>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-main-600 text-xl font-bold text-white shadow-md">
                  K
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* <div className="flex flex-col items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`relative flex flex-col items-center justify-center w-full ${isMobile && !isOpen ? 'hidden' : ''}`}
          >
            <div className="rounded-full p-[3px] bg-main-600 hover:from-teal-600 hover:bg-main-600">
              <div className="relative">
                <img
                  src={
                    usuario.imagen_perfil ||
                    'https://delivery-flutter.s3.us-east-1.amazonaws.com/users/no-image.png'
                  }
                  alt="Profile"
                  className={`w-16 h-16 rounded-full object-cover  ${isUploading ? 'opacity-50' : ''}`}
                  onError={(e) => {
                    e.target.src =
                      'https://delivery-flutter.s3.us-east-1.amazonaws.com/users/no-image.png'
                  }}
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute -bottom-2 -right-4 bg-main-600 p-2 hover:bg-main-600 rounded-full text-white cursor-pointer transform transition-transform duration-300 hover:scale-125"
                >
                  <FiCamera className="w-4 h-4" />
                </label>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-center w-full"
                >
                  <h2 className="text-lg font-semibold">
                    {usuario.nombre} {usuario.apellido}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {ROLES[usuario.rol]}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div> */}

        {/* Contenedor con scroll para búsqueda y menús */}
        <div
          id="sidebar-scroll-container"
          className="overflow-y-auto overflow-x-hidden w-full flex-1 scrollbar-thin-auto"
        >
          {/* Barra de búsqueda - solo visible cuando la sidebar está abierta */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="px-5 mb-4 mr-3"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-main-600 size-4" />
                  <input
                    type="text"
                    placeholder="Buscar menú..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-500 text-sm transition-all duration-200 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-400"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`pt-0 pb-4 px-5 mr-3 ${isMobile && !isOpen ? 'hidden' : ''}`}>
            {filterMenuSections(menuSections, searchQuery).map((section, sectionIndex) => (
              <div key={section.title}>
                {/* Cabecera de sección (acordeón) - solo con la sidebar abierta */}
                {(() => {
                  const sectionOpen = !isOpen
                    ? true
                    : searchQuery
                      ? true
                      : section.title in openSections
                        ? openSections[section.title]
                        : section.title === activeSectionTitle
                  return (
                <>
                <AnimatePresence>
                  {isOpen && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => toggleSection(section.title, section.title === activeSectionTitle)}
                      className="flex w-full items-center justify-between px-4 py-1.5 mt-2 mb-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800"
                    >
                      <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        {section.title}
                      </h3>
                      <ChevronDown
                        size={15}
                        className={`text-gray-400 transition-transform duration-200 ${sectionOpen ? 'rotate-180' : ''}`}
                      />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Items del menú (colapsables cuando la sidebar está abierta) */}
                {sectionOpen && (
                <ul>
                  {section.items.map((item, index) => {
                    const itemId = `${section.title}-${item.title}-${index}`
                    const isActive = item.path ? router.pathname === item.path : false
                    return (
                    <motion.li
                      key={itemId}
                      className="relative"
                      onMouseEnter={(e) => {
                        if (!isOpen) {
                          setHoveredItem(itemId)
                          setHoverRect(e.currentTarget.getBoundingClientRect())
                        }
                        setHoveredMenuItem(itemId)
                      }}
                      onMouseLeave={() => {
                        if (!isOpen) {
                          setHoveredItem(null)
                          setHoverRect(null)
                        }
                        setHoveredMenuItem(null)
                      }}
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      onClick={
                        item.submenu ? () => { } : () => {
                          toggleMenu(item.title)
                          router.push(item.path)
                        }
                      }
                    >
                      <motion.div
                        className={`flex items-center gap-x-4 cursor-pointer p-2 justify-center
                        rounded-md mt-0.5 transition-colors duration-200
                        ${isActive
                            ? 'bg-main-600 text-white hover:bg-main-700'
                            : 'hover:bg-main-600 hover:text-white dark:hover:bg-main-600'
                          }`}
                        onClick={
                          !item.submenu ? () => { } : () => {
                            toggleMenu(item.title)
                            console.log("ver entro subMenu")
                            setMenuOpen(!menuOpen)
                          }
                        }
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`transition-colors duration-200 ${isActive || hoveredMenuItem === itemId ? '[&_svg]:!text-white' : '[&_svg]:!text-main-600 dark:[&_svg]:!text-slate-300'}`}>
                          {isActive || hoveredMenuItem === itemId ? item.activeIcon : item.icon}
                        </span>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex-1"
                              onClick={
                                item.submenu ? () => { } : () => {
                                  console.log("entro 1")
                                }
                              }
                            >
                              <TextBodySm>{item.title}</TextBodySm>
                            </motion.span>
                          )}
                        </AnimatePresence>
                        {isOpen && item.submenu && (
                          <motion.span
                            animate={{ rotate: activeSubMenu === item.title || (activeMenu === item.title && menuOpen) ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className={`transition-colors duration-200 ${isActive || hoveredMenuItem === itemId ? 'text-white' : 'text-main-600'}`} />
                          </motion.span>
                        )}
                      </motion.div>

                      {/* Tooltip al hacer hover con la sidebar colapsada.
                          Se renderiza con un Portal a document.body para escapar de
                          los ancestros con transform (framer-motion) — si no, un
                          position:fixed se posiciona respecto al ancestro transformado
                          y no respecto al viewport. */}
                      {!isOpen &&
                        hoveredItem === itemId &&
                        hoverRect &&
                        typeof document !== 'undefined' &&
                        createPortal(
                          <div
                            style={{
                              position: 'fixed',
                              top: hoverRect.top + hoverRect.height / 2,
                              left: hoverRect.right + 12,
                              transform: 'translateY(-50%)',
                            }}
                            className="z-[9999] whitespace-nowrap rounded-md bg-gray-900
                              dark:bg-gray-700 text-white text-sm font-semibold py-2 px-3
                              shadow-lg pointer-events-none"
                          >
                            {item.title}
                          </div>,
                          document.body
                        )}

                      <AnimatePresence>
                        {isOpen && menuOpen && item.submenu && activeMenu === item.title && (
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
                                    : 'bg-white dark:bg-gray-700 hover:bg-main-600 hover:text-white'
                                  }`}
                                whileHover={{ x: 5 }}
                                onMouseEnter={() => setHoveredSubMenuItem(subItem.title)}
                                onMouseLeave={() => setHoveredSubMenuItem(null)}
                                onClick={() => {
                                  if (activeSubMenuBis !== `${subIndex}-${index}`) {
                                    toggleSubMenu(subItem.title)
                                    router.push(subItem.path)
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
                )}
                </>
                  )
                })()}

                {/* Separador entre secciones - visible siempre */}
                {sectionIndex < menuSections.length - 1 && (
                  <div className="my-4 px-2">
                    <Separator className="bg-gray-200 dark:bg-slate-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Usuario + tema + cerrar sesión al final del sidebar */}
        <div className="mt-auto border-t border-gray-200 dark:border-slate-700 px-5 pt-4 pb-4 mr-3 space-y-2">
          {user && (
            <div className={`flex items-center gap-2 ${isOpen ? '' : 'justify-center'}`}>
              {user.picture && !avatarError ? (
                <img
                  src={user.picture as string}
                  alt=""
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarError(true)}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-main-600 text-sm font-bold text-white">
                  {(user.name || user.email || '?').toString().charAt(0).toUpperCase()}
                </span>
              )}
              {isOpen && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800 dark:text-white">{user.name || user.email}</p>
                  {user.name && <p className="truncate text-xs text-gray-400">{user.email}</p>}
                </div>
              )}
            </div>
          )}
          <div className={`flex items-center gap-x-2 ${isOpen ? 'justify-between' : 'justify-center'}`}>
            {isOpen && <span className="text-sm text-gray-500 dark:text-slate-300">Tema</span>}
            <ThemeToggle />
          </div>
          <a
            href="/api/auth/logout"
            title="Cerrar sesión"
            className={`flex items-center gap-x-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-gray-700 ${isOpen ? '' : 'justify-center'}`}
          >
            <LogOut size={18} />
            {isOpen && <span>Cerrar sesión</span>}
          </a>
        </div>
      </motion.div>
    </ThemeContext.Provider>
  )
}

export default SidebarTemplate
