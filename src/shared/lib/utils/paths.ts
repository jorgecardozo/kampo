export const paths = {
  root: '/',

  // Auth
  signin: {
    root: '/ingresar',
  },
  signup: {
    root: '/registrarse',
  },
  forgot: {
    path: '/olvide-mi-contrasena',
    title: '¿Olvidaste tu contraseña?',
  },
  changePassword: {
    path: '/cambiar-contrasena',
    title: 'Cambiar contraseña',
  },

  // Inicio
  dashboard: {
    path: '/dashboard',
    title: 'Dashboard',
  },

  // Ganadería
  ganaderia: {
    dashboard: {
      path: '/ganaderia/dashboard',
      title: 'Dashboard Ganadería',
    },
    animales: {
      path: '/ganaderia/animales',
      title: 'Animales',
    },
    vacunaciones: {
      path: '/ganaderia/vacunaciones',
      title: 'Vacunaciones',
    },
    campanias: {
      path: '/ganaderia/campanias',
      title: 'Campañas de Vacunación',
    },
    calendario: {
      path: '/ganaderia/calendario',
      title: 'Calendario Sanitario',
    },
    veterinarios: {
      path: '/ganaderia/veterinarios',
      title: 'Veterinarios',
    },
    duenos: {
      path: '/ganaderia/duenos',
      title: 'Dueños',
    },
    tiposVacuna: {
      path: '/ganaderia/tipos-vacuna',
      title: 'Tipos de Vacuna',
    },
    precios: {
      path: '/ganaderia/precios',
      title: 'Precio por kg',
    },
  },

  // Finanzas
  ventas: {
    path: '/ventas',
    title: 'Ventas / Ingresos',
  },

  // Gastos del Campo
  gastos: {
    dashboard: {
      path: '/gastos/dashboard',
      title: 'Dashboard Gastos',
    },
    lista: {
      path: '/gastos',
      title: 'Gastos',
    },
    categorias: {
      path: '/gastos/categorias',
      title: 'Categorías de Gasto',
    },
  },

  // Configuración
  campos: {
    path: '/campos',
    title: 'Campos / Establecimientos',
  },
  usuariosCampo: {
    path: '/usuarios',
    title: 'Usuarios del campo',
  },
  superadmin: {
    path: '/superadmin',
    title: 'Super-admin',
  },
  potreros: {
    path: '/potreros',
    title: 'Potreros',
  },
  proveedores: {
    path: '/proveedores',
    title: 'Proveedores',
  },
  mediosDePago: {
    path: '/medios-de-pago',
    title: 'Medios de Pago',
  },
  users: {
    path: '/users',
    title: 'Usuarios',
  },
  roles: {
    path: '/roles',
    title: 'Roles',
  },
  notifications: {
    path: '/notifications',
    title: 'Notificaciones',
  },
  perfil: {
    path: '/perfil',
    title: 'Perfil',
  },
}
