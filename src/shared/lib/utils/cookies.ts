export const getCookie = (name) => {
  const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)

  if (!cookieValue) return ''

  try {
    const decodedValue = decodeURIComponent(cookieValue.pop())

    // Intentar analizar como JSON
    if (decodedValue.startsWith('{') || decodedValue.startsWith('[')) {
      return JSON.parse(decodedValue)
    }

    return decodedValue
  } catch (e) {
    console.error('Error parsing cookie:', e)
    return null
  }
}

export const resetCookie = (name) => {
  const expirationDate = new Date()
  expirationDate.setTime(expirationDate.getTime() - 1)
  document.cookie = `${name}=; expires=${expirationDate.toUTCString()}; path=/`
}

export const setCookie = (name, value, options: Options = {}) => {
  let stringValue

  if (typeof value === 'object') {
    try {
      stringValue = JSON.stringify(value)
    } catch (e) {
      console.error('Error stringifying cookie value', e)
      return
    }
  } else {
    stringValue = String(value)
  }

  let cookieString = `${name}=${encodeURIComponent(stringValue)}`

  if (options.expires) {
    if (typeof options.expires === 'number') {
      const expirationDate = new Date()
      expirationDate.setTime(expirationDate.getTime() + options.expires)
      cookieString += `; expires=${expirationDate.toUTCString()}`
    } else if (options.expires instanceof Date) {
      cookieString += `; expires=${options.expires.toUTCString()}`
    }
  }

  if (options.path) {
    cookieString += `; path=${options.path}`
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`
  }

  if (options.secure) {
    cookieString += '; secure'
  }

  if (options.sameSite) {
    cookieString += `; sameSite=${options.sameSite}`
  }

  document.cookie = cookieString
}

type Options = {
  expires?: Date | number | string
  path?: string
  domain?: string
  sameSite?: string
  secure?: boolean
}
