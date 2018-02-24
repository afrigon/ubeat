import Auth from '@/script/auth'

export default class UserApi {
    static async getUsers () {
        const users = await Auth.authRequest('/api/users')
        return users
    }

    static async getUser (id) {
        return (await Auth.authRequest(`/api/users/${id}`))[0]
    }

    static async followUser (id) {
        await Auth.authRequest('/api/follow', {
            methos: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
    }

    static async unfollowUser (id) {
        await Auth.authRequest(`/api/follow/${id}`, { method: 'DELETE' })
    }
}
