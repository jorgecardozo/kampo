type LogData = Record<string, any>

let debugEnabled = false

const formatLog = (level: string, event: string, data: LogData) =>
  JSON.stringify({
    level,
    event,
    ...data,
    timestamp: new Date().toISOString(),
  })

const logger = {
  setDebug: (enabled: boolean) => {
    debugEnabled = enabled
  },

  info: (event: string, data: LogData = {}) => {
    if (!debugEnabled) return
    console.log(formatLog('INFO', event, data))
  },

  error: (event: string, data: LogData = {}) => {
    console.error(formatLog('ERROR', event, data))
  },
}

export default logger
