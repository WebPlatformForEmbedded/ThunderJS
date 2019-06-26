import API from './api'
import plugins from './plugins'
import listener from './listener'

let api

export default (options) => {
  api = API(options.host)
  return wrapper({...thunder, ...plugins})
}

const resolve = (result, args) => {
  // make sure we always have a promise
  if (
    // not an object so definitely not a promise
    typeof result !== 'object' ||
    // an object that doesn't look like a promise
    (typeof result === 'object' && (!result.then || typeof result.then !== 'function'))

  ) {

    result = new Promise((resolve, reject) => {
      result instanceof Error === false ? resolve(result) : reject(result)
    })
  }


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
      // little trick to set the plugin name when calling from a plugin context (if not already set)
      const args = [...arguments]
      if(this.plugin) {
        args[0] !== this.plugin ? args.unshift(this.plugin) : null
      }
      // when call is called from the root, with a plugin i.e thunderJS.call('device', 'version')
      else {
        const plugin = args[0]
        this.plugin = plugin
      }
      const method = args[1]
      if(typeof this[this.plugin][method] == 'function') {
        return this[this.plugin][method](args)
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
        if(target.plugin === false) {
          return wrapper(Object.assign(Object.create(thunder), {}, {plugin: propKey}))
        }
        return function(...args) {
          args.unshift(propKey)
          return target.call.apply(this, args)
        }
      }
    },
  })
}
