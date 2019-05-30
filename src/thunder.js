/**
 * Main thunder interface
 */

import { Controller } from './plugins/controller.js'

class Thunder {
	constructor(host) {
		this._host = host
		this._services = {}
	}

	getService(serviceName) {
		if (this._services[ serviceName ])
			return this._services[ serviceName ]


		let resp
		switch(serviceName) {
			case 'controller':
				resp = new Controller(this, this._host)
				this._services[ serviceName ] = resp
				break
		}

		return resp
	}
}

export default Thunder

const REFRESH_INTERVAL = 500
