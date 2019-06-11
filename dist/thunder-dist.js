var Thunder = (function (exports) {
    'use strict';

    /**
     * This is a partial (and more efficient) implementation of the event emitter.
     * It attempts to maintain a one-to-one mapping between events and listeners, skipping an array lookup.
     * Only if there are multiple listeners, they are combined in an array.
     */
    class EventEmitter {

        constructor() {
            // This is set (and kept) to true when events are used at all.
            this._hasEventListeners = false;
        }

        on(name, listener) {
            if (!this._hasEventListeners) {
                this._eventFunction = {};
                this._eventListeners = {};
                this._hasEventListeners = true;
            }

            const current = this._eventFunction[name];
            if (!current) {
                this._eventFunction[name] = listener;
            } else {
                if (this._eventFunction[name] !== EventEmitter.combiner) {
                    this._eventListeners[name] = [this._eventFunction[name], listener];
                    this._eventFunction[name] = EventEmitter.combiner;
                } else {
                    this._eventListeners[name].push(listener);
                }
            }
        }

        has(name, listener) {
            if (this._hasEventListeners) {
                const current = this._eventFunction[name];
                if (current) {
                    if (current === EventEmitter.combiner) {
                        const listeners = this._eventListeners[name];
                        let index = listeners.indexOf(listener);
                        return (index >= 0);
                    } else if (this._eventFunction[name] === listener) {
                        return true;
                    }
                }
            }
            return false;
        }

        off(name, listener) {
            if (this._hasEventListeners) {
                const current = this._eventFunction[name];
                if (current) {
                    if (current === EventEmitter.combiner) {
                        const listeners = this._eventListeners[name];
                        let index = listeners.indexOf(listener);
                        if (index >= 0) {
                            listeners.splice(index, 1);
                        }
                        if (listeners.length === 1) {
                            this._eventFunction[name] = listeners[0];
                            this._eventListeners[name] = undefined;
                        }
                    } else if (this._eventFunction[name] === listener) {
                        this._eventFunction[name] = undefined;
                    }
                }
            }
        }

        removeListener(name, listener) {
            this.off(name, listener);
        }

        emit(name, arg1, arg2, arg3) {
            if (this._hasEventListeners) {
                const func = this._eventFunction[name];
                if (func) {
                    if (func === EventEmitter.combiner) {
                        func(this, name, arg1, arg2, arg3);
                    } else {
                        func(arg1, arg2, arg3);
                    }
                }
            }
        }

        listenerCount(name) {
            if (this._hasEventListeners) {
                const func = this._eventFunction[name];
                if (func) {
                    if (func === EventEmitter.combiner) {
                        return this._eventListeners[name].length;
                    } else {
                        return 1;
                    }
                }
            } else {
                return 0;
            }
        }

        removeAllListeners(name) {
            if (this._hasEventListeners) {
                delete this._eventFunction[name];
                delete this._eventListeners[name];
            }
        }

    }

    EventEmitter.combiner = function(object, name, arg1, arg2, arg3) {
        const listeners = object._eventListeners[name];
        if (listeners) {
            // Because listener may detach itself while being invoked, we use a forEach instead of for loop.
            listeners.forEach((listener) => {
                listener(arg1, arg2, arg3);
            });
        }
    };

    EventEmitter.addAsMixin = function(cls) {
        cls.prototype.on = EventEmitter.prototype.on;
        cls.prototype.has = EventEmitter.prototype.has;
        cls.prototype.off = EventEmitter.prototype.off;
        cls.prototype.removeListener = EventEmitter.prototype.removeListener;
        cls.prototype.emit = EventEmitter.prototype.emit;
        cls.prototype.listenerCount = EventEmitter.prototype.listenerCount;
    };

    /** JSON RPC main interface to Thunder based devices */

    class JsonRPC extends EventEmitter {
    	constructor(host) {
            super();

            this._callbackQueue = {};
    		this._host = host;
    		this._id = 0;
            this._notificationId = 0;
            this._notificationCallbackQueue = {};
    		this._socket = undefined;
    		this._services = {};

            this._connected = false;
    	}

        set connected(isConnected)  { this._connected = isConnected; }
        get connected()             { return this._connected }

        connect(cb) {
            if (this._socket && this._socket.readyState !== 1) this._socket.close();
            this._socket = new WebSocket( `ws://${this._host}/jsonrpc`, 'notification');
            var self = this;
            this._socket.onmessage = function(e){
                var data = {};
                try {
                    console.log('RECV:', e.data);
                    data = JSON.parse(e.data);

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
                        self._notificationCallbackQueue[ data.params.id ](data.method, data.params);

                } catch (e) {
                    return console.error('socket error', e)
                }
            };

            this._socket.onopen = (evt) => {
                this.connected = true;
                this.emit('onopen');
                console.log('Socket connected');
            };

            this._socket.onclose = (e) => {
                this.connected = true;
                this.emit('onclose', e);
                console.log('Socket closed');
                setTimeout(this.connect.bind(this), 500, cb);
            };

            this._socket.onerror = (err) => {
                this.connected = false;
                this.emit('onerror', err);
                console.log('Socket error', err);
                this._socket.close();
            };
        }

        _req(method, params) {
            return new Promise( (resolve, reject) => {
                var body = {
                    'jsonrpc'   : '2.0',
                    'id'        : this._id,
                    'method'    : method,
                    'params'    : params || {},
                };

                if (this._socket) {
                    this._callbackQueue[this._id] = (err, results) => {
                        if (err)
                            reject(err);
                        else
                            resolve(results);
                    };

                    console.log('SEND: ', body);
                    this._socket.send(JSON.stringify(body));
                    this._id++;
                }
            })
        }

        registerNotification(plugin, event, callback) {
            this._notificationId++;
            this._notificationCallbackQueue[ this._notificationId ] = callback;

            this.req(`${plugin}register`, { 'event': event, id: `event.${this._notificationId}`});
            return this._notificationId
        }

        unregisterNotification(id) {
            return delete this._notificationCallbackQueue[ id ]
        }

        req(method, params){
            // socket isnt ready yet
            if (!this._socket || this._socket.readyState !== 1) {
                console.log('Socket is not connected');

                return new Promise( (resolve, reject) => {
                    this._connect( () => {
                        this._req(method,params).then( (results) => {
                            resolve(results);
                        }).catch( err => {
                            reject(err);
                        });
                    });
                })

            } else {
                return this._req(method, params)
            }
        }
    }

    /** Base plugin for Thunder based devices */

    class BasePlugin extends EventEmitter {
        constructor(host, api) {
        	super();
            this._api = api;
        }

        req(method, params){
            return this._api.req(this._namespace + method, params)
        }

        _emitNotification(event, params) {
        	this.emit(event, params);
        }

        _registerNotifications() {
        	for (let i=0; i<this._notifications.length; i++) {
        		this._api.registerNotification(this._namespace, this._notifications[i],  this._emitNotification);
        	}
        }
    }

    /*
     * Controller is responsible for starting/stopping plugins
     */

    class Controller extends BasePlugin {
    	constructor(host, api) {
    		super(host, api);
    		this._namespace = 'Controller.1.';

    		this._notifications = ['all', 'statechange', 'downloadcompleted'];
    		this._registerNotifications();
    	}

    	activate (plugin) 	{ return this.req('activate', {'callsign': plugin }) }
    	deactivate (plugin) { return this.req('deactivate', {'callsign': plugin }) }
    	status () 			{ return this.req('status') }
    	discover () 		{ return this.req('discover', { 'ttl' : 1}) }
    	storeconfig ()      { return this.req('storeconfig') }
    	reboot () 			{ return this.req('harakiri') }
    }

    /*
     * DeviceInfo plugin provides system information
     */

    class DeviceInfo extends BasePlugin {
    	constructor(host, api) {
    		super(host, api);
    		this._namespace = 'DeviceInfo.1.';
    	}

    	system () 	{ return this.req('system') }
    }

    /**
     * Main thunder interface
     */

    class Thunder extends EventEmitter {
    	constructor(host) {
    		super();
    		this._host = host;
    		this._services = {};

    		this._api = new JsonRPC(host);

    		this._api.connect();
    		this._api.on('onopen', () => { this.emit('onopen'); });
    		this._api.on('onclose', (e) => { this.emit('onclose', e); });
    		this._api.on('onerror', (err) => { this.emit('onerror', err); });
    	}

    	getService(serviceName) {
    		if (this._api.connected === false)
    			return null

    		if (this._services[ serviceName ])
    			return this._services[ serviceName ]

    		let resp;
    		switch(serviceName) {
    			case 'Controller':
    				resp = new Controller(this._host, this._api);
    				break

    			case 'DeviceInfo':
    				resp = new DeviceInfo(this._host, this._api);
    				break
    		}

    		this._services[ serviceName ] = resp;
    		return resp
    	}
    }

    exports.Thunder = Thunder;

    return exports;

}({}));
