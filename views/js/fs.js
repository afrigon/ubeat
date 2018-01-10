class Util {
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
}

class FS {
    static addComponent (component, selector) {
        const initComponent = () => {
            if (!component || !(component instanceof Component)) {
                return this.logError(new Error('invalid component passed to FrigStudio.addComponent'))
            }

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

    static logError (err) {
        console.error(`FrigStudio Error line(${err.line}:${err.column}): ${err.message}`)
    }
}

class FrigstudioInit extends Component {
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
FS.addComponent(new FrigstudioInit())

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
    }

    init () {
        const tickInterval = 50
        window.scrollAnimator = this
        this.hasScroll = true // will animate elements visible on page load
        this.elements = document.querySelectorAll(`.${this.options.selector}`)
        if (this.elements.length) {
            this.elements.forEach((element) => {
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
            element.style.animationName = 'none'
        }

        element.style.animationDelay = element.getAttribute('data-delay') || '0s'
        try {
            element.style.animationIterationCount = parseInt(element.getAttribute('data-iteration'), 10)
        } catch (ex) {
            element.style.animationIterationCount = 0
        }
        element.style.animationName = element.getAttribute('data-animation-name') || 'none'
        return (element.style.visibility = isVisible
            ? 'visible'
            : 'hidden')
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
            return FS.logError(new Error('invalid offset provided for scrollAnimator'))
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
        window.scrollAnimator.hasScroll = true
    }

    scrollCallback () {
        if (this.scrollAnimator.hasScroll) {
            this.scrollAnimator.hasScroll = false
            if (!this.scrollAnimator.elements.length) {
                Util.removeEvent(this.scrollAnimator.options.scrollContainer, 'scroll', this.scrollAnimator.didScroll)
                Util.removeEvent(this.scrollAnimator.options.scrollContainer, 'resize', this.scrollAnimator.didScroll)
                if (this.scrollAnimator.timer) {
                    clearInterval(this.scrollAnimator.timer)
                }
                return
            }

            this.scrollAnimator.elements = Array.from(this.scrollAnimator.elements).filter((element) => {
                if (this.scrollAnimator.isElementOnScreen(element)) {
                    this.scrollAnimator.setVisibility(element, true)
                    element.className += ` ${this.scrollAnimator.options.trigger}`
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
