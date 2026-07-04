// Models
import { Address } from 'models/Address.model'

// Utils
import {
  HTTP_REQUEST_ERROR_CODES,
  errorMapping,
  VALID_CUITLS,
  FOREIGN_DNI_MIN_LENGTH,
  DNI_MIN_VALUE,
  DNI_MAX_VALUE,
} from './constants'

import { startOfWeek, parseISO, format } from 'date-fns'

export const formatNumber = (x) => {
  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return parts.join(',')
}

export const formatDate = (d) => {
  const dateTmp = new Date(d)
  const userTimezoneOffset = dateTmp.getTimezoneOffset() * 60000
  const date = new Date(dateTmp.getTime() + userTimezoneOffset)
  const yyyy = date.getFullYear()
  let mm: string | number = date.getMonth() + 1
  let dd: string | number = date.getDate()

  if (dd < 10) dd = '0' + dd
  if (mm < 10) mm = '0' + mm

  return dd + '/' + mm + '/' + yyyy
}

export const formatBytes = (bytes): string => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed())} ${sizes[i]}`
}

export const hasErrorResponse = (response) =>
  Object.prototype.hasOwnProperty.call(response, 'statusCode') &&
  HTTP_REQUEST_ERROR_CODES.includes(response.statusCode)

export const getCurrentDate = () => {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()

  return `${day}/${month}/${year}`
}

export const isResponseValid = (response) =>
  !response ||
    HTTP_REQUEST_ERROR_CODES.includes(
      response?.code || response?.statusCode || response?.status
    )
    ? false
    : true

export const isEmptyObject = (obj) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false // El objeto tiene al menos una propiedad
    }
  }
  return true // El objeto está vacío
}

export const getErrorMessage = (error) => {
  if (!error || !error.code || !error.message) {
    return 'Error desconocido. Por favor, inténtalo nuevamente más tarde.'
  }

  const errorType = error.code || error.name
  const errorMessage = error.message

  if (errorMapping[errorType] && errorMapping[errorType][errorMessage]) {
    return errorMapping[errorType][errorMessage]
  }

  return 'Algo salió mal. Por favor, inténtalo nuevamente más tarde.'
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatAddress = (address: Address): string => {
  const {
    street,
    street_number,
    floor,
    department,
    locality,
    province,
    postal_code,
  } = address

  let formattedAddress = `${street} ${street_number}`

  if (floor && department) {
    formattedAddress += `, ${floor} ${department}`
  } else if (floor) {
    formattedAddress += `, ${floor}`
  } else if (department) {
    formattedAddress += `, ${department}`
  }

  if (locality) {
    formattedAddress += `, ${locality}`
  }
  if (province) {
    formattedAddress += `, ${province}`
  }
  if (postal_code) {
    formattedAddress += `, ${postal_code}`
  }

  return formattedAddress
}

export const validateCuitl = (cuitl) => {
  const isNumber = /^\d$/
  const first_code = cuitl?.substring(0, 2)
  const lastCode = cuitl?.charAt(cuitl.length - 1)

  return (
    (VALID_CUITLS.includes(Number(first_code)) && isNumber.test(lastCode)) ||
    'El CUIT o CUIL no es válido'
  )
}

export const getUserAttributes = (session: any) => {
  /* eslint-disable indent */
  return session?.attributes
    ? {
      name: session.attributes.name,
      lastName: session.attributes.lastName,
      cuitl: session.attributes['custom:cuitl'],
      gender: session.attributes['custom:gender'],
      phoneNumber: session.attributes.phone_number,
      email: session.attributes.email,
      session: null,
    }
    : {}
  /* eslint-enable indent */
}

export const isValidDniForeign = (dni) =>
  dni.length >= FOREIGN_DNI_MIN_LENGTH && dni.startsWith('9')

export const isValidValueDni = (dni) =>
  dni >= DNI_MIN_VALUE && dni <= DNI_MAX_VALUE

export const formatNumberPrice = (numberString) => {
  const [integerPart, decimalPart] = String(numberString).split('.')
  const withThousandSeparators = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    '.'
  )

  // Si no hay decimales o son "00", no mostrar decimales
  if (!decimalPart || decimalPart === '00') {
    return withThousandSeparators
  }

  // Si hay decimales válidos (no "00"), mostrarlos
  return `${withThousandSeparators},${decimalPart}`
}

export const getWeekRange = () => {
  const currentDate = new Date()
  // Encuentra el lunes de la semana actual
  const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 }) // Lunes

  // Calcula el sábado de la semana actual
  const saturdayDate = new Date(startOfWeekDate)
  saturdayDate.setDate(saturdayDate.getDate() + 5) // Sábado

  // Establece el rango final basado en la fecha actual
  const startDate = startOfWeekDate
  const endDate = currentDate <= saturdayDate ? currentDate : saturdayDate

  return { startDate, endDate }
}

export const formatDateString = (dateString: string) => {
  // Convierte el string a un objeto Date
  const date = parseISO(dateString)

  // Formatea la fecha al formato deseado
  return format(date, 'dd-MM-yyyy') // Por ejemplo, "02/07/2024"
}

export const harvestGrouping = (data) => {
  const group = data.reduce((acc, item) => {
    const { id, attributes } = item
    const { count, meter_count, harvest_price, farm_field, person } = attributes
    const { labor_unit, price } = harvest_price.data.attributes
    const personName = `${person.data.attributes.name} ${person.data.attributes.last_name}`

    // Clave para agrupar
    const clave = `${personName}-${farm_field.data.id}-${labor_unit.data.id}-${harvest_price.data.id}-${meter_count}`

    // Si la clave ya existe, suma la cantidad
    if (acc[clave]) {
      acc[clave].count += parseInt(count, 10)
      acc[clave].total +=
        parseInt(count, 10) * parseFloat(meter_count) * parseFloat(price)
    } else {
      // Si no existe, crea una nueva entrada
      acc[clave] = {
        employee: personName,
        name: person.data.attributes.name,
        last_name: person.data.attributes.last_name,
        farm_field: farm_field.data.attributes.description,
        farm_field_id: farm_field.data.id,
        labor_unit: labor_unit.data.attributes.description,
        count: parseInt(count, 10),
        meter_count: parseInt(meter_count, 10),
        price: parseFloat(price),
        total:
          parseInt(count, 10) * parseFloat(meter_count) * parseFloat(price),
        elements: [], // Array para almacenar los elementos originales
      }
    }

    // Añadir el elemento original al array correspondiente en acc
    acc[clave].elements.push({
      id: id,
      attributes: attributes,
    })

    return acc
  }, {})

  return Object.values(group)
}

export const grouping = (data) => {
  const group = data.reduce((acc, item) => {
    const { id, attributes } = item
    const { count, bag_price, farm_field, person } = attributes
    const { bag_type, bag_size, price } = bag_price.data.attributes
    const personName = `${person.data.attributes.name} ${person.data.attributes.last_name}`

    // Clave para agrupar
    const clave = `${personName}-${farm_field.data.id}-${bag_type.data.id}-${bag_size.data.id}`

    // Si la clave ya existe, suma la cantidad
    if (acc[clave]) {
      acc[clave].count += parseInt(count, 10)
      acc[clave].total += parseInt(count, 10) * parseFloat(price)
    } else {
      // Si no existe, crea una nueva entrada
      acc[clave] = {
        employee: personName,
        name: person.data.attributes.name,
        last_name: person.data.attributes.last_name,
        dni: person.data.attributes.dni,
        address: person.data.attributes.address,
        farm_field: farm_field.data.attributes.description,
        farm_field_id: farm_field.data.id,
        bag_type: bag_type.data.attributes.description,
        bag_size: bag_size.data.attributes.description,
        count: parseInt(count, 10),
        price: parseFloat(price),
        total: parseInt(count, 10) * parseFloat(price),
        elements: [], // Array para almacenar los elementos originales
      }
    }

    // Añadir el elemento original al array correspondiente en acc
    acc[clave].elements.push({
      id: id,
      attributes: attributes,
    })

    return acc
  }, {})

  return Object.values(group)
}

export const dailyWorkGrouping = (data) => {
  const group = data.reduce((acc, item) => {
    const { id, attributes } = item
    const { count, hours, minutes, daily_price, farm_field, person } =
      attributes
    const { price, hour_price, minute_price, hours_per_day } =
      daily_price.data.attributes

    const hourPerDay = parseInt(hours_per_day, 10)
    const personName = `${person.data.attributes.name} ${person.data.attributes.last_name}`
    let total = 0
    if (count) {
      total += parseInt(count, 10) * price
    }
    if (hours) {
      total += parseInt(hours, 10) * hour_price
    }
    if (minutes) {
      total += parseInt(minutes, 10) * minute_price
    }
    // Clave para agrupar
    const clave = `${personName}-${farm_field.data.id}-${price}`

    // Si la clave ya existe, suma la cantidad
    if (acc[clave]) {
      acc[clave].count += parseInt(count, 10)
      acc[clave].hours += parseInt(hours, 10)
      acc[clave].minutes += parseInt(minutes, 10)
      acc[clave].total += total
    } else {
      // Si no existe, crea una nueva entrada
      acc[clave] = {
        employee: personName,
        name: person.data.attributes.name,
        last_name: person.data.attributes.last_name,
        farm_field: farm_field.data.attributes.description,
        farm_field_id: farm_field.data.id,
        count: parseInt(count, 10),
        hours: parseInt(hours, 10),
        minutes: parseInt(minutes, 10),
        price: parseFloat(price),
        hour_price: parseFloat(hour_price),
        minute_price: parseFloat(minute_price),
        total: total,
        elements: [], // Array para almacenar los elementos originales
      }
    }

    // Añadir el elemento original al array correspondiente en acc
    acc[clave].elements.push({
      id: id,
      attributes: attributes,
    })

    return acc
  }, {})

  return Object.values(group)
}

export const getOnionPaymentInvoice = (data) => {
  // Inicializa los valores que vamos a calcular
  let totalCount = 0
  let totalPrice = 0
  let startDate = null
  let endDate = null
  const services = []

  // Itera sobre cada objeto en el array
  data.forEach((item) => {
    const { attributes } = item
    const { date, count } = attributes
    const { price, bag_type, bag_size } = attributes.bag_price.data.attributes

    // Convierte el 'count' a número
    const countNumber = parseInt(count)

    // Calcula el total de 'count' y el total del precio
    totalCount += countNumber
    totalPrice += countNumber * price

    // Ajusta la fecha de inicio y fin
    const currentDate = new Date(date)
    if (!startDate || currentDate < new Date(startDate)) startDate = date
    if (!endDate || currentDate > new Date(endDate)) endDate = date

    // Añade el servicio al array
    services.push({
      date: date,
      count: countNumber,
      measurement_unit: 'bolsa',
      bag_type: bag_type.data.attributes.description,
      bag_size: bag_size.data.attributes.description,
      unit_price: price,
      sub_total: countNumber * price,
    })
  })

  // Extrae los detalles de la persona y del campo de cultivo
  const person = data[0].attributes.person.data.attributes
  const farmField = data[0].attributes.farm_field.data.attributes.description

  // Construye el objeto final
  const result = {
    name: person.name,
    last_name: person.last_name,
    farm_field: farmField,
    phone_number: person.phone_number,
    address: person.address,
    dni: person.dni,
    startDate: startDate,
    endDate: endDate,
    service: data[0].attributes.description,
    total_count: totalCount,
    total_price: totalPrice,
    services: services,
  }

  return result
}

export const getHarvestPaymentInvoice = (data) => {
  // Inicializa los valores que vamos a calcular
  let totalCount = 0
  let totalPrice = 0
  let startDate = null
  let endDate = null
  const services = []

  // Itera sobre cada objeto en el array
  data.forEach((item) => {
    const { attributes } = item
    const { date, count, meter_count } = attributes
    const { price, labor_unit } = attributes.harvest_price.data.attributes

    // Convierte el 'count' a número
    const countNumber = parseInt(count)
    const meterCountNumber = meter_count

    // Calcula el total de 'count' y el total del precio
    totalCount += countNumber
    totalPrice += countNumber * meterCountNumber * price

    // Ajusta la fecha de inicio y fin
    const currentDate = new Date(date)
    if (!startDate || currentDate < new Date(startDate)) startDate = date
    if (!endDate || currentDate > new Date(endDate)) endDate = date

    // Añade el servicio al array
    services.push({
      date: date,
      count: countNumber,
      meter_count: meterCountNumber,
      measurement_unit: 'Arrancada Cebolla',
      labor_unit: labor_unit.data.attributes.description,
      unit_price: price,
      sub_total: countNumber * meterCountNumber * price,
    })
  })

  // Extrae los detalles de la persona y del campo de cultivo
  const person = data[0].attributes.person.data.attributes
  const farmField = data[0].attributes.farm_field.data.attributes.description

  // Construye el objeto final
  const result = {
    name: person.name,
    last_name: person.last_name,
    farm_field: farmField,
    phone_number: person.phone_number,
    address: person.address,
    dni: person.dni,
    startDate: startDate,
    endDate: endDate,
    service: data[0].attributes.description,
    total_count: totalCount,
    total_price: totalPrice,
    services: services,
  }

  return result
}

export const getDailyWorkPaymentInvoice = (data, label) => {
  // Inicializa los valores que vamos a calcular
  let totalCount = 0
  let totalHours = 0
  let totalMinutes = 0
  let totalPrice = 0
  let startDate = null
  let endDate = null
  const services = []

  // Itera sobre cada objeto en el array
  data.forEach((item) => {
    const { attributes } = item
    const { date, count, hours, minutes, daily_price } = attributes
    const { price, hour_price, minute_price } = daily_price.data.attributes

    // Convierte el 'count' a número
    let total_price = 0
    let total_count = 0
    let total_hours = 0
    let total_minutes = 0
    if (count) {
      total_price += parseInt(count, 10) * price
      total_count += parseInt(count, 10)
    }
    if (hours) {
      total_price += parseInt(hours, 10) * hour_price
      total_hours += parseInt(hours, 10)
    }
    if (minutes) {
      total_price += parseInt(minutes, 10) * minute_price
      total_minutes += parseInt(minutes, 10)
    }
    totalPrice += total_price
    totalCount += total_count
    totalHours += total_hours
    totalMinutes += total_minutes

    // Ajusta la fecha de inicio y fin
    const currentDate = new Date(date)
    if (!startDate || currentDate < new Date(startDate)) startDate = date
    if (!endDate || currentDate > new Date(endDate)) endDate = date

    // Añade el servicio al array
    services.push({
      date: date,
      count: total_count,
      hours: total_hours,
      minutes: total_minutes,
      measurement_unit: label,
      labor_unit: 'Día',
      unit_price: price,
      unit_hour_price: hour_price,
      unit_minute_price: minute_price,
      sub_total: total_price,
    })
  })

  // Extrae los detalles de la persona y del campo de cultivo
  const person = data[0].attributes.person.data.attributes
  const farmField = data[0].attributes.farm_field.data.attributes.description

  // Construye el objeto final
  const result = {
    name: person.name,
    last_name: person.last_name,
    farm_field: farmField,
    phone_number: person.phone_number,
    address: person.address,
    dni: person.dni,
    startDate: startDate,
    endDate: endDate,
    service: data[0].attributes.description,
    total_count: totalCount,
    total_hours: totalHours,
    total_minutes: totalMinutes,
    total_price: totalPrice,
    services: services,
  }

  return result
}

export const calculateBaggingTotalsByStatus = (data) => {
  const totals = {
    total_price_no_pay: 0,
    total_price_in_progress: 0,
    total_price_pay: 0,
    total_owner_price_no_pay: 0,
    total_owner_price_in_progress: 0,
    total_owner_price_pay: 0,
    total_people: 0,
  }

  const uniquePersons = new Set()

  data.forEach((item) => {
    const { attributes } = item
    const { count, bag_price, person, status } = attributes
    const price = parseFloat(bag_price.data.attributes.price)
    const ownerPrice = parseFloat(bag_price.data.attributes.owner_price || 0) // Asegúrate de que owner_price exista

    uniquePersons.add(person.data.attributes.dni)

    switch (status) {
      case 0: // No pagado
        totals.total_price_no_pay += count * price
        totals.total_owner_price_no_pay += count * ownerPrice
        break
      case 1: // En progreso
        totals.total_price_in_progress += count * price
        totals.total_owner_price_in_progress += count * ownerPrice
        break
      case 2: // Pagado
        totals.total_price_pay += count * price
        totals.total_owner_price_pay += count * ownerPrice
        break
      default:
        break
    }
  })

  totals.total_people = uniquePersons.size

  return totals
}

export const calculateDailyWorkTotalsByStatus = (data) => {
  const totals = {
    total_price_no_pay: 0,
    total_price_in_progress: 0,
    total_price_pay: 0,
    total_owner_price_no_pay: 0,
    total_owner_price_in_progress: 0,
    total_owner_price_pay: 0,
    total_people: 0,
  }

  const uniquePersons = new Set()

  data.forEach((item) => {
    const { attributes } = item
    const { count, hours, minutes, daily_price, person, status } = attributes
    const {
      price = 0,
      hour_price = 0,
      minute_price = 0,
      owner_price = 0,
      owner_hour_price = 0,
      owner_minute_price = 0,
    } = daily_price.data.attributes
    const dni = person.data.attributes.dni

    uniquePersons.add(dni)

    let total = 0
    let ownerTotal = 0

    if (count) {
      total += parseInt(count, 10) * price
      ownerTotal += parseInt(count, 10) * owner_price
    }
    if (hours) {
      total += parseInt(hours, 10) * hour_price
      ownerTotal += parseInt(hours, 10) * owner_hour_price
    }
    if (minutes) {
      total += parseInt(minutes, 10) * minute_price
      ownerTotal += parseInt(minutes, 10) * owner_minute_price
    }

    switch (status) {
      case 0: // No pagado
        totals.total_price_no_pay += total
        totals.total_owner_price_no_pay += ownerTotal
        break
      case 1: // En progreso
        totals.total_price_in_progress += total
        totals.total_owner_price_in_progress += ownerTotal
        break
      case 2: // Pagado
        totals.total_price_pay += total
        totals.total_owner_price_pay += ownerTotal
        break
      default:
        break
    }
  })

  totals.total_people = uniquePersons.size

  return totals
}

export const calculateHarvestTotalsByStatus = (data) => {
  const totals = {
    total_price_no_pay: 0,
    total_price_in_progress: 0,
    total_price_pay: 0,
    total_owner_price_no_pay: 0,
    total_owner_price_in_progress: 0,
    total_owner_price_pay: 0,
    total_people: 0,
  }

  const uniquePersons = new Set()

  data.forEach((item) => {
    const { attributes } = item
    const { count, meter_count, harvest_price, person, status } = attributes
    const { price = 0, owner_price = 0 } = harvest_price.data.attributes
    const dni = person.data.attributes.dni

    uniquePersons.add(dni)

    let total = 0
    let ownerTotal = 0

    if (count && meter_count) {
      total += parseInt(count, 10) * meter_count * price
      ownerTotal += parseInt(count, 10) * meter_count * owner_price
    }

    switch (status) {
      case 0: // No pagado
        totals.total_price_no_pay += total
        totals.total_owner_price_no_pay += ownerTotal
        break
      case 1: // En progreso
        totals.total_price_in_progress += total
        totals.total_owner_price_in_progress += ownerTotal
        break
      case 2: // Pagado
        totals.total_price_pay += total
        totals.total_owner_price_pay += ownerTotal
        break
      default:
        break
    }
  })

  totals.total_people = uniquePersons.size

  return totals
}

export const formatPointOfSaleNumber = (number) => {
  return number.toString().padStart(4, '0')
}

export const formatInvoiceNumber = (number) => {
  return number.toString().padStart(8, '0')
}

export const getNestedProperty = (obj: any, reference: string) => {
  return reference.split('.').reduce((o, k) => o && o[k], obj)
}