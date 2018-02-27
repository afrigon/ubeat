import Auth from '@/script/auth'
import TrackApi from './track'
import { Util } from '@/script/fscript'

export default class PlaylistApi {
    static async createPlaylist (name) {
        const playlist = await Auth.authRequest(`/api/playlists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        })
        return playlist
    }

    static async updatePlaylist (id, playlist) {
        await Auth.authRequest(`/api/playlists/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(playlist)
        })
    }

    static async removePlaylist (id) {
        await Auth.authRequest(`/api/playlists/${id}`, { method: 'DELETE' })
    }

    static async getPlaylists () {
        const playlists = await Auth.authRequest(`/api/playlists`)
        return playlists
    }

    static async getUsersPlaylists (id) {
        const playlists = await PlaylistApi.getPlaylists()
        return playlists.filter(n => n.owner && n.owner.id === id)
    }

    static async getPersonalPlaylists () {
        const userId = await Auth.getUserId()
        const playlists = await PlaylistApi.getUsersPlaylists(userId)
        return playlists
    }

    static async getPlaylist (id) {
        let playlist = await Auth.authRequest(`/api/playlists/${id}`)
        playlist.tracks = playlist.tracks.map(n => Object.assign({}, n, { duration: Util.secondsToTime(n.trackTimeMillis / 1000) }))
        return playlist
    }

    static async addTrackToPlaylist (id, trackId) {
        const playlist = await PlaylistApi.getPlaylist(id)
        playlist.tracks.forEach(n => { if (n.trackId === trackId) throw new Error('Track is already in this playlist') })
        await Auth.authRequest(`/api/playlists/${id}/tracks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(await TrackApi.getTrack(trackId))
        })
    }

    static async removeTrackFromPlaylist (id, trackId) {
        await Auth.authRequest(`/api/playlists/${id}/tracks/${trackId}`, { method: 'DELETE' })
    }
}
