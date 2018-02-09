const router = require('express').Router()
const requestStream = require('request-stream')
const request = require('request')
const fs = require('fs')
const sanitizer = require('validator')
const config = require('../config').shared

class Radio {
    constructor (genre) {
        this.timeout = 30
        this.startTime = Date.now()
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
        this.loadPlaylist((song) => {
            if (this.preFetchedSong) {
                this.song = this.preFetchedSong
            } else {
                this.song = song || {}
            }

            setTimeout(this.nextSong.bind(this), /*this.song.duration*/29900) // preview time
            this.startTime = Date.now()
            return this.fetchSong(this.playlist.pop(), (err, song) => {
                if (err) return this.preFetchedSong = {}
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
        return request(`${config.api}tracks/${id}`, (err, response, data) => {
            if (err || response.statusCode >= 400) return callback(new Error('Failed to download song data'))
            let obj;
            try {
                obj = JSON.parse(data)
            } catch (e) {
                return callback(new Error('Failed to parse song data'))
            }

            if (!obj.results || !obj.results.length > 0) return callback(new Error('Invalid song data'))
            const song = obj.results[0]
            return callback(null, {
                id: song.trackId,
                meta: {
                    title: song.trackName || '',
                    artist: song.artistName || '',
                    album: song.collectionName || '',
                    pictureUrl: song.artworkUrl30|| ''
                },
                duration: song.trackTimeMillis || this.timeout,
                url: song.previewUrl || ''
            })
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

router.get('/:genre', (req ,res) => {
    const genre = sanitizer.escape(req.params.genre || '')
    if (!radios[genre]) return res.status(400).send(`${genre} radio does not exists`)

    return res.json(radios[genre].getSong())
})

module.exports = router
