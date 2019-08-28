import WebSocket from 'isomorphic-ws'
import notificationListener from '../api/notificationListener'

const methodMapping = {
  'Console.messageAdded': 'log',
  'Canvas.canvasMemoryChanged': 'canvasChange',
}

let webInspectorSocket

const connect = function(id) {
  return new Promise((resolve, reject) => {
    if (webInspectorSocket) {
      resolve(webInspectorSocket)
    } else {
      this.api
        .request('Controller', 'status')
        .then(res => {
          const port = res
            .filter(plugin => plugin.callsign === 'WebKitBrowser')
            .shift()
            .configuration.inspector.split(':')
            .pop()

          webInspectorSocket = new WebSocket(`ws://${this.options.host}:${port}/devtools/page/1`)

          webInspectorSocket.on('message', msg => {
            const data = JSON.parse(msg)
            notificationListener({
              method: [id, methodMapping[data.method]].join('.'),
              params: data.params,
            })
          })

          webInspectorSocket.on('open', () => {
            resolve(webInspectorSocket)
          })
        })
        .catch(reject)
    }
  })
}

export default {
  register(params) {
    connect.call(this, params.id).then(socket => {
      socket.send('{"id":1,"method":"Console.enable"}')
    })
  },

  unregister() {
    connect.call(this).then(socket => {
      socket.send('{"id":10,"method":"Console.disable"}')
    })
  },
}
