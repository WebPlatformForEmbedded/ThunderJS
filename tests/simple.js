/*
 * Simple Thunder test
 */

import { Thunder } from '../src/thunder.js'

let t = new Thunder('192.168.11.101')


t.on('onopen', () => {
	let controller = t.getService('Controller')
	console.log('got Controller', controller)

	controller.status().then( (status) => {
		console.log('got status:', status)
	}).catch( err => {
		console.error('Oops', err)
	})

	let deviceInfo = t.getService('DeviceInfo')

	console.log('got DeviceInfo', deviceInfo)

	deviceInfo.system().then( (system) => {
		console.log('got system info:', system)
	}).catch( err => {
		console.error('Oops', err)
	})
})



