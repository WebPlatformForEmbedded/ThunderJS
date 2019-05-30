/*
 * Controller is responsible for starting/stopping plugins
 */

import { JsonRPC } from '../lib/jsonrpc.js'

export class Controller extends JsonRPC {
	constructor(host) {
		super(host)
		this._namespace = 'Controller.1.'
	}

	activate (plugin) 	{ return this.req('activate', {'callsign': plugin }) }
	deactivate (plugin) { return this.req('deactivate', {'callsign': plugin }) }
	status () 			{ return this.req('status') }
	discover () 		{ return this.req('discover', { 'ttl' : 1}) }
	storeconfig ()      { return this.req('storeconfig') }
	reboot () 			{ return this.req('harakiri') }
}
