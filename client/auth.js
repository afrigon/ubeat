export default class Auth {
    static checkAuth (callback) {
        const token = window.localStorage.getItem('access_token')
        if (!token) return callback(new Error('no access token in local storage'))
        const exp = atob(token.split('.')[1])
        if (!exp || exp <= Date.now()) return callback(new Error('access_token is expired'))
        return Util.requestJSON('/api/tokeninfo', {
            headers: { Authorization: token }
        }, (err, data) => {
            return callback(err)
        })
    }
}
