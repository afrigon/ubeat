import Component from '../component'
import Util from '../tools/util'
import { FScript } from '../index'

export default class AudioPlayer extends Component {
    get defaults () {
        return {
            visual: false,
            visualColor: '#2196f3',
            color: '#FFFFFF',
            barCount: 200,
            barHeight: 75,
            autoplay: false, // not working on safari
            loop: false,
            startTime: 0,
            disabled: false,
            volume: 0.75,
            meta: {
                title: '',
                artist: '',
                album: '', // not used
                pictureUrl: ''
            },
            shouldAutoRemove: true,
            fetchCallback: null,
            createdCallback: null,
            stopCallback: null,
            clipEndCallback: null
        }
    }

    constructor (source, options) {
        super()
        if (Util.isObject(source)) {
            options = source
        } else {
            this.source = source
        }

        this.options = Util.extends(options, this.defaults)
        this.resize = this.resize.bind(this)
    }

    init (el) {
        if (!this.options.fetchCallback || !Util.isFunction(this.options.fetchCallback)) {
            this.options.fetchCallback = (_, callback) => { return callback(null, this.source) }
        }

        this.options.fetchCallback(this, (err, source) => {
            if (err) return Util.logError(new Error('Error in fetching script of audio player'))
            if (!source) return Util.logError(new Error('No source provided to audio player'))
            this.source = source

            FScript.autoRemoveComponentsOfTypes(this.constructor.name)
            this.el = el
            // water bucket
            while (this.el.firstChild) this.el.removeChild(this.el.firstChild)
            el.appendChild(this.createPlayer())
            this.createMeta()
        })
    }

    deinit () {
        if (this.audioContext) this.audioContext.close()
        Util.removeEvent(window, 'resize', this.resize)
        while (this.el.firstChild) this.el.removeChild(this.el.firstChild)
    }

    resize (event) {
        this.canvas.width = this.el.clientWidth - 120
        this.canvas.height = this.options.barHeight
    }

    createPlayer () {
        const player = document.createElement('div')
        this.player = player
        player.classList.add('timeline')
        player.classList.add('audio-player')
        player.style.paddingTop = `${this.options.barHeight - 12}px` // 12 == half the timeline's height

        const audio = document.createElement('audio')
        this.audio = audio
        player.appendChild(audio)
        audio.crossOrigin = 'anonymous'
        audio.src = this.source
        audio.volume = Util.clamp(this.options.volume, 0, 1)
        audio.autoplay = this.options.autoplay
        audio.loop = this.options.loop

        const button = document.createElement('i')
        player.appendChild(button)
        button.classList.add('button')
        button.innerHTML = 'play_arrow'
        button.classList.add('material-icons')
        button.style.color = this.options.color

        this.createEvents(audio, button)
        this.createProgress(player)

        this.isCreated = true
        if (this.options.createdCallback && Util.isFunction(this.options.createdCallback)) {
            this.options.createdCallback(this)
        }
        return player
    }

    createEvents (audio, button) {
        Util.addEvent(audio, 'ended', () => {
            if (Util.safeCallback(this.options.clipEndCallback, this)) return
            if (Util.safeCallback(this.options.stopCallback, this)) return
            return audio.pause()
        })
        Util.addEvent(audio, 'pause', () => (button.innerHTML = 'play_arrow'))
        Util.addEvent(audio, 'play', () => {
            // stupid hack for safari
            audio.currentTime = this.options.startTime
            this.options.startTime = 0

            if (this.options.stopCallback) { return (button.innerHTML = 'stop') }
            return (button.innerHTML = 'pause')
        })

        if (!this.options.disabled) {
            Util.addEvent(button, 'click', () => {
                if (!this.audio.paused) {
                    if (Util.safeCallback(this.options.stopCallback, this)) return null
                    return this.audio.pause()
                }

                return this.audio.play()
            })
        } else {
            button.classList.add('disabled')
        }
    }

