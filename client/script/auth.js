import Api from '@/api'
import { HttpError, Network } from '@/script/fscript'
import Cookies from 'js-cookie'

class Auth {
    static getToken () {
        const token = Cookies.get('access_token')
        if (!token) return null
        const exp = atob(token.split('.')[1])
        if (!exp || exp <= Date.now()) {
            Cookies.remove('access_token')
            return null
        }
        return token
    }

    static async getUserId () {
        try {
            const id = (await Api.getTokenInfo()).id
            return id
        } catch (err) { return null }
    }

    static async checkAuth () {
        try {
            const info = await Api.getTokenInfo()
            window.localStorage.setItem('id', info.id)
            return true
        } catch (err) { return false }
    }

    static async authRequest (url, options) {
        const token = Auth.getToken()
        if (!token) throw new HttpError(401, url, options, 'Token was invalid before request so simulating a 401')
        if (!options) options = {}
        if (!options.headers) options.headers = {}
        options.headers['Authorization'] = token
        const data = await Network.requestJSON(url, options)
        return data
    }
}

export default Auth
