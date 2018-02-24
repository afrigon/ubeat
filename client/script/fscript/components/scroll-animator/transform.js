import ScrollAnimator from './scroll-animator'
import Util from '../../tools/util'

export default class Transform extends ScrollAnimator {
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
            this.addTransition(`${this.options.animationEaseTime}ms ease transform`)
        }, 100)
    }

    animate (percent) {
        const value = Util.getValuesAt(percent, this.options.startValue, this.options.endValue)
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
