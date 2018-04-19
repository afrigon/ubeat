import Auth from '@/script/auth'

export default class ArtistApi {
    static async getArtist (id) {
        const artist = (await Auth.authRequest(`/api/artists/${id}`)).results[0]
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
        const albums = (await Auth.authRequest(`/api/artists/${id}/albums?limit=${limit}`)).results
        for (let i = 0; i < albums.length; ++i) {
            albums[i].artworkUrl400 = albums[i].artworkUrl100.replace(/https:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1$2400x400$4')
            albums[i].artworkUrl200 = albums[i].artworkUrl100.replace(/https:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1$2200x200$4')
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
        const artist = await ArtistApi.getArtist(id)
        const albums = ArtistApi.partitionLatestAlbums(await ArtistApi.getArtistAlbums(id), latestReleasesCount)
        return Object.assign({}, { artist: artist }, albums)
    }
}
