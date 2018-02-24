import ScrollAnimator from './scroll-animator'
import Util from '../../tools/util'

export default class OpacityScrollAnimator extends ScrollAnimator {
    init (el) {
        super.init(el)
        el.style.animation = 'none'
        el.style.opacity = this.options.startValue
        setTimeout(() => {
            this.addTransition(`${this.options.animationEaseTime}ms ease opacity`)
        }, 100)
    }

    animate (percent) {
        this.element.style.visibility = 'visible'
        this.element.style.opacity = Util.getValuesAt(percent, this.options.startValue, this.options.endValue)
    }
}
