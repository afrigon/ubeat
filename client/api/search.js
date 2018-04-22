import Auth from '@/script/auth'

export default class SearchApi {
    static async search (q, limit = 30, type = '') {
        const result = await Auth.authRequest(`/api/search${type}?q=${q}&limit=${limit}`)
        if (result.results) return result.results
        return result
    }

    static async searchArtists (q, limit = 30) {
        return this.search(q, limit, '/artists')
    }

    static async searchAlbums (q, limit = 30) {
        return this.search(q, limit, '/albums')
    }

    static async searchSongs (q, limit = 30) {
        return this.search(q, limit, '/tracks')
    }

    static async searchUsers (q, limit = 30) {
        return this.search(q, limit, '/users')
    }
}
