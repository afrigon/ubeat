const router = require('express').Router()
const request = require('request')
const sanitizer = require('validator')
const config = require('../config').shared

class Radio {
    constructor (genre) {
        this.timeout = 29900
        this.startTime = Date.now()
        this.playlist = []
        this.cache = []
        this.songs = require(`./${genre}`)
        this.login((err) => {
            if (err) return console.log(err.message)
            this.nextSong()
        })
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

            setTimeout(this.nextSong.bind(this), /* this.song.duration || this.timeout */ this.timeout) // preview time
            this.startTime = Date.now()
            return this.fetchSong(this.playlist.pop(), (err, song) => {
                if (err) return (this.preFetchedSong = this.song)
                return (this.preFetchedSong = song)
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
            err && console.log(err.message)
            return callback(song)
        })
    }

    login (callback) {
        return request({
            url: `${config.api}login`,
            method: 'POST',
            headers: { 'Content-Type': 'x-www-form-urlencoded' },
            form: {
                email: config.auth.username,
                password: config.auth.password
            }
        }, (err, response, data) => {
            if (err || response.statusCode >= 400) return callback(new Error('Failed to login into the api'))
            let obj
            try {
                obj = JSON.parse(data)
            } catch (e) {
                return callback(new Error('Failed to parse song data'))
            }
            if (!obj || !obj.token) return callback(new Error('Failed to login into the api'))
            this.token = obj.token
            return callback()
        })
    }

    fetchSong (id, callback) {
        const cachedSong = this.cache.filter(n => n.id === id)
        if (cachedSong.length > 0) return callback(null, cachedSong[0])

        return request({
            url: `${config.api}tracks/${id}`,
            headers: { 'Authorization': this.token }
        }, (err, response, data) => {
            if (err || response.statusCode >= 400) {
                return callback(new Error('Failed to download song data'))
            }

            if (response && response.statusCode === 403) {
                return this.login((err) => {
                    if (err) return callback(err)
                    return this.fetchSong(id, callback)
                })
            }

            return this.parseSong(data, (err, song) => {
                if (err) {
                    return callback(err)
                }
                this.cache.push(song)
                return callback(null, song)
            })
        })
    }

    parseSong (data, callback) {
        let obj
        try {
            obj = JSON.parse(data)
        } catch (e) {
            return callback(new Error('Failed to parse song data'))
        }

        if (!obj.results || !obj.results.length > 0) return callback(new Error('Invalid song data'))
        const songData = obj.results[0]
        if (songData.kind !== 'song' || !songData.previewUrl) return callback(new Error('Song is not a song or haz no preview, wat'))

        return callback(null, {
            id: songData.trackId,
            meta: {
                title: songData.trackName || '',
                artist: songData.artistName || '',
                album: songData.collectionName || '',
                pictureUrl: songData.artworkUrl30.replace(/http:\/\/(is\d+)/, 'https://$1-ssl') || ''
            },
            duration: songData.trackTimeMillis || this.timeout,
            url: songData.previewUrl || ''
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
