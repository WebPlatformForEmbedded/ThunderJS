import { listeners } from './store'

export default function(plugin, event, callback) {
  const thunder = this

  // register and keep track of the index
  const index = register.call(this, plugin, event, callback)

  return {
    dispose() {
      const listener_id = makeListenerId(plugin, event)
      listeners[listener_id].splice(index, 1)
      if (listeners[listener_id].length === 0) {
        unregister.call(thunder, plugin, event)
      }
    },
  }
}

// construct a unique id for the listener
const makeListenerId = (plugin, event) => {
  return ['client', plugin, 'events', event].join('.')
}

const register = function(plugin, event, callback) {
  const listener_id = makeListenerId(plugin, event)

  // no listener registered for this plugin/event yet
  if (!listeners[listener_id]) {
    // create an array to store this plugin/event's callback(s)
    listeners[listener_id] = []

    if (plugin !== 'ThunderJS') {
      const method = 'register'

      // remove 'event' from the listener_id to send as request id
      const request_id = listener_id
        .split('.')
        .slice(0, -1)
        .join('.')

      const params = {
        event,
        id: request_id,
      }
      this.call(plugin, method, params)
        .then()
        .catch()
    }
  }

  // register the callback
  listeners[listener_id].push(callback)

  // return the index of the callback (which can be used to dispose the callback)
  return listeners[listener_id].length - 1
}

const unregister = function(plugin, event) {
  const listener_id = makeListenerId(plugin, event)

  delete listeners[listener_id]

  // ThunderJS as a plugin means it's an internal event, so no need to make an API call
  if (plugin !== 'ThunderJS') {
    // request the server to stop sending us notifications for this event
    const method = 'unregister'

    // remove 'event' from the listener_id to send as request id
    const request_id = listener_id
      .split('.')
      .slice(0, -1)
      .join('.')

    const params = {
      event,
      id: request_id,
    }
    this.call(plugin, method, params)
      .then()
      .catch()
  }
}
