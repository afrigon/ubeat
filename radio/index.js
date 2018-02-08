const router = require('express').Router()
const requestStream = require('request-stream')
const request = require('request')
const fs = require('fs')
const ffprobe = require('fluent-ffmpeg').ffprobe
const sanitizer = require('validator')

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
        if (this.playlist.length <= 0) this.loadPlaylist()
        
        this.song = this.playlist.pop()
        return this.getSongDuration(this.song.url, (err, duration) => {
            if (err) return this.song.duration = this.timeout

            this.song.duration = duration
            this.startTime = Date.now()
            return setTimeout(this.nextSong.bind(this), (this.song.duration - 0.5) * 1000)
        })
    }

    loadPlaylist () {
        const songs = this.songs.slice()
        while (songs.length) {
            const i = Math.floor(Math.random() * songs.length)
            this.playlist.push(songs[i])
            songs.splice(i, 1)
        }
    }

    fetchData () {
        //return request(`${config.api}`)
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
