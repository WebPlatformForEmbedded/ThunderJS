const controller = (method, params, ws) => {
  let result

  switch (method) {
    case 'activate':
    case 'deactivate':
    case 'startdiscovery':
    case 'storeconfig':
    case 'download':
    case 'delete':
    case 'harakiri':
      result = null
      break
    case 'status':
      result = [
        {
          callsign: 'DeviceInfo',
          locator: 'libWPEFrameworkDeviceInfo',
          classname: 'DeviceInfo',
          autostart: 'True',
          precondition: ['Platform'],
          configuration: {},
          state: 'activated',
          processedrequests: 2,
          processedobjects: 0,
          observers: 0,
          module: 'Plugin_DeviceInfo',
          hash: 'custom',
        },
      ]
      break
    case 'links':
      result = [
        {
          remote: 'localhost:52116',
          state: 'RawSocket',
          activity: false,
          id: 1,
          name: 'Controller',
        },
      ]
      break
    case 'processinfo':
      result = {
        threads: [0],
        pending: 0,
        occupation: 2,
      }
      break
    case 'subsystems':
      result = [
        {
          subsystem: 'Platform',
          active: true,
        },
      ]
      break
    case 'discoveryresults':
      result = [
        {
          locator: '',
          latency: 0,
          model: '',
          secure: true,
        },
      ]
      break
    case 'environment':
      result = '/bin/sh'
      break
    case 'configuration':
      result = {}
      break
    case 'register':
      // start sending notifications
      sendNotification([params.id, params.event].join('.'), ws)
      result = 0
      break

    case 'unregister':
      clearTimeout(notifications[[params.id, params.event].join('.')])
      result = 0
      break
  }

  return result
}

const notifications = {}

const sendNotification = (method, ws) => {
  clearTimeout(notifications[method])
  console.log('send notification', method)
  const body = {
    jsonrpc: '2.0',
    method: method,
    params: { value: Math.random() },
  }
  ws.send(JSON.stringify(body))
  // recursive
  notifications[method] = setTimeout(() => {
    sendNotification(method, ws)
  }, (Math.random() * 10 + 1) * 1000) // random timeout between 1 and 10 seconds
}

export default controller
