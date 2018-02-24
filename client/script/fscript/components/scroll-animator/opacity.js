import ScrollAnimator from './scroll-animator'

export default class OpacityScrollAnimator extends ScrollAnimator {
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
