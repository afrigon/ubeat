import Auth from '@/script/auth'

export default class UserApi {
    static async me () {
        const me = await this.getUser(await Auth.getUserId())
        return me
    }

    static async getUsers () {
        const users = await Auth.authRequest('/api/users')
        return users
    }

    static async getUser (id) {
        const user = await Auth.authRequest(`/api/users/${id}`)
        return user
    }

    static async followUser (id) {
        await Auth.authRequest('/api/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
    }

    static async unfollowUser (id) {
        await Auth.authRequest(`/api/follow/${id}`, { method: 'DELETE' })
    }
}
