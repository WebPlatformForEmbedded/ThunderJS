/*
 * DeviceInfo plugin provides system information
 */

import { BasePlugin } from './base.js'

export class DeviceInfo extends BasePlugin {
	constructor(host, api) {
		super(host, api)
		this._namespace = 'DeviceInfo.1.'
	}

	system () 	{ return this.req('system') }
}
