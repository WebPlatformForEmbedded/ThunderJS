/** Base plugin for Thunder based devices */
export class BasePlugin {
    constructor(host, api) {
        this._api = api
    }

    req(method, params){
        return this._api.req(this._namespace + method, params)
    }
}
