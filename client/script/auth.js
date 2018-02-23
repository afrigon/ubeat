import Api from '@/script/api'

class Auth {
    static getToken () {
        const token = window.localStorage.getItem('access_token')
        if (!token) return null
        const exp = atob(token.split('.')[1])
        if (!exp || exp <= Date.now()) {
            window.localStorage.removeItem('access_token')
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
            await Api.getTokenInfo()
            return true
        } catch (err) { return false }
    }
}

export default Auth
