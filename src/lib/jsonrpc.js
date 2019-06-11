/** JSON RPC main interface to Thunder based devices */
import { EventEmitter } from './EventEmitter.js'

export class JsonRPC extends EventEmitter {
	constructor(host) {
        super()

        this._callbackQueue = {}
		this._host = host
		this._id = 0
        this._notificationId = 0
        this._notificationCallbackQueue = {}
		this._socket = undefined
		this._services = {}

        this._connected = false
	}

    set connected(isConnected)  { this._connected = isConnected }
    get connected()             { return this._connected }

    connect(cb) {
        if (this._socket && this._socket.readyState !== 1) this._socket.close()
        this._socket = new WebSocket( `ws://${this._host}/jsonrpc`, 'notification')
        var self = this
        this._socket.onmessage = function(e){
            var data = {}
            try {
                console.log('RECV:', e.data)
                data = JSON.parse(e.data)

                if (!data)
                    return

                // normal jsonrpc message
                if (data.id && self._callbackQueue[data.id]){
                    self._callbackQueue[data.id](data.error, data.result);
                    return delete self._callbackQueue[data.id]
                }

                // notification
                // notifications are without id on the json rpc object, however Thunder provides an event id on the params
                // check if that is present and if we have that id in the _notificationCallbackQueue, then call it
                if (!data.id && data.method && data.params && data.params.id && self._notificationCallbackQueue[ data.params.id ])
                    self._notificationCallbackQueue[ data.params.id ](data.method, data.params)

            } catch (e) {
                return console.error('socket error', e)
            }
        }

        this._socket.onopen = (evt) => {
            this.connected = true
            this.emit('onopen')
            console.log('Socket connected')
        }

        this._socket.onclose = (e) => {
            this.connected = true
            this.emit('onclose', e)
            console.log('Socket closed')
            setTimeout(this.connect.bind(this), 500, cb)
        }

        this._socket.onerror = (err) => {
            this.connected = false
            this.emit('onerror', err)
            console.log('Socket error', err)
            this._socket.close()
        }
    }

    _req(method, params) {
        return new Promise( (resolve, reject) => {
            var body = {
                'jsonrpc'   : '2.0',
                'id'        : this._id,
                'method'    : method,
                'params'    : params || {},
            }

            if (this._socket) {
                this._callbackQueue[this._id] = (err, results) => {
                    if (err)
                        reject(err)
                    else
                        resolve(results)
                }

                console.log('SEND: ', body)
                this._socket.send(JSON.stringify(body))
                this._id++
            }
        })
    }

    registerNotification(plugin, event, callback) {
        this._notificationId++
        this._notificationCallbackQueue[ this._notificationId ] = callback

        this.req(`${plugin}register`, { 'event': event, id: `event.${this._notificationId}`})
        return this._notificationId
    }

    unregisterNotification(id) {
        return delete this._notificationCallbackQueue[ id ]
    }

    req(method, params){
        // socket isnt ready yet
        if (!this._socket || this._socket.readyState !== 1) {
            console.log('Socket is not connected')

            return new Promise( (resolve, reject) => {
                this._connect( () => {
                    this._req(method,params).then( (results) => {
                        resolve(results)
                    }).catch( err => {
                        reject(err)
                    })
                })
            })

        } else {
            return this._req(method, params)
        }
    }
}