    createProgress (player) {
        const timeline = document.createElement('div')
        player.appendChild(timeline)
        timeline.classList.add('progress-bar')
        timeline.style.backgroundColor = this.options.color

        const progress = document.createElement('div')
        timeline.appendChild(progress)
        this.progress = progress
        progress.classList.add('progress-indicator')
        progress.style.backgroundColor = this.options.visualColor

        if (this.options.visual) {
            const canvas = document.createElement('canvas')
            timeline.appendChild(canvas)
            this.canvas = canvas
            canvas.style.height = `${this.options.barHeight}px`
            canvas.width = this.el.clientWidth - 120 // terrible hack -> 120 == full width - controls
            canvas.height = this.options.barHeight
            Util.addEvent(window, 'resize', this.resize)
        }
        this.initVisual()

        const time = document.createElement('div')
        timeline.appendChild(time)
        this.time = time
        time.classList.add('time')
        time.style.color = this.options.color
        time.innerHTML = '00:00 / 00:00'
    }

    createMeta () {
        const meta = document.createElement('div')
        this.el.appendChild(meta)
        this.meta = meta
        meta.classList.add('audio-player-meta')

        const art = document.createElement('img')
        meta.appendChild(art)
        this.metaArt = art

        const text = document.createElement('div')
        meta.appendChild(text)
        text.classList.add('text')
        text.style.color = this.options.color

        const title = document.createElement('p')
        text.appendChild(title)
        this.metaTitle = title

        const artist = document.createElement('p')
        text.appendChild(artist)
        this.metaArtist = artist
        artist.style.color = this.options.visualColor

        return this.setMeta()
    }

    setMeta (meta) {
        if (meta) this.options.meta = meta
        if (!this.isCreated) return

        if (!this.options.meta.title || !this.options.meta.artist) {
            this.metaArt.src = ''
            this.metaTitle.innerHTML = ''
            this.metaArtist.innerHTML = ''
            this.meta.style.display = 'none'
        } else {
            this.metaArt.src = this.options.meta.pictureUrl || ''
            this.metaTitle.innerHTML = this.options.meta.title || ''
            this.metaArtist.innerHTML = this.options.meta.artist || ''
            this.meta.style.display = 'inline-block'
        }

        return this.resize()
    }

    initVisual () {
        if (this.options.visual) {
            window.AudioContext = window.AudioContext || window.webkitAudioContext
            this.audioContext = new AudioContext()
            const source = this.audioContext.createMediaElementSource(this.audio)
            this.analyser = this.audioContext.createAnalyser()
            source.connect(this.analyser)
            this.analyser.connect(this.audioContext.destination)
            this.context = this.canvas.getContext('2d')
            this.context.translate(0.5, 0.5) // terrible hack again
        }

        return window.requestAnimationFrame(this.loopVisual.bind(this))
    }

    loopVisual () {
        if (this.isCreated) {
            this.progress.style.width = `${this.audio.currentTime / this.audio.duration * 100}%`
            this.time.innerHTML = `${Util.secondsToTime(this.audio.currentTime || 0)} / ${Util.secondsToTime(this.audio.duration || 0)}`
        }

        if (!this.options.visual) return window.requestAnimationFrame(this.loopVisual.bind(this))

        let data = new Uint8Array(this.analyser.frequencyBinCount)
        this.analyser.getByteFrequencyData(data)
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fillStyle = this.options.visualColor

        const margin = 2
        const minBarWidth = 0.75
        let barCount = this.options.barCount
        const totalMargin = margin * barCount
        let barWidth = (this.canvas.width - totalMargin) / barCount

        // if the requested barCount doesn't fit player width
        if (barWidth < minBarWidth) {
            // number of bars with minWidth that will fit screen
            barCount = Math.floor((this.canvas.width) / (minBarWidth + margin))

            // extra bar is the remaining modulo after bars have been removed
            const extraBar = (this.canvas.width) % (minBarWidth + margin)

            // new width is the minimum barWidth + the extra bar size distributed to each bar
            barWidth = minBarWidth + extraBar * (minBarWidth + margin) / barCount
        }

        for (let i = 0; i < this.options.barCount; ++i) {
            const percent = data[Math.floor(data.length / this.options.barCount * i)] / 255
            this.context.globalAlpha = Math.min(percent + 0.2, 1) // 0.2 is the initial value in f(x) = ax + b aka minimal alpha
            this.context.fillRect(i * barWidth + i * margin, this.canvas.height, barWidth, -(percent * (this.canvas.height - margin)))
        }

        return window.requestAnimationFrame(this.loopVisual.bind(this))
    }
}
