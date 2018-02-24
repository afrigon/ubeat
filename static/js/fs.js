class HttpError extends Error {
    constructor (status, url, options, ...params) {
        super(...params)
        if (Error.captureStackTrace) Error.captureStackTrace(this, HttpError)
        this.status = status
        this.url = url
        this.options = options
    }
}

class Util {
    static extends (object, defaults) {
        if (!Util.isObject(object)) object = {}
        if (!Util.isObject(defaults)) defaults = {}

        for (let k in defaults) {
            object[k] = object[k] || defaults[k]
        }
        return object
    }

    static addEvent (element, eventName, eventCallback) {
        if (element.addEventListener) {
            element.addEventListener(eventName, eventCallback, false)
        } else if (element.attachEvent) {
            element.attachEvent(`on${eventName}`, eventCallback)
        } else {
            element[eventName] = eventCallback
        }
    }

    static removeEvent (element, eventName, eventCallback) {
        if (element.removeEventListener) {
            element.removeEventListener(eventName, eventCallback, false)
        } else if (element.detachEvent) {
            element.detachEvent(`on${eventName}`, eventCallback)
        } else {
            delete element[eventName]
        }
    }

    static getBitwiseArray (length) {
        const array = []
        for (let i = 0; i < length; ++i) {
            array.push(Math.pow(2, i))
        }
        return array
    }

    static clamp (value, min, max) {
        return Math.min(Math.max(value, min), max)
    }

    static clone (instance) {
        return Object.assign(Object.create(Object.getPrototypeOf(instance)), instance)
    }

    static logError (err) {
        console.error(`FS Error line(${err.line}:${err.column}): ${err.message}`)
    }

    static isObject (target) {
        return target !== null && typeof target === 'object'
    }

    static isFunction (target) {
        return typeof target === 'function'
    }

    static safeCallback (callback, ...params) {
        if (callback && Util.isFunction(callback)) {
            callback(...params) // eslint-disable-line standard/no-callback-literal
            return true
        }
        return false
    }

    static isString (target) {
        return target.constructor === String
    }

    static secondsToTime (seconds) {
        const h = '0' + Math.floor(seconds / 3600)
        const m = '0' + Math.floor((seconds - (h * 3600)) / 60)
        const s = '0' + Math.floor(seconds - (h * 3600) - (m * 60))
        return `${h > 0 ? `${h.substr(h.length - 2)}:` : ''}${m.substr(m.length - 2)}:${s.substr(s.length - 2)}`
    }

    static jsonParse (str, callback) {
        try { return callback(null, JSON.parse(str)) } catch (e) { return callback(e) }
    }

    static async requestJSON (url, options) {
        const defaults = {
            method: 'GET',
            headers: {},
            redirect: 'follow'
        }

        if (!options) options = {}
        options = Util.extends(options, defaults)

        const res = await fetch(url, options)
        if (res.status === 204) return
        if (res.status >= 400) throw new HttpError(res.status, url, options, 'Error while fetching the world wide web')
        const json = await res.json()
        return json
    }

