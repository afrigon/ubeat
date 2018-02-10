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

    static secondsToTime (seconds) {
        const h = '0' + Math.floor(seconds / 3600)
        const m = '0' + Math.floor((seconds - (h * 3600)) / 60)
        const s = '0' + Math.floor(seconds - (h * 3600) - (m * 60))
        return `${h > 0 ? `${h.substr(h.length - 2)}:` : ''}${m.substr(m.length - 2)}:${s.substr(s.length - 2)}`
    }

    static request (url, method, data, callback) {
        const request = new XMLHttpRequest()
        request.onreadystatechange = () => {
            if(request.readyState === 4) {
                if(request.status >= 400) { 
                    return callback(new Error('Could not complete ajax request'))
                }
                
                if (!request.responseText) return callback()
                let json;
                try {
                    json = JSON.parse(request.responseText)
                } catch (e) {
                    return callback(new Error(e.message))
                }
                return callback(null, json) 
            }
        }
        request.open(method, url)
        if (data) (data = JSON.stringify(data)) & request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        request.send(data)
    }

    static getQueryParam (name) {
        const url = window.location.href
        name = name.replace(/[\[\]]/g, "\\$&")        
        const results = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`).exec(url)
        if (!results) return null
        if (!results[2]) return ''
        return decodeURIComponent(results[2].replace(/\+/g, ' '))
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
        return this.constructor.name;
    }
}

class FS {
    static addComponent (component, selector) {
        const initComponent = () => {
            if (!component || !(component instanceof Component)) {
                return this.logError(new Error('invalid component passed to FrigStudio.addComponent'))
            }

            this.components.push(component)

            if (!selector) {
                return component.init()
            } else if (selector.constructor !== String) {
                return this.logError(new Error('invalid selector passed to FrigStudio.addComponent'))
            }

            const elements = document.querySelectorAll(selector)
            for (let i = 0; i < elements.length; i++) {
                component.init(elements[i])
            }
            return undefined
        }

        if (['interactive', 'complete'].includes(document.readyState)) {
            initComponent()
        } else {
            Util.addEvent(document, 'DOMContentLoaded', initComponent)
        }
    }

    static removeComponent (component) {
        if (component.deinit && Util.isFunction(component.deinit())) {
            component.deinit()
        }
        return this.components.splice(this.components.indexOf(component), 1)
    }

    static autoRemoveComponentsOfTypes(type) {
        const components = this.components.filter((n) => {
            n.constructor.name === type
        })

        for (let i = 0; i < components.length-1; ++i) {
            if (components[i].options.shouldAutoRemove) {
                this.removeComponent(components[i])
            }
        }
    }

    static init () {
        this.components = []
        FS.addComponent(new MaterialInput())
        FS.addComponent(new Drawer())
    }
}

class MaterialInput extends Component {
    init () {
        const selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea'
        document.querySelectorAll(selector).forEach((element) => {
            Util.addEvent(element, 'focus', (event) => {
                const label = event.target.parentNode.getElementsByTagName('label')[0]
                if (label) {
                    label.classList.add('active')
                }
            })
            Util.addEvent(element, 'blur', (event) => {
                const label = event.target.parentNode.getElementsByTagName('label')[0]
                if (label && !element.value) {
                    label.classList.remove('active')
                }
            })
        })
    }
}

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

    scrollCallback () {
        if (this.hasScroll) {
            this.hasScroll = false
            if (!this.elements.length) {
                Util.removeEvent(this.options.scrollContainer, 'scroll', this.didScroll)
                Util.removeEvent(this.options.scrollContainer, 'resize', this.didScroll)
                if (this.timer) {
                    clearInterval(this.timer)
                }
                return
            }

            this.elements = Array.from(this.elements).filter((element) => {
                if (this.isElementOnScreen(element)) {
                    this.setVisibility(element, true)
                    element.className += ` ${this.options.trigger}`
                    return false
                }

                return true
            })
        }
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

        this.startColor = {
            'red': (this.options.startValue & 0xFF0000) >> 16,
            'green': (this.options.startValue & 0x00FF00) >> 8,
            'blue': this.options.startValue & 0x0000FF
        }

        this.endColor = {
            'red': (this.options.endValue & 0xFF0000) >> 16,
            'green': (this.options.endValue & 0x00FF00) >> 8,
            'blue': this.options.endValue & 0x0000FF
        }
    }

    init (el) {
        super.init(el)
        setTimeout(() => {
            el.style.transition = `${el.style.transition
                ? ', '
                : ''}${this.options.animationEaseTime}ms ease background-color, ${this.options.animationEaseTime}ms ease color`
        }, 100)
    }

    animate (percent) {
        const redValue = Math.round((100 - percent) * (this.endColor.red - this.startColor.red) / 100 + this.startColor.red)
        const greenValue = Math.round((100 - percent) * (this.endColor.green - this.startColor.green) / 100 + this.startColor.green)
        const blueValue = Math.round((100 - percent) * (this.endColor.blue - this.startColor.blue) / 100 + this.startColor.blue)

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
    constructor (source, options) {
        super()
        if (Util.isObject(source)) {
            options = source
        } else {
            this.source = source
        }
            
        this.options = Util.extends(options, {
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
        })
        this.resize = this.resize.bind(this)
    }
    
    init (el) {
        if (!this.options.fetchCallback || !Util.isFunction(this.options.fetchCallback)) {
            this.options.fetchCallback = (_, callback) => { return callback() }
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
        player.classList.add('timeline')
        player.style.display = 'flex'
        player.style.justifyContent = 'center'
        player.style.alignItems = 'center'
        player.style.paddingTop = `${this.options.barHeight - 12}px` // 12 == half the timeline's height
        player.classList.add('no-select')

        const audio = document.createElement('audio')
        this.audio = audio
        player.appendChild(audio)
        audio.crossOrigin = 'anonymous'
        audio.style.display = 'none'
        audio.src = this.source
        audio.autoplay = this.options.autoplay
        audio.loop = this.options.loop

        Util.addEvent(audio, 'ended', () => {
            if (this.options.clipEndCallback && Util.isFunction(this.options.clipEndCallback)) {
                return this.options.clipEndCallback(this)
            }

            if (this.options.stopCallback && Util.isFunction(this.options.stopCallback)) {
                return this.options.stopCallback(this)
            }

            return audio.pause()
        })
        Util.addEvent(audio, 'pause', () => {
            return button.innerHTML = 'play_arrow'
        })
        Util.addEvent(audio, 'play', () => {
            // stupid hack for safari
            audio.currentTime = this.options.startTime
            this.options.startTime = 0

            if (this.options.stopCallback) {
                return button.innerHTML = 'stop'
            }

            return button.innerHTML = 'pause'
        })

        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'play_arrow'
        button.style.color = this.options.color
        button.style.lineHeight = '24px'
        if (!this.options.disabled) {
            button.style.cursor = 'pointer'
            Util.addEvent(button, 'click', () => {
                if (!this.audio.paused) {
                    if (this.options.stopCallback && Util.isFunction(this.options.stopCallback)) {
                        return this.options.stopCallback(this)
                    }

                    return this.audio.pause()
                }

                return this.audio.play()
            })
        } else {
            button.style.cursor = 'not-allowed'
            button.style.opacity = '.4'
        }
        player.appendChild(button)

        const timeline = document.createElement('div')
        timeline.style.margin = '0 10px'
        timeline.style.width = '100%'
        timeline.style.height = '4px'
        timeline.style.position = 'relative'
        timeline.style.backgroundColor = this.options.color
        player.appendChild(timeline)

        const progress = document.createElement('div')
        this.progress = progress
        progress.style.width = '0%'
        progress.style.height = '100%'
        progress.style.backgroundColor = this.options.visualColor
        timeline.appendChild(progress)

        if (this.options.visual) {
            const canvas = document.createElement('canvas')
            this.canvas = canvas
            canvas.style.width = '100%'
            canvas.style.height = `${this.options.barHeight}px`
            canvas.style.bottom = '4px'
            canvas.style.position = 'absolute'
            this.canvas = canvas
            timeline.appendChild(canvas)
            canvas.width = this.el.clientWidth - 120 // terrible hack -> 120 == full width - controls
            canvas.height = this.options.barHeight
            Util.addEvent(window, 'resize', this.resize)
        }
        this.initVisual()

        const time = document.createElement('div')
        this.time = time
        time.style.color = this.options.color
        time.style.fontSize = '9px'
        time.style.whiteSpace = 'nowrap'
        time.style.width = '76px'
        time.innerHTML = '00:00 / 00:00'
        time.style.margin = '3px 0 0 5px'
        timeline.appendChild(time)

        this.isCreated = true
        if (this.options.createdCallback && Util.isFunction(this.options.createdCallback)) {
            this.options.createdCallback(this)
        }
        return player
    }

    createMeta () {
        const meta = document.createElement('div')
        this.el.appendChild(meta)
        meta.classList.add('meta')
        meta.style.margin = '13px 0 0 20px'
        meta.style.height = '30px'
        
        const art = document.createElement('img')
        this.metaArt = art
        art.style.width = '30px'
        art.style.height = '30px'
        meta.appendChild(art)

        const text = document.createElement('div')
        text.style.display = 'inline-block'
        text.style.color = this.options.color
        text.style.margin = '0 10px'
        text.style.lineHeight = '15px'
        text.style.fontSize = '10px'
        text.style.verticalAlign = 'top'
        text.style.width = 'calc(100% - 94px)'
        meta.appendChild(text)
        
        const title = document.createElement('p')
        this.metaTitle = title
        title.style.margin = 0
        title.style.textOverflow = 'ellipsis'
        title.style.whiteSpace = 'nowrap'
        title.style.overflow = 'hidden'
        text.appendChild(title)

        const artist = document.createElement('p')
        this.metaArtist = artist
        artist.style.color = this.options.visualColor
        artist.style.margin = 0
        artist.style.textOverflow = 'ellipsis'
        artist.style.whiteSpace = 'nowrap'
        artist.style.overflow = 'hidden'
        text.appendChild(artist)

        return this.setMeta()
    }

    setMeta (meta) {
        if (meta) this.options.meta = meta
        if (!this.isCreated) return

        if (!this.options.meta.title || !this.options.meta.artist) {
            this.metaArt.src = ''
            this.metaTitle.innerHTML = ''
            this.metaArtist.innerHTML = ''
        }

        this.metaArt.src = this.options.meta.pictureUrl || ''
        this.metaTitle.innerHTML = this.options.meta.title || ''
        this.metaArtist.innerHTML = this.options.meta.artist || ''
        this.resize()
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
        if (this.options.visual) {
            let data = new Uint8Array(this.analyser.frequencyBinCount)
            this.analyser.getByteFrequencyData(data)
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.context.fillStyle = this.options.visualColor

            const margin = 2
            const minBarWidth = 0.75
            let barCount = this.options.barCount
            const totalMargin = margin * barCount
            let barWidth = (this.canvas.width - totalMargin) / barCount
            let extraMargin = 0
            
            // if the requested barCount doesn't fit player width
            if (barWidth < minBarWidth) {
                // number of bars with minWidth that will fit screen
                barCount = Math.floor((this.canvas.width) / (minBarWidth + margin))

                //extra bar is the remaining modulo after bars have been removed
                const extraBar = (this.canvas.width) % (minBarWidth + margin)
                
                // new width is the minimum barWidth + the extra bar size distributed to each bar
                barWidth = minBarWidth + extraBar * (minBarWidth + margin) / barCount
            }

            for (let i = 0; i < this.options.barCount; ++i) {
                const percent = data[Math.floor(data.length / this.options.barCount * i)] / 255
                this.context.globalAlpha = Math.min(percent + 0.2, 1) // 0.2 is the initial value in f(x) = ax + b
                this.context.fillRect(i * barWidth + i * margin, this.canvas.height, barWidth, -(percent * (this.canvas.height - margin)))
            }
        }

        if (this.isCreated) {
            this.progress.style.width = `${this.audio.currentTime / this.audio.duration * 100}%`
            this.time.innerHTML = `${Util.secondsToTime(this.audio.currentTime || 0)} / ${Util.secondsToTime(this.audio.duration || 0)}`
        }

        return window.requestAnimationFrame(this.loopVisual.bind(this))
    }
}

FS.init()
