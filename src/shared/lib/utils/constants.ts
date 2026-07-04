import { paths } from './paths'

export const DNI_MAX_VALUE = 89999999
export const DNI_MIN_VALUE = 1000000
export const FOREIGN_DNI_MIN_LENGTH = 8
export const DOCUMENT_MIN_VALUE = 1000000
export const DOCUMENT_MAX_VALUE = 99999999
export const DEFAULT_TITLE = 'Campo Management'
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const AREA_CODE_REGEX = /^\+\d+$/
export const HTTP_REQUEST_ERROR_CODES = [400, 401, 403, 404, 405, 409, 500, 502]
export const UPLOAD_TYPE = {
  POINTS_OF_SALES: 'POINTS OF SALES',
  USERS: 'USERS',
}
export const FILENAMES = {
  POINTS_OF_SALES: 'Carga Masiva - Puntos de venta.csv',
  USERS: 'Carga Masiva - Usuarios.csv',
}
export const POINT_OF_SALE_TYPE = {
  SUCURSAL: 'Sucursal',
  CONCESIONARIO: 'Concesionario',
  TERMINAL: 'Terminal',
}
export const NEW_PASSWORD_REQUIRED = 'NEW_PASSWORD_REQUIRED'

export const errorMapping = {
  InternalServerError: {
    'An error occurred in the Lambda function.':
      'Se produjo un error en la función Lambda.',
  },
  AccessDeniedException: {
    'Lambda function does not have permission to perform the specified action.':
      'La función Lambda no tiene permiso para realizar la acción especificada.',
  },
  FunctionNotFoundException: {
    'Lambda function not found.': 'Función Lambda no encontrada.',
  },
  UsernameExistsException: {
    'Username exists.': 'Nombre de usuario ya existe.',
  },
  NotAuthorizedException: {
    'Incorrect username or password.':
      'Nombre de usuario o contraseña incorrectos.',
    'Password attempts exceeded': 'Se han superado los intentos de contraseña',
  },
}

export const GENDERS = {
  F: 'FEMENINO',
  M: 'MASCULINO',
  X: 'NO BINARIO',
}

export const VALID_CUITLS = [30, 33, 34, 20, 23, 27, 29]
export const isLetter = /^[\p{L}\p{M} ]+$/u

export const ERROR_REASON = {
  POS_ALREADY_EXISTS: 'Ya existe el Punto de venta ingresado.',
  POS_NOT_FOUND: 'No se encontró el Punto de venta ingresado.',
  APP_ALREADY_EXISTS: 'Ya existe el código del aplicativo ingresado.',
  APP_NOT_EXIST: 'No se encontró el aplicativo ingresado.',
  APP_PERMISSION_ALREADY_EXISTS:
    'El aplicativo ya tiene un permiso con el codigo asignado.',
  PROFILE_NOT_FOUND: 'No se encontró el Permiso ingresado para el aplicativo.',
  PERMISSION_CANNOT_BE_DELETE:
    'No se puede eliminar el permiso. Debe tener al menos un permiso en la aplicación.',
  PERMISSION_NOT_FOUND:
    'El aplicativo no tiene un permiso con el codigo ingresado.',
  ROLE_NOT_FOUND: 'El aplicativo no posee el rol ingresado.',
  APP_ROLE_ALREADY_EXISTS:
    'El aplicativo ya posee un rol con el codigo ingresado.',
  EMAIL_NOT_VALID: 'El email ingresado no es válido.',
  USER_DISABLED_FOR_APP:
    'El usuario esta dehabilitado para el aplicativo actual.',
  USER_ALREADY_REGISTERED: 'El usuario ya esta registrado en el aplicativo.',
  USER_NOT_FOUND: 'No se encontró el usuario ingresado.',
  USER_ALREADY_HAS_ASSIGNED_CODES:
    'El usuario ya tiene asignado uno o mas codigos.',
  USER_HAVENT_POS_ASSIGNED:
    'El usuario no tiene el codigo de puntos de venta especificado.',
  INTERNAL_ERROR: 'Ha ocurrido un error. Por favor, volvé a intentarlo.',
  MISSING_HEADER_API_KEY:
    'Ha ocurrido un error. Por favor,intentá en unos minutos.',
  UNAUTHORIZED: 'No Autorizado.',
  INVALID_FILE_TYPE: 'El tipo de archivo es incorrecto.',
  USER_CANNOT_ENABLE_DISABLE_USERS:
    'No tenés permisos para realizar esta acción.',
  POS_USER_REQUEST:
    'La solicitud debe incluir un parámetro de consulta "tipo" o un cuerpo de solicitud que incluya una lista de códigos de punto de venta.',
  CANNOT_PROCESS_CSV: 'No es posible procesar el archivo.',
  ERROR_READING_FILE: 'Error al leer el archivo.',
  APPROVAL_NOT_FOUND: 'No se encontró la solicitud de aprobación.',
  BAD_REQUEST:
    'Lo siento, parece que ha habido un error con la solicitud. Por favor, inténtalo de nuevo mas tarde.',
  ACCOUNT_VERIFIED:
    'El usuario ya verifico su cuenta. No se puede reenviar el correo.',
  EMAIL_CANNOT_BE_SENT: 'No se pudo reenviar el correo.',
  SUCCESSFUL_EMAIL_FORWARDING: 'El correo ha sido enviado exitosamente.',
}

