import { Server } from 'ws'
import API from './api'

const port = process.env.PORT || 3030
const websocket = new Server({ port: port })

websocket.on('connection', function(ws) {
  console.log('Connected')

  ws.on('message', function(message) {
    const input = JSON.parse(message)

    const fullMethod = input.method.split('.')
    const plugin = fullMethod[0]
    const version = fullMethod[1]
    const method = fullMethod[2]

    const body = {
      jsonrpc: '2.0',
      id: input.id,
    }
    // fake output, usually a success response, sometimes an error
    Math.random() >= 0.3
      ? (body.result = API(plugin, version, method))
      : (body.error = 'Oops .. something went wrong')

    // simulate latency with a random timeout
    setTimeout(() => {
      ws.send(JSON.stringify(body))
    }, Math.random() * 2000)
  })

  ws.on('close', function() {
    console.log('Closing connection')
  })
})
