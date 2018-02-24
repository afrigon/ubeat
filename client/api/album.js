import Auth from '@/script/auth'

export default class AlbumApi {
    static async getAlbum (id) {
        const album = (await Auth.authRequest(`/api/albums/${id}`)).results[0]
        album.artworkUrl30 = album.artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$230x30$4')
        album.artworkUrl400 = album.artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2400x400$4')
        album.collectionViewUrl = `${album.collectionViewUrl}&app=itunes`
        return album
    }

    static async getAlbumTracks (id) {
        const tracks = {
            list: (await Auth.authRequest(`/api/albums/${id}/tracks`)).results,
            totalDuration: 0
        }
        for (let i = 0; i < tracks.list.length; ++i) {
            tracks.list[i].duration = Util.secondsToTime(tracks.list[i].trackTimeMillis / 1000)
            tracks.totalDuration += tracks.list[i].trackTimeMillis / 1000
        }
        tracks.totalDuration = Math.ceil(tracks.totalDuration / 60)
        return tracks
    }

    static async getFullAlbum (id) {
        return {
            album: await AlbumApi.getAlbum(id),
            tracks: await AlbumApi.getAlbumTracks(id)
        }
    }
}
