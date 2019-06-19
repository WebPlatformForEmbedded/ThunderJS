import WebSocket from 'isomorphic-ws'

const endpoint = '/' // jsonrpc
const protocols = 'notification'

export default host => {
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
              onmessage(JSON.parse(message.data))
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

  // should be a real module (queue.push, queue.get, queue.once, queue.delete etc.)
  const requestsQueue = {}

  const onmessage = data => {
    const request = requestsQueue[data.id]
    if (request) {
      if (data.result) request.resolve(data.result)
      else request.reject(data.error)
      delete requestsQueue[data.id]
    } else {
      console.log('no pending request found with id ' + data.id)
    }
  }

  return {
    request(plugin, method, params) {
      return new Promise((resolve, reject) => {
        const requestId = getId()
        const body = {
          jsonrpc: '2.0',
          id: requestId,
          method: [plugin, method].join('.'),
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
