import Component from '../component'
import Util from '../tools/util'

export default class Particle extends Component {
    constructor (options) {
        super()
        const defaults = {
            count: 300,
            radius: 2,
            speed: 0.05,
            color: '#FFFFFF',
            threshold: 60
        }
        this.options = Util.extends(options, defaults)
    }

    init (el) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = el.offsetWidth
        this.canvas.height = el.offsetHeight
        this.canvas.style.width = '100%'
        this.canvas.style.height = '100%'
        el.appendChild(this.canvas)

        this.context = this.canvas.getContext('2d')
        this.createParticles()

        this.lastUpdate = Date.now()
        this.loop()
    }

    createParticles () {
        this.particles = []
        for (let i = 0; i < this.options.count; ++i) {
            this.particles.push({
                x: Math.random(),
                y: Math.random(),
                radius: this.options.radius + (Math.random() * 2 - 1),
                speed: this.options.speed * (Math.random() * 2),
                direction: Math.round(Math.random() * 360)
            })
        }
    }

    loop () {
        const now = Date.now()
        this.update(now - this.lastUpdate)
        this.lastUpdate = now
        this.draw()
        return requestAnimationFrame(this.loop.bind(this))
    }

    update (deltaTime) {
        for (let i = 0; i < this.particles.length; i++) {
            const radians = (Math.PI / 180) * (this.particles[i].direction - 90)
            const delta = this.particles[i].speed * deltaTime
            this.particles[i].x += Math.cos(radians) * delta / this.canvas.width
            this.particles[i].y += Math.sin(radians) * delta / this.canvas.height

            this.particles[i].x >= 1 && (this.particles[i].x -= 1)
            this.particles[i].x < 0 && (this.particles[i].x += 1)
            this.particles[i].y >= 1 && (this.particles[i].y -= 1)
            this.particles[i].y < 0 && (this.particles[i].y += 1)
        }
    }

    draw () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.context.fillStyle = this.options.color
        this.context.strokeStyle = this.options.color

        for (let i = 0; i < this.particles.length; ++i) {
            this.context.beginPath()

            this.context.arc(this.particles[i].x * this.canvas.width,
                this.particles[i].y * this.canvas.height,
                this.particles[i].radius,
                0,
                2 * Math.PI)

            this.context.closePath()
            this.context.fill()

            for (let j = i + 1; j < this.particles.length; ++j) {
                this.link(this.particles[i], this.particles[j])
            }
        }
    }

    link (p1, p2) {
        const distance = Util.distance2D(Util.magnifyTo(this.canvas.width, p1.x),
            Util.magnifyTo(this.canvas.width, p2.x),
            Util.magnifyTo(this.canvas.height, p1.y),
            Util.magnifyTo(this.canvas.height, p2.y))
        const thresholdOffset = 20
        const farThreshold = this.options.threshold + thresholdOffset
        if (distance < farThreshold) {
            this.context.globalAlpha = 1 - (distance / farThreshold)
            this.context.beginPath()
            this.context.lineWidth = 1
            this.context.moveTo(Util.magnifyTo(this.canvas.width, p1.x), Util.magnifyTo(this.canvas.height, p1.y))
            this.context.lineTo(Util.magnifyTo(this.canvas.width, p2.x), Util.magnifyTo(this.canvas.height, p2.y))
            this.context.stroke()
            this.context.closePath()
            this.context.globalAlpha = 1
        }
    }
}
