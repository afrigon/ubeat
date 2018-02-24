import Auth from '@/script/auth'

export default class TrackApi {
    static async getTrack (id) {
        return (await Auth.authRequest(`/api/tracks/${id}`)).results[0]
    }
}
