import Auth from '@/script/auth'

const authRequest = async (url, options) => {
    const token = Auth.getToken()
    if (!token) throw new HttpError(401, url, options, 'Token was invalid before request so simulating a 401')
    if (!options) options = {}
    if (!options.headers) options.headers = {}
    options.headers['Authorization'] = token
    const data = await Util.requestJSON(url, options)
    return data
}

export default class Api {
    static async login (email, password) {
        const params = new URLSearchParams()
        params.append('email', email)
        params.append('password', password)
        const user = await Util.requestJSON('/api/login', {
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
        await Util.requestJSON('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        })
        const user = await Api.login(email, password)
        return user
    }

    static async getTokenInfo () {
        await authRequest('/api/tokeninfo')
    }

    // unsecure (may remain this way)
    static async fetchRadio (station) {
        const radio = await Util.requestJSON(`radio/${station}`)
        return radio
    }

    static async getAlbum (id) {
        const album = (await authRequest(`/api/albums/${id}`)).results[0]
        album.artworkUrl30 = album.artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$230x30$4')
        album.artworkUrl400 = album.artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2400x400$4')
        album.collectionViewUrl = `${album.collectionViewUrl}&app=itunes`
        return album
    }

    static async getAlbumTracks (id) {
        const tracks = {
            list: (await authRequest(`/api/albums/${id}/tracks`)).results,
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
            album: await Api.getAlbum(id),
            tracks: await Api.getAlbumTracks(id)
        }
    }

    static async getArtist (id) {
        const artist = (await authRequest(`/api/artists/${id}`)).results[0]
        const genreProxy = {
            'dance': 'dance',
            'classical': 'classical',
            'country': 'country',
            'metal': 'metal',
            'rock': 'rock',
            'songwriter': 'songwriter',
            'hip-hop/rap': 'rap'
        }
        artist.genre = genreProxy[artist.primaryGenreName.toLowerCase()] || 'dance'
        return artist
    }

    static async getArtistAlbums (id, limit = 30) {
        const albums = (await authRequest(`/api/artists/${id}/albums?limit=${limit}`)).results
        for (let i = 0; i < albums.length; ++i) {
            albums[i].artworkUrl400 = albums[i].artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2400x400$4')
            albums[i].artworkUrl200 = albums[i].artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2200x200$4')
        }
        return albums
    }

    static partitionLatestAlbums (albums, limit) {
        if (!albums) return { latestAlbums: [], albums: [] }
        albums.sort((a, b) => {
            const timeSinceA = Date.now() - new Date(a.releaseDate).getTime()
            const timeSinceB = Date.now() - new Date(b.releaseDate).getTime()
            if (timeSinceA === timeSinceB) return 0
            return timeSinceA > timeSinceB ? 1 : -1
        })

        return {
            latestAlbums: albums.splice(0, Math.min(limit, albums.length)),
            albums: albums
        }
    }

    static async getFullArtist (id, latestReleasesCount = 2) {
        const artist = await Api.getArtist(id)
        const albums = Api.partitionLatestAlbums(await Api.getArtistAlbums(id), latestReleasesCount)
        return Object.assign({}, { artist: artist }, albums)
    }

    static async getTrack (id) {
        return (await authRequest(`/api/tracks/${id}`)).results[0]
    }

    static async getUsers () {
        const users = await authRequest('/api/users')
        return users
    }

    static async getUser (id) {
        return (await authRequest(`/api/users/${id}`))[0]
    }

    static async followUser (id) {
        await authRequest('/api/follow', {
            methos: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
    }

    static async unfollowUser (id) {
        await authRequest(`/api/follow/${id}`, { method: 'DELETE' })
    }

    static async createPlaylist (name) {
        await authRequest(`/api/playlists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        })
    }

    static async updatePlaylist (id, name) {
        await authRequest(`/api/playlists/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        })
    }

    static async removePlaylist (id) {
        await authRequest(`/api/playlists/${id}`, { method: 'DELETE' })
    }

    static async getPlaylists () {
        const playlists = await authRequest(`/api/playlists`)
        return playlists
    }

    static async getUsersPlaylists (id) {
        const playlists = await Api.getPlaylists()
        return playlists.filter((n) => { return n.owner.id === id })
    }

    static async addTrackToPlaylist (id, trackId) {
        await authRequest(`/api/playlists/${id}/tracks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(await Api.getTrack(trackId))
        })
    }

    static async removeTrackFromPlaylist (id, trackId) {
        await authRequest(`/api/playlists/${id}/tracks/${trackId}`, { method: 'DELETE' })
    }

    static async search (q, limit = 20) {
        return (await authRequest('/api/search', {
            qs: {
                q: encodeURIComponent(q),
                limit: limit
            }
        })).results
    }

    static async searchAlbums (q, limit = 20) {
        return (await authRequest('/api/search/albums', {
            qs: {
                q: encodeURIComponent(q),
                limit: limit
            }
        })).results
    }

    static async searchArtists (q, limit = 20) {
        return (await authRequest('/api/search/artists', {
            qs: {
                q: encodeURIComponent(q),
                limit: limit
            }
        })).results
    }

    static async searchTracks (q, limit = 20) {
        return (await authRequest('/api/search/tracks', {
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
