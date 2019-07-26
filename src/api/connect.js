import WebSocket from 'isomorphic-ws'

import requestQueueResolver from './requestQueueResolver'
import notificationListener from './notificationListener'
import makeWebsocketAddress from './makeWebsocketAddress'

const protocols = 'notification'

let connection = null
let socket = null

export default options => {
  return new Promise((resolve, reject) => {
    if (connection) {
      resolve(connection)
    } else {
      try {
        if (!socket) {
          socket = new WebSocket(makeWebsocketAddress(options), protocols)
          socket.addEventListener('message', message => {
            requestQueueResolver(JSON.parse(message.data))
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
