/** Base plugin for Thunder based devices */

import { EventEmitter } from '../lib/EventEmitter.js'

export class BasePlugin extends EventEmitter {
    constructor(host, api) {
    	super()
        this._api = api
    }

    req(method, params){
        return this._api.req(this._namespace + method, params)
    }

    _emitNotification(event, params) {
    	this.emit(event, params)
    }

    _registerNotifications() {
    	for (let i=0; i<this._notifications.length; i++) {
    		this._api.registerNotification(this._namespace, this._notifications[i],  this._emitNotification)
    	}
    }
}
