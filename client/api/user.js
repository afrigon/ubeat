import Auth from '@/script/auth'

export default class UserApi {
    static async me () {
        const user = await Auth.authRequest(`/api/users/${await Auth.getUserId()}`)
        return user
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

    static async isFollowing (id) {
        const me = await UserApi.me()
        return me.following.filter(n => n.id === id).length > 0
    }
}
