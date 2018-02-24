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
            position: options.random || false
        }
    }

    init (el) {
        el.style.animation = `GradientFader ${this.options.duration}ms ease-in infinite`
        el.style.animationDelay = this.options.random ? `-${Math.floor(Math.random() * this.options.duration / 1000) / 2}s` : '0s'
        el.style.backgroundColor = '#FFFFFF'
        el.style.backgroundImage = `linear-gradient(${this.options.angle}deg, ${this.options.colors.join(',')})`
        el.style.backgroundSize = `${this.options.colors.length}00%`
    }
}