export const BLOB_EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
export const BLOB_CSV_TYPE = 'text/csv'
// Config de tabs de agri-math (dominio eliminado en la app de campo).
export const TABS: any[] = []
// border-[${COLORS['AgricultureIconBorderInSideBar']}]
export const COLORS = {
  AgricultureIcon: '#FFFFFF',
  AgricultureIconInSideBar: '#FFFFFF',
  AgricultureIconBorderInSideBar: '#07969a',
  AgricultureIconInLogin: '#07969a',
  AgricultureIconBorderContainerInLogin: '#07969a',
  CloseIcon: '#FFFFFF',
  CloseModalIcon: '#000000',
  CloseIconHover: '#000000',
  HamburgerIcon: '#000000',
  HamburgerIconHover: '#07969a',
  AgricultureIconInTopBar: '#000000',
  TopBarText: '#07969a',
  // Profile: '#07969a', -> this is tailwind.config.js
  // ProfileText: '#FFFFFF', -> this is tailwind.config.js
  PowerIcon: '#000000',
  PowerIconHover: '#07969a',
  PowerIconInSideBar: '#FFFFFF',
  PowerIconInSideBarHover: '#000000',
  SearchIcon: '#9ca3af',
  UserIcon: '#FFFFFF',
  LoaderIcon: '#07969a',
}

export const BAGGINGS_TYPE = {
  CEBOLLA: 1,
  ZAPALLO: 2,
}

export const PRODUCT_TYPE = {
  CEBOLLA: 1,
  AJO: 2,
  ZAPALLO: 3,
  GIRASOL: 4,
}

export const LABOR_UNIT = {
  SURCO: 1,
  TABLON: 2,
}

export const FIELDS = {
  description: 'Descripción',
  product: 'Producto',
  type: 'Tipo',
  size: 'Tamaño',
  price: 'Precio',
  status: 'Estado',
  active: 'Activo',
  actions: 'Acciones',
  name: 'Nombre',
  last_name: 'Apellido',
  count: 'Cantidad',
  alias: 'Apodo',
  dni: 'DNI',
  phone_number: 'Teléfono ',
  address: 'Dirección',
  farm_field: 'Campo',
  date: 'Fecha',
  employee: 'Empleado',
  labor_unit: 'Tipo',
  meter_count: 'Metros',
  total: 'Total',
  bag_type: 'Tipo de bolsa',
  bag_size: 'Tamaño de bolsa',
  minutes: 'Minutos',
  hours: 'Horas',
  hour_price: 'Precio por hora',
  minute_price: 'Precio por minuto',
  owner_price: 'Ganancia',
  owner_daily_price: 'Ganancia por día',
  owner_hour_price: 'Ganancia por hora',
  owner_minute_price: 'Ganancia por minuto',
}

export const PAYMENT_STATUS = {
  NOT_PAY: 0,
  IN_PROGRESS: 1,
  PAID: 2,
}

export const PAYMENT_STATUS_LABEL = {
  0: 'NO PAGADO',
  1: 'EN PROGRESO',
  2: 'PAGADO',
}

export const PAYMENT_INVOICE_TYPE = {
  EMBOLSADA_DE_CEBOLLA: 'EMBOLSADA_DE_CEBOLLA',
  EMBOLSADA_DE_ZAPALLO: 'EMBOLSADA_DE_ZAPALLO',
  ARRANCADA_DE_CEBOLLA: 'ARRANCADA_DE_CEBOLLA',
  ARRANCADA_DE_AJO: 'ARRANCADA_DE_AJO',
  TRABAJO_POR_DIA_DESYUYADA_CEBOLLA: 'TRABAJO_POR_DIA_DESYUYADA_CEBOLLA',
  TRABAJO_POR_DIA_DESYUYADA_AJO: 'TRABAJO_POR_DIA_DESYUYADA_AJO',
}
export const PAYMENT_INVOICE_TYPE_LABEL = {
  EMBOLSADA_DE_CEBOLLA: 'Descolada',
  EMBOLSADA_DE_ZAPALLO: 'Embolsada de zapallo',
  ARRANCADA_DE_CEBOLLA: 'Arrancada de cebolla',
  ARRANCADA_DE_AJO: 'Arrancada de ajo',
  TRABAJO_POR_DIA_DESYUYADA_CEBOLLA: 'Desyuyada de cebolla por día',
  TRABAJO_POR_DIA_DESYUYADA_AJO: 'Desyuyada de ajo por día',
}

export const ROLES = {
  ADMINISTRADOR_PRINCIPAL: 'Administrador Principal',
  ADMINISTRADOR_SECUNDARIO: 'Administrador Secundario',
  OPERADOR: 'Operador',
}

export const INVALID_PHONE_NUMBERS = [
  '00000000',
  '0000000',
  '11111111',
  '1111111',
  '22222222',
  '2222222',
  '33333333',
  '3333333',
  '44444444',
  '4444444',
  '55555555',
  '5555555',
  '66666666',
  '6666666',
  '77777777',
  '7777777',
  '88888888',
  '8888888',
  '99999999',
  '9999999',
  '12341234',
  '1234123',
  '12345678',
  '1234567',
]
export const PHONE_MIN_LENGTH = 6
export const PHONE_MAX_LENGTH = 8
export const CODE_MIN_LENGTH = 2
export const CODE_MAX_LENGTH = 4
export const PHONE_NUMBER_LENGTH_VALID = 10
export const isNumber = /^[0-9]+$/