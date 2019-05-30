var Thunder = (function () {
    'use strict';

    /** JSON RPC main interface to Thunder based devices */
    class JsonRPC {
    	constructor(host) {
    		this._host = host;
    		this._id = 0;
    		this._socket = undefined;
    		this._callbackQueue = {};
    		this._services = {};

    		this._connect();
    	}

        _connect() {
            if (this._socket) this._socket.close();
            this._socket = new WebSocket( `ws://${this.host}/jsonrpc`, 'notification');
            var self = this;
            this._socket.onmessage = function(e){
                var data = {};
                try {
                    data = JSON.parse(e.data);

                    var id = data && data.id || null;
                    if (self.jsonRpcCallbackQueue[id]){
                        self.jsonRpcCallbackQueue[data.id](null, data.result);
                        delete self.jsonRpcCallbackQueue[data.id];
                    }
                } catch (e) {
                    return console.error('socket error', e)
                }
            };

            this._socket.onclose = function(e) {
                setTimeout(self.connect.bind(self), REFRESH_INTERVAL);
            };

            this._socket.onerror = function(err) {
                this._socket.close();
            };
        }

        req(method, params){
        	return new Promise( (resolve, reject) => {
    	        // socket isnt ready yet
    			if (this._socket && this._socket.readyState === 0) {
    				reject('Socket is not connected');
    			}

    	        var body = {
    	            'jsonrpc'	: '2.0',
    	            'id'		: this._id,
    	            'method'	: this._namespace + method,
    	            'params'	: params || {},
    	        };

    			if (this._socket) {
    				this._callbackQueue[this._id] = (results) => {
    					resolve(results);
    				};

    				this._socket.send(JSON.stringify(body));
    				this._id++;
    			}
        	})
        }
    }

    /*
     * Controller is responsible for starting/stopping plugins
     */

    class Controller extends JsonRPC {
    	constructor(host) {
    		super(host);
    		this._namespace = 'Controller.1.';
    	}

    	activate (plugin) 	{ return this.req('activate', {'callsign': plugin }) }
    	deactivate (plugin) { return this.req('deactivate', {'callsign': plugin }) }
    	status () 			{ return this.req('status') }
    	discover () 		{ return this.req('discover', { 'ttl' : 1}) }
    	storeconfig ()      { return this.req('storeconfig') }
    	reboot () 			{ return this.req('harakiri') }
    }

    /**
     * Main thunder interface
     */

    class Thunder {
    	constructor(host) {
    		this._host = host;
    		this._services = {};
    	}

    	getService(serviceName) {
    		if (this._services[ serviceName ])
    			return this._services[ serviceName ]


    		let resp;
    		switch(serviceName) {
    			case 'controller':
    				resp = new Controller(this, this._host);
    				this._services[ serviceName ] = resp;
    				break
    		}

    		return resp
    	}
    }

    return Thunder;

}());
