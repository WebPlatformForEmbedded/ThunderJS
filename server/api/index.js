import device from './device'
import controller from './controller'

const API = (plugin, version, method) => {
  console.log('API call:')
  console.log('Plugin -', plugin)
  console.log('Version -', version)
  console.log('Method -', method)

  const plugins = {
    device,
    controller,
  }
  return plugins[plugin] ? plugins[plugin](method) : {}
}

export default API
