import Component from '../../component'
import Util from '../../tools/util'

export default class ScrollAnimator extends Component {
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

    addTransition (transition) {
        this.element.style.transition = [this.element.style.transition, transition].filter(n => n).join(', ')
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
