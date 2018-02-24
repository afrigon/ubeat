import Component from '../../component'
import Util from '../../tools/util'

export default class Auto extends Component {
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
