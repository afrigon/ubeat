import Util from './util'

export class HttpError extends Error {
    constructor (status, url, options, ...params) {
        super(...params)
        if (Error.captureStackTrace) Error.captureStackTrace(this, HttpError)
        this.status = status
        this.url = url
        this.options = options
    }
}

export default class Network {
    static jsonParse (str, callback) {
        try { return callback(null, JSON.parse(str)) } catch (e) { return callback(e) }
    }

    static async requestJSON (url, options) {
        const defaults = {
            method: 'GET',
            headers: {},
            redirect: 'follow'
        }

        if (!options) options = {}
        options = Util.extends(options, defaults)

        const res = await fetch(url, options)
        if (res.status === 204) return
        if (res.status >= 400) throw new HttpError(res.status, url, options, 'Error while fetching the world wide web')
        const json = await res.json()
        return json
    }

    static getQueryParam (name) {
        const url = window.location.href
        const results = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`).exec(url)
        if (!results) return null
        if (!results[2]) return ''
        return decodeURIComponent(results[2].replace(/\+/g, ' '))
    }
}
