import Auth from '@/script/auth'
import { Network } from '@/script/fscript'

export { default as ArtistApi } from './artist'
export { default as AlbumApi } from './album'
export { default as PlaylistApi } from './playlist'
export { default as RadioApi } from './radio'
export { default as SearchApi } from './search'
export { default as TrackApi } from './track'
export { default as UserApi } from './user'

export default class Api {
    static async login (email, password) {
        const params = new URLSearchParams()
        params.append('email', email)
        params.append('password', password)
        const user = await Network.requestJSON('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        })
        return user
    }

    static async register (email, name, password) {
        const params = new URLSearchParams()
        params.append('email', email)
        params.append('name', name)
        params.append('password', password)
        await Network.requestJSON('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        })
        const user = await Api.login(email, password)
        return user
    }

    static async getTokenInfo () {
        const info = await Auth.authRequest('/api/tokeninfo')
        return info
    }
}
