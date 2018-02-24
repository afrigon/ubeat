import ScrollAnimator from './scroll-animator'
import Util from '../../tools/util'

export default class Color extends ScrollAnimator {
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
