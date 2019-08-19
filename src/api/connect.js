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
            requestQueueResolver(message.data)
          })
          socket.addEventListener('message', message => {
            notificationListener(message.data)
          })
        }
        socket.addEventListener('open', () => {
          notificationListener({
            method: 'client.ThunderJS.events.connect',
          })
          connection = socket
          resolve(connection)
        })

        socket.addEventListener('close', () => {
          notificationListener({
            method: 'client.ThunderJS.events.disconnect',
          })
          socket = null
          connection = null
        })
      } catch (e) {
        reject(e)
      }
    }
  })
}
