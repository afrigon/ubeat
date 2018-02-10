const router = require('express').Router()
const request = require('request')
const sanitizer = require('validator')
const config = require('../config').shared

class Radio {
    constructor (genre) {
        this.timeout = 299000
        this.startTime = Date.now()
        this.playlist = []
        this.cache = []
        this.songs = require(`./${genre}`)
        this.nextSong()
    }

    getSong () {
        return {
            url: this.song.url || '',
            meta: this.song.meta || {},
            time: (Date.now() - this.startTime) / 1000
        }
    }

    nextSong () {
        this.loadPlaylist((song) => {
            if (this.preFetchedSong) {
                this.song = this.preFetchedSong
            } else {
                this.song = song || {}
            }

            setTimeout(this.nextSong.bind(this), /*this.song.duration || this.timeout*/this.timeout) // preview time
            this.startTime = Date.now()
            return this.fetchSong(this.playlist.pop(), (err, song) => {
                if (err) return (this.preFetchedSong = {})
                this.preFetchedSong = song
            })
        })
    }

    loadPlaylist (callback) {
        if (this.playlist.length > 0) return callback()

        const songs = this.songs.slice()
        while (songs.length > 0) {
            const i = Math.floor(Math.random() * songs.length)
            this.playlist.push(songs[i])
            songs.splice(i, 1)
        }

        return this.fetchSong(this.playlist.pop(), (err, song) => {
            return callback(song)
        })
    }

    fetchSong (id, callback) {
        const cachedSong = this.cache.filter(n => n.id === id)
        if (cachedSong.length > 0) return callback(null, cachedSong[0])

        return request(`${config.api}tracks/${id}`, (err, response, data) => {
            if (err || response.statusCode >= 400) return callback(new Error('Failed to download song data'))
            let obj
            try {
                obj = JSON.parse(data)
            } catch (e) {
                return callback(new Error('Failed to parse song data'))
            }

            if (!obj.results || !obj.results.length > 0) return callback(new Error('Invalid song data'))
            const songData = obj.results[0]
            const song = {
                id: songData.trackId,
                meta: {
                    title: songData.trackName || '',
                    artist: songData.artistName || '',
                    album: songData.collectionName || '',
                    pictureUrl: songData.artworkUrl30 || ''
                },
                duration: songData.trackTimeMillis || this.timeout,
                url: songData.previewUrl || ''
            }
            this.cache.push(song)
            return callback(null, song)
        })
    }
}

let radios = {
    pop: new Radio('pop'),
    classical: new Radio('classical'),
    dance: new Radio('dance'),
    rock: new Radio('rock'),
    metal: new Radio('metal'),
    rap: new Radio('rap')
}

router.get('/:genre', (req, res) => {
    const genre = sanitizer.escape(req.params.genre || '')
    if (!radios[genre]) return res.status(400).send(`${genre} radio does not exists`)

    return res.json(radios[genre].getSong())
})

module.exports = router
