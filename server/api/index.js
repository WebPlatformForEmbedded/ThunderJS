import device from './device'
import controller from './controller'

const API = (plugin, method) => {
  console.log('API call', plugin, method)

  const plugins = {
    device,
    controller,
  }
  return plugins[plugin] ? plugins[plugin](method) : {}
}

export default API
