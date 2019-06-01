/**
 * Main thunder interface
 */

import { EventEmitter } from './lib/EventEmitter.js'
import { JsonRPC } from './lib/jsonrpc.js'
import { Controller } from './plugins/controller.js'
import { DeviceInfo } from './plugins/deviceInfo.js'

export class Thunder extends EventEmitter {
	constructor(host) {
		super()
		this._host = host
		this._services = {}

		this._api = new JsonRPC(host)

		this._api.connect()
		this._api.on('onopen', () => { this.emit('onopen') })
		this._api.on('onclose', (e) => { this.emit('onclose', e) })
		this._api.on('onerror', (err) => { this.emit('onerror', err) })
	}

	getService(serviceName) {
		if (this._api.connected === false)
			return null

		if (this._services[ serviceName ])
			return this._services[ serviceName ]

		let resp
		switch(serviceName) {
			case 'Controller':
				resp = new Controller(this._host, this._api)
				break

			case 'DeviceInfo':
				resp = new DeviceInfo(this._host, this._api)
				break
		}

		this._services[ serviceName ] = resp
		return resp
	}
}
