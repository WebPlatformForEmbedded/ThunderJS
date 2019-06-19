import API from './api'
import plugins from './plugins'

let api

export default (options) => {
  api = API(options.host)
  return wrapper({...thunder, ...plugins})
}

const resolve = (result, args) => {
  // see if the last argument is a function (and assume it's the callback)
  const cb = typeof args[args.length - 1] === 'function' ? args[args.length - 1] : null
  if (cb) {
    result.then(res => cb(null, res)).catch(err => cb(err))
  } else {
    return result
  }
}

const thunder = {
    plugin: false,
    call() {
      // little trick to set the plugin name when calling from a plugin context
      const args = [...arguments]
      if(this.plugin) {
        args.unshift(this.plugin)
      }
      // when call is called from the root, with a plugin i.e thunderJS.call('device', 'version')
      else {
        const plugin = args[0]
        const method = args[1]
        delete args[0]
        return this[plugin][method](args)
      }

      return api.request.apply(this, args)

    },
    subscribe() {
      // subscribe to notification
      // to do
    },
    unsubscribe() {
      // unsubscribe from notification
      // to do
    },
    registerPlugin(name, plugin) {
        this[name] = wrapper(Object.assign(Object.create(thunder), plugin, {plugin: name}))
    }

}

const wrapper = obj => {
  return new Proxy(obj, {
    get(target, propKey) {
      const prop = target[propKey]
      if (typeof prop !== 'undefined') {
        if(typeof prop === 'function') {
          return function(...args) {
            return resolve(prop.apply(this, args), args)
          }
        }
        if(typeof prop === 'object') {
          return wrapper(Object.assign(Object.create(thunder), prop, {plugin: propKey}))
        }
        return prop
      } else {
        return function(...args) {
          args.unshift(propKey)
          return target.call.apply(this, args)
        }
      }
    },
  })
}
