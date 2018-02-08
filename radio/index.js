const router = require('express').Router()
const requestStream = require('request-stream')
const request = require('request')
const fs = require('fs')
const ffprobe = require('fluent-ffmpeg').ffprobe
const sanitizer = require('validator')
const whilst = require('async/whilst')

class Radio {
    constructor (genre) {
        this.timeout = 30
        this.historySize = 3
        this.startTime = Date.now()
        this.song = {}
        this.playlist = []
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
        this.loadPlaylist(() => {
            this.song = this.playlist.pop()
            return this.getSongDuration(this.song.url, (err, duration) => {
                if (err) return this.song.duration = this.timeout
                
                this.song.duration = duration
                this.startTime = Date.now()
                return setTimeout(this.nextSong.bind(this), (this.song.duration - 0.5) * 1000)
            })
        })
    }
    
    loadPlaylist (callback) {
        if (this.playlist.length > 0) return callback()

        const songs = this.songs.slice()
        return whilst((whilstCallback) => {
            return songs.length
        }, () => {
            const i = Math.floor(Math.random() * songs.length)
            return this.fetchData(songs[i], (err, song) => {
                if (err) return whilstCallback()
                this.playlist.push(song)
                songs.splice(i, 1)
                return whilstCallback()
            })
        }, (err, n) => {
            return callback()
        })
    }

    fetchData (id, callback) {
        return request(`${config.api}tracks/${id}`, (err, response, data) => {
            if (err || response.statusCode >= 400) return callback(new Error('Failed to download song data'))
            let song;
            try {
                song = JSON.parse(data)
            } catch (e) {
                return callback(new Error('Failed to parse song data'))
            }

            if (!json.result || !json.results.length) return callback(new Error('Invalid song data'))
            const songData = json.results[0]
            return callback(null, {
                meta: {
                    title: songData.trackName || '',
                    artist: songData.artistName || '',
                    album: songData.collectionName || '',
                    pictureUrl: songData.artworkUrl30|| ''
                },
                url: songData.previewUrl || ''
            })
        })
    }

    getSongDuration (url, callback) {
        return requestStream.get(url, (err, stream) => {
            if (err) return callback(new Error('Could not download audio file'))
            return ffprobe(stream, (err, meta) => {
                if (err) return callback(new Error('Could not read metadata'))
                if (!meta.streams || meta.streams.length) callback(new Error('Could not read metadata'))

                return callback(null, meta.streams[0].duration || this.timeout)
            })
        })
    }
}

let radios = {
    dance: new Radio('dance')
}

router.get('/:genre', (req ,res) => {
    const genre = sanitizer.escape(req.params.genre || '')
    if (!radios[genre]) return res.status(400).send(`${genre} radio does not exists`)

    return res.json(radios[genre].getSong())
})

module.exports = router