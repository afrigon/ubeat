import Auth from '@/script/auth'

export default class SearchApi {
    static async search (q, limit = 30) {
        return (await Auth.authRequest('/api/search', {
            qs: {
                q: encodeURIComponent(q),
                limit: limit
            }
        })).results
    }

    static async searchWithFilter (q, filter, limit = 20) {
        throw new Error('not implemented')
    }
}