    static getQueryParam (name) {
        const url = window.location.href
        const results = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`).exec(url)
        if (!results) return null
        if (!results[2]) return ''
        return decodeURIComponent(results[2].replace(/\+/g, ' '))
    }

    static isTouch () {
        return 'ontouchstart' in document.documentElement
    }

    static onReady (callback) {
        if (!['interactive', 'complete'].includes(document.readyState)) {
            return Util.addEvent(document, 'DOMContentLoaded', callback)
        }
        return callback()
    }

    static getRGBFromHex (hex) {
        return {
            red: (hex & 0xFF0000) >> 16,
            green: (hex & 0x00FF00) >> 8,
            blue: hex & 0x0000FF
        }
    }
}

class Component {
    constructor () {
        if (this.constructor === Component) {
            throw new TypeError('Can not construct abstract class.')
        }

        if (this.init === Component.prototype.init) {
            throw new TypeError('Please implement abstract method init.')
        }
    }

    getName () {
        return this.constructor.name
    }
}

class FS {
    static addComponent (component, selector) {
        return Util.onReady(() => {
            if (!component || !(component instanceof Component)) {
                return Util.logError(new Error('invalid component passed to FrigStudio.addComponent'))
            }

            this.components.push(component)
            if (!selector) { return component.init() }
            if (!Util.isString(selector)) {
                return Util.logError(new Error('invalid selector passed to FrigStudio.addComponent'))
            }

            const elements = document.querySelectorAll(selector)
            for (let i = 0; i < elements.length; i++) {
                component.init(elements[i])
            }
            return null
        })
    }

    static removeComponent (component) {
        if (component.deinit && Util.isFunction(component.deinit())) {
            component.deinit()
        }
        return this.components.splice(this.components.indexOf(component), 1)
    }

    static autoRemoveComponentsOfTypes (type) {
        const components = this.components.filter(n => n.constructor.name === type)

        for (let i = 0; i < components.length - 1; ++i) {
            if (components[i].options.shouldAutoRemove) {
                this.removeComponent(components[i])
            }
        }
    }

    static hasComponentOfType (type) {
        return this.components.filter(n => n.constructor.name === type).length > 0
    }

    static init () {
        this.components = []
    }
}

// eslint-disable-next-line no-unused-vars
class MaterialInput extends Component {
    init () {
        const selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea'
        document.querySelectorAll(selector).forEach((element) => {
            const label = element.parentNode.getElementsByTagName('label')[0]
            if (!label) return
            if (element.value) {
                label.classList.add('active')
            } else {
                label.classList.remove('active')
            }
            Util.addEvent(element, 'focus', (event) => {
                label.classList.add('active')
            })
            Util.addEvent(element, 'blur', (event) => {
                !element.value && label.classList.remove('active')
            })
        })
    }
}

// eslint-disable-next-line no-unused-vars
class Drawer extends Component {
    init () {
        this.initDrawers()
        this.initTriggers()
    }

    initDrawers () {
        const drawers = document.querySelectorAll('.drawer-wrapper')
        return drawers.forEach((drawer) => {
            return this.initDrawer(drawer)
        })
    }

    initDrawer (drawer) {
        const component = document.createElement('div')
        component.classList.add('drawer')
        while (drawer.firstChild) { component.appendChild(drawer.removeChild(drawer.firstChild)) }
        drawer.appendChild(component)

        const filter = document.createElement('div')
        filter.classList.add('drawer-filter')
        Util.addEvent(filter, 'click', (event) => {
            return event.currentTarget.parentNode.classList.remove('open')
        })
        Util.addEvent(window, 'resize', (event) => {
            return drawer.classList.remove('open')
        })
        component.querySelectorAll('.drawer-close i').forEach((closeButton) => {
            Util.addEvent(closeButton, 'click', (event) => {
                return drawer.classList.remove('open')
            })
        })
        this.initActions(drawer)
        return drawer.appendChild(filter)
    }

    initTriggers () {
        const elements = document.querySelectorAll('.drawer-trigger')
        return elements.forEach((element) => {
            return Util.addEvent(element, 'click', (event) => {
                const targetId = event.currentTarget.getAttribute('data-drawer-wrapper-id').replace(/^#/, '')
                const target = document.getElementById(targetId)
                return target && target.classList.add('open')
            })
        })
    }

    initActions (drawer) {
        const elements = drawer.querySelectorAll('.drawer-action')
        return elements.forEach((element) => {
            return Util.addEvent(element, 'click', (event) => {
                const actions = drawer.querySelectorAll('.drawer-action')
                actions.forEach((action) => {
                    action.classList.remove('active')
                })
                event.target.classList.add('active')
                return drawer.classList.remove('open')
            })
        })
    }
}

// eslint-disable-next-line no-unused-vars
class FrigStudioLogo extends Component {
    init (el) {
        const embed = document.createElement('embed')
        const svg = document.createElement('object')
        embed.src = '/img/logo.svg'
        svg.appendChild(embed)
        el.appendChild(svg)
    }
}

// eslint-disable-next-line no-unused-vars
class GradientFader extends Component {
    constructor (options) {
        super()
        if (!options) {
            options = {}
        }

        if (options.colors && options.colors.constructor !== Array) {
            options.colors = ['#FFFFFF']
        }

        const defaultAngle = 135
        const defaultDurationPerColor = 10000 // ms

        this.options = {
            angle: options.angle || defaultAngle,
            colors: options.colors || ['#FFFFFF'],
            duration: options.duration || options.colors.length * defaultDurationPerColor, // ms
            position: options.position || 'start' // 'start', 'end', 'middle', 'random'
        }
    }

    init (el) {
        el.style.animation = `GradientFader ${this.options.duration}ms ease-in infinite`
        switch (this.options.position) {
        case 'end': el.style.animationDelay = `-${this.options.duration / 1000 / 2}s`
            break
        case 'middle': el.style.animationDelay = `-${this.options.duration / 1000 / 4}s`
            break
        case 'random': el.style.animationDelay = `-${Math.floor(Math.random() * this.options.duration / 1000) / 2}s`
            break
        default: el.style.animationDelay = '0s'
        }
        el.style.backgroundColor = '#FFFFFF'
        el.style.backgroundImage = `linear-gradient(${this.options.angle}deg, ${this.options.colors.join(',')})`
        el.style.backgroundSize = `${this.options.colors.length}00%`
    }
}

// eslint-disable-next-line no-unused-vars
class AutoScrollAnimator extends Component {
    constructor (options) {
        super()
        if (!options) { options = {} }

        this.options = {
            'scrollContainer': options.scrollContainer || window,
            'selector': options.selector || 'scroll-animate',
            'trigger': options.trigger || 'animate'
        }
        this.vendors = ['moz', 'webkit']
        this.didScroll = this.didScroll.bind(this)
        this.scrollCallback = this.scrollCallback.bind(this)
    }

    init () {
        const tickInterval = 50
        this.hasScroll = true // will animate elements visible on page load
        this.elements = document.querySelectorAll(`.${this.options.selector}`)
        if (this.elements.length) {
            this.elements.forEach((element) => {
                element.classList.remove('animate')
                this.setVisibility(element, false)
            })
            Util.addEvent(this.options.scrollContainer, 'scroll', this.didScroll)
            Util.addEvent(this.options.scrollContainer, 'resize', this.didScroll)
            this.timer = setInterval(this.scrollCallback, tickInterval)
        }
    }

    setVisibility (element, isVisible) {
        if (!isVisible) {
            element.setAttribute('data-animation-name', window.getComputedStyle(element).getPropertyValue('animation-name') || 'none')
        }

        this.setStyles(element, {
            animationDelay: element.getAttribute('data-delay') || '0s',
            animationIterationCount: (isNaN(element.getAttribute('data-iteration'))
                ? parseInt(element.getAttribute('data-iteration'), 10)
                : 1),
            animationName: (isVisible
                ? element.getAttribute('data-animation-name') || 'none'
                : 'none')
        })
        element.style.visibility = isVisible
            ? 'visible'
            : 'hidden'
    }

    setStyles (element, styles) {
        for (const [key, value] of Object.entries(styles)) {
            this.vendors.forEach((vendor) => {
                element.style[`${vendor}${key.charAt(0).toUpperCase()}${key.substr(1)}`] = value
            })
        }
    }

    getElementOffsetToTop (element, offset) {
        try {
            const usableOffset = parseInt(offset, 10)
            let elementOffset = element.offsetTop + usableOffset

            while ((element = element.offsetParent)) {
                elementOffset += element.offsetTop
            }
            return elementOffset
        } catch (ex) {
            return Util.logError(new Error('invalid offset provided for scrollAnimator'))
        }
    }

    isElementOnScreen (element) {
        const elementOffset = element.getAttribute('data-offset') || 0
        const screenHeight = window.innerHeight || document.documentElement.clientHeight
        const elementTop = this.getElementOffsetToTop(element, elementOffset)
        const topEdge = this.options.scrollContainer.scrollTop || window.pageYOffset
        const bottomEdge = topEdge + Math.min(window.document.documentElement.clientHeight, screenHeight)
        return elementTop < bottomEdge
    }

    didScroll () {
        this.hasScroll = true
    }

    removeEvents () {
        Util.removeEvent(this.options.scrollContainer, 'scroll', this.didScroll)
        Util.removeEvent(this.options.scrollContainer, 'resize', this.didScroll)
        if (this.timer) clearInterval(this.timer)
    }

    scrollCallback () {
        if (!this.hasScroll) return
        this.hasScroll = false
        if (!this.elements.length) return this.removeEvents()

        this.elements = Array.from(this.elements).filter((element) => {
            if (!this.isElementOnScreen(element)) return true
            this.setVisibility(element, true)
            element.className += ` ${this.options.trigger}`
            return false
        })
    }
}

// eslint-disable-next-line no-unused-vars
class ScrollAnimator extends Component {
    static get animators () {
        return this._animators
    }

    static addAnimators (animator) {
        if (!this.animators) {
            this._animators = []
        }
        this._animators.push(animator)
    }

    static get hasScroll () {
        return this._hasScroll || false
    }

    static set hasScroll (value) {
        this._hasScroll = value
    }

    static get hasEvents () {
        return this._hasEvents || false
    }

    static set hasEvents (value) {
        this._hasEvents = value
    }

    static get timer () {
        return this._timer
    }

    static getElementOffsetToTop (element) {
        let elementOffset = element.offsetTop
        while ((element = element.offsetParent)) {
            elementOffset += element.offsetTop
        }
        return elementOffset
    }

    constructor (options) {
        super()
        if (!options) { options = {} }
        this.options = {
            animationEaseTime: options.animationEaseTime || 200,
            duration: options.duration || 0.5, // percent -> 0.5 == 50% aka half screen from startOffset
            endValue: options.endValue || 0,
            startOffset: options.startOffset || 0.25, // percent -> 0: bottom edge of screen 1: top edge of screen (useless)
            startValue: options.startValue || 0
        }
    }

    init (el) {
        this.element = el
        ScrollAnimator.addAnimators(Util.clone(this))

        if (!ScrollAnimator.hasEvents) { // if is first call to this method add event and init the animator modules
            ScrollAnimator.hasEvents = true
            ScrollAnimator.hasScroll = true
            Util.addEvent(window, 'scroll', this.didScroll)
            Util.addEvent(window, 'resize', this.didScroll)
            this.timer = setInterval(this.scrollCallback, 50)
        }
    }

    didScroll () {
        ScrollAnimator.hasScroll = true
    }

    scrollCallback () {
        if (ScrollAnimator.hasScroll && ScrollAnimator.animators.length) {
            ScrollAnimator.hasScroll = false
            const screenHeight = window.innerHeight || document.documentElement.clientHeight
            const bottomEdge = window.pageYOffset + screenHeight

            ScrollAnimator.animators.forEach((animator) => {
                const bottomPoint = bottomEdge - animator.options.startOffset * screenHeight
                const elementOffset = ScrollAnimator.getElementOffsetToTop(animator.element)
                const topPoint = bottomPoint - animator.options.duration

                if (topPoint <= elementOffset && bottomPoint >= elementOffset) {
                    const percent = (elementOffset - topPoint) * 100 / (bottomPoint - topPoint)
                    return animator.animate(percent)
                }

                if (topPoint > elementOffset) { return animator.animate(0) }
                if (bottomPoint < elementOffset) { return animator.animate(100) }

                return null
            })
        }
    }
}

// eslint-disable-next-line no-unused-vars
class TransformScrollAnimator extends ScrollAnimator {
    constructor (options) {
        super(options)
        if (!options.direction) {
            options.direction = {}
        }

        this.options.direction = { // multiplicator, 0: nothing, 1: full animation
            x: options.direction.x || 0,
            y: options.direction.y || 0,
            z: options.direction.z || 0
        }

        if (!options.type || !['translate3d', 'rotate', 'scale'].includes(options.type)) {
            this.options.type = 'translate3d'
        } else {
            this.options.type = options.type
        }
    }

    init (el) {
        super.init(el)
        setTimeout(() => {
            el.style.transition = `${el.style.transition
                ? ', '
                : ''}${this.options.animationEaseTime}ms ease transform`
        }, 100)
    }

    animate (percent) {
        const value = (100 - percent) * (this.options.endValue - this.options.startValue) / 100 + this.options.startValue
        let regex = ''
        let transformValues = ''

        switch (this.options.type) {
        case 'translate3d':
            transformValues = `${this.options.direction.x * value}px, ${this.options.direction.y * value}px, ${this.options.direction.z * value}px`
            regex = /(translate3d)\(([[0-9]\.-]+px,?\s*){3}\)/
            break
        case 'rotate':
            transformValues = `${value}deg`
            regex = /(rotate)(\(.*(?:deg\)))/
            break
        case 'scale':
            transformValues = `${1 + this.options.direction.x * value / 100}, ${1 + this.options.direction.y * value / 100}`
            regex = /(scale)\((?:[[0-9]\.-]+,?\s*){2}\)/
            break
        }

        // hack to keep curent transform intact
        if (regex.test(this.element.style.transform)) {
            return (this.element.style.transform = this.element.style.transform.replace(regex, `$1(${transformValues})`))
        }

        return (this.element.style.transform += `${this.options.type}(${transformValues})`)
    }
}

// eslint-disable-next-line no-unused-vars
class ColorScrollAnimator extends ScrollAnimator {
    constructor (options) {
        super(options)
        if (!options.direction) { options.direction = '' }
        if (!options.type || !['background', 'text'].includes(options.type)) {
            this.options.type = 'background'
        } else {
            this.options.type = options.type
        }

        this.startColor = Util.getRGBFromHex(this.options.startValue)
        this.endColor = Util.getRGBFromHex(this.options.endValue)
    }

    init (el) {
        super.init(el)
        setTimeout(() => {
            el.style.transition = `${el.style.transition
                ? ', '
                : ''}${this.options.animationEaseTime}ms ease background-color, ${this.options.animationEaseTime}ms ease color`
        }, 100)
    }

    getPercentValue (component, percent) {
        return Math.round((100 - percent) * (this.endColor[component] - this.startColor[component]) / 100 + this.startColor[component])
    }

    animate (percent) {
        const redValue = this.getPercentValue('red', percent)
        const greenValue = this.getPercentValue('green', percent)
        const blueValue = this.getPercentValue('blue', percent)

        switch (this.options.type) {
        case 'background':
            this.element.style.backgroundColor = `rgb(${redValue}, ${greenValue}, ${blueValue})`
            break
        case 'text':
            this.element.style.color = `rgb(${redValue}, ${greenValue}, ${blueValue})`
            break
        }
    }
}

// eslint-disable-next-line no-unused-vars
class OpacityScrollAnimator extends ScrollAnimator {
    init (el) {
        super.init(el)
        el.style.animation = 'none'
        el.style.opacity = this.options.startValue
        setTimeout(() => {
            el.style.transition = `${el.style.transition
                ? ', '
                : ''}${this.options.animationEaseTime}ms ease opacity`
        }, 100)
    }

    animate (percent) {
        this.element.style.visibility = 'visible'
        const value = (100 - percent) * (this.options.endValue - this.options.startValue) / 100 + this.options.startValue
        this.element.style.opacity = value
    }
}

// eslint-disable-next-line no-unused-vars
class AudioPlayer extends Component {
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

            FS.autoRemoveComponentsOfTypes(this.constructor.name)
            this.el = el
            el.appendChild(this.createPlayer())
            this.createMeta()
        })
    }

    deinit () {
        this.audioContext.close()
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
        audio.autoplay = this.options.autoplay
        audio.loop = this.options.loop

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

        const button = document.createElement('i')
        player.appendChild(button)
        button.classList.add('button')
        button.innerHTML = 'play_arrow'
        button.classList.add('material-icons')
        button.style.color = this.options.color
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

        this.isCreated = true
        if (this.options.createdCallback && Util.isFunction(this.options.createdCallback)) {
            this.options.createdCallback(this)
        }
        return player
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

// eslint-disable-next-line no-unused-vars
class Toast {
    constructor (options) {
        this.options = {
            type: 'info',
            delay: 0,
            duration: 5000,
            position: 'toast-top-right',
            onclick: null,
            animationTime: 300
        }

        this.options = Util.extends(options || {}, this.options)
        this.createToaster()
    }

    createToast (title, message) {
        const toast = document.createElement('div')
        toast.classList.add('toast')

        const titleElement = document.createElement('p')
        titleElement.classList.add('toast-title')
        titleElement.innerHTML = title
        toast.appendChild(titleElement)

        const messageElement = document.createElement('p')
        messageElement.classList.add('toast-message')
        messageElement.innerHTML = message
        toast.appendChild(messageElement)

        return toast
    }

    createToaster () {
        this.toaster = document.createElement('div')
        this.toaster.classList.add('toast-toaster')
        document.body.appendChild(this.toaster)
    }

    clearToasterPosition () {
        this.toaster.classList.remove('toast-top-right')
        this.toaster.classList.remove('toast-top-left')
        this.toaster.classList.remove('toast-bottom-right')
        this.toaster.classList.remove('toast-bottom-left')
    }

    show (title, message, options) {
        options = Util.extends(options || {}, this.options)

        this.clearToasterPosition()
        this.toaster.classList.add(options.position)

        const toast = this.createToast(title, message)
        toast.classList.add(`toast-${options.type}`)
        toast.style.transitionDuration = `${options.animationTime}ms`

        // custom user defined click action
        if (Util.isFunction(options.onclick)) {
            toast.addEventListener('click', () => {
                options.onclick()
            })
        }

        // remove toast on any click
        toast.addEventListener('click', () => {
            this.popToast(toast, options.animationTime)
        })

        // wait for delay option
        setTimeout(() => {
            this.toaster.appendChild(toast)
            toast.style.opacity = 1

            // wait until duration has passed + fade in animation time
            setTimeout(() => {
                this.popToast(toast, options.animationTime)
            }, options.duration + options.animationTime)
        }, options.delay)
    }

    popToast (toast, animationTime) {
        toast.style.opacity = 0

        // remove the toast after it faded out
        setTimeout(() => { this.toaster.removeChild(toast) }, animationTime)
    }
}

// eslint-disable-next-line no-unused-vars
class Particle extends Component {
    constructor (options) {
        super()
        const defaults = {
            count: 300,
            radius: 2,
            speed: 0.05,
            color: '#FFFFFF',
            threshold: 60
        }
        this.options = Util.extends(options, defaults)
    }

    init (el) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = el.offsetWidth
        this.canvas.height = el.offsetHeight
        this.canvas.style.width = '100%'
        this.canvas.style.height = '100%'
        el.appendChild(this.canvas)

        this.context = this.canvas.getContext('2d')
        this.createParticles()

        this.lastUpdate = Date.now()
        this.loop()
    }

    createParticles () {
        this.particles = []
        for (let i = 0; i < this.options.count; ++i) {
            this.particles.push({
                x: Math.random(),
                y: Math.random(),
                radius: this.options.radius + (Math.random() * 2 - 1),
                speed: this.options.speed * (Math.random() * 2),
                direction: Math.round(Math.random() * 360)
            })
        }
    }

    loop () {
        const now = Date.now()
        this.update(now - this.lastUpdate)
        this.lastUpdate = now
        this.draw()
        return requestAnimationFrame(this.loop.bind(this))
    }

    update (deltaTime) {
        for (let i = 0; i < this.particles.length; i++) {
            const radians = (Math.PI / 180) * (this.particles[i].direction - 90)
            const delta = this.particles[i].speed * deltaTime
            this.particles[i].x += Math.cos(radians) * delta / this.canvas.width
            this.particles[i].y += Math.sin(radians) * delta / this.canvas.height

            this.particles[i].x >= 1 && (this.particles[i].x -= 1)
            this.particles[i].x < 0 && (this.particles[i].x += 1)
            this.particles[i].y >= 1 && (this.particles[i].y -= 1)
            this.particles[i].y < 0 && (this.particles[i].y += 1)
        }
    }

    draw () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fillStyle = this.options.color
        this.context.strokeStyle = this.options.color

        for (let i = 0; i < this.particles.length; ++i) {
            this.context.beginPath()

            this.context.arc(this.particles[i].x * this.canvas.width,
                this.particles[i].y * this.canvas.height,
                this.particles[i].radius,
                0,
                2 * Math.PI)

            this.context.closePath()
            this.context.fill()

            for (let j = i + 1; j < this.particles.length; ++j) {
                this.link(this.particles[i], this.particles[j])
            }
        }
    }

    link (p1, p2) {
        const distance = Math.sqrt(Math.pow(p2.x * this.canvas.width - p1.x * this.canvas.width, 2) + Math.pow(p2.y * this.canvas.height - p1.y * this.canvas.height, 2))
        const thresholdOffset = 20
        const farThreshold = this.options.threshold + thresholdOffset
        if (distance < farThreshold) {
            this.context.globalAlpha = 1 - (distance / farThreshold)
            this.context.beginPath()
            this.context.lineWidth = 1
            this.context.moveTo(p1.x * this.canvas.width, p1.y * this.canvas.height)
            this.context.lineTo(p2.x * this.canvas.width, p2.y * this.canvas.height)
            this.context.stroke()
            this.context.closePath()
            this.context.globalAlpha = 1
        }
    }
}

FS.init()
