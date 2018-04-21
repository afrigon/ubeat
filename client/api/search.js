import Auth from '@/script/auth'

export default class SearchApi {
    static async search (q, limit = 30) {
        const result = await Auth.authRequest(`/api/search?q=${q}&limit=${limit}`)
        return result.results
    }

    static async searchArtists (q, limit = 30) {
        const result = await Auth.authRequest(`/api/search/artists?q=${q}&limit=${limit}`)
        return result.results
    }

    static async searchAlbums (q, limit = 30) {
        const result = await Auth.authRequest(`/api/search/albums?q=${q}&limit=${limit}`)
        return result.results
    }

    static async searchSongs (q, limit = 30) {
        const result = await Auth.authRequest(`/api/search/tracks?q=${q}&limit=${limit}`)
        return result.results
    }

    static async searchUsers (q, limit = 30) {
        const result = await Auth.authRequest(`/api/search/users?q=${q}&limit=${limit}`)
        return result
    }
}
