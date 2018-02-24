import Component from '../component'

export default class GradientFader extends Component {
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
