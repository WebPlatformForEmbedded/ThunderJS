import WebSocket from 'isomorphic-ws'
import listeners from './listenersStore'

const endpoint = '/' // jsonrpc
const protocols = 'notification'
const defaultVersion = 1

const getVersion = (versions, plugin) => {
  return versions ? versions[plugin] || versions.default || defaultVersion : defaultVersion
}

export default (host, versions) => {
  let connection = null
  let socket = null
  const connect = () => {
    return new Promise((resolve, reject) => {
      if (connection) {
        resolve(connection)
      } else {
        try {
          if (!socket) {
            socket = new WebSocket('ws://' + host + endpoint, protocols)
            socket.addEventListener('message', message => {
              requestQueueResoler(JSON.parse(message.data))
            })
            socket.addEventListener('message', message => {
              notificationListener(JSON.parse(message.data))
            })
          }
          socket.addEventListener('open', () => {
            connection = socket
            resolve(connection)
          })
        } catch (e) {
          reject(e)
        }
      }
    })
  }

  let id = 0
  const getId = () => {
    id = id + 1
    return id
  }

  const requestsQueue = {}

  const requestQueueResoler = data => {
    if (data.id) {
      const request = requestsQueue[data.id]
      if (request) {
        if (data.result) request.resolve(data.result)
        else request.reject(data.error)
        delete requestsQueue[data.id]
      } else {
        console.log('no pending request found with id ' + data.id)
      }
    }
  }

  const notificationListener = data => {
    // determine if we're dealing with a notification
    if (!data.id && data.method) {
      // if so, so see if there exist callbacks
      const callbacks = listeners[data.method]
      if (callbacks && Array.isArray(callbacks) && callbacks.length) {
        callbacks.forEach(callback => {
          callback(data.params)
        })
      } else {
        console.log('no callbacks for ' + data.method)
      }
    }
  }

  return {
    request(plugin, method, params) {
      return new Promise((resolve, reject) => {
        const requestId = getId()
        const version = getVersion(versions, plugin)
        const body = {
          jsonrpc: '2.0',
          id: requestId,
          method: [plugin, version, method].join('.'),
          params: params || {},
        }

        requestsQueue[requestId] = {
          body,
          resolve,
          reject,
        }

        connect()
          .then(connection => {
            connection.send(JSON.stringify(body))
          })
          .catch(console.error)
      })
    },
  }
}
