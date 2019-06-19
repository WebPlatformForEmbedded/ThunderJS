const device = method => {
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
  }

  return result
}

export default device
