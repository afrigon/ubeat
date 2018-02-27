import Component from '../component'
import Util from '../tools/util'

export default class Banner extends Component {
    get defaults () {
        return {
            backgroundColor: '#c64d47',
            color: '#FFFFFF',
            duration: 3000,
            title: 'FScript Banner',
            message: 'You should put a message in your banner!'
        }
    }

    constructor (options) {
        super()
        if (!options) throw new Error('Banner should always have an option object as it\'s first parameter')
        this.options = Util.extends(options, this.defaults)
        switch (this.options.type) {
        case 'info': this.options.backgroundColor = '#1e88e5'; break
        case 'success': this.options.backgroundColor = '#4caf50'; break
        case 'warn': this.options.backgroundColor = '#ffca28'; break
        case 'error': this.options.backgroundColor = '#c64d47'; break
        }
    }

    init () {
        this.createBanner()
        this.show(this.options.title, this.options.message)
    }

    createBanner () {
        const banner = document.createElement('div')
        this.banner = banner
        banner.style.backgroundColor = this.options.backgroundColor
        banner.style.color = this.options.color
        banner.classList.add('fscript-banner')

        const container = document.createElement('div')
        container.classList.add('container')
        banner.appendChild(container)

        const title = document.createElement('strong')
        this.title = title
        title.classList.add('text-size-2')
        title.innerHTML = this.options.title
        container.appendChild(title)

        const message = document.createElement('div')
        this.message = message
        message.classList.add('text-size-small-7')
        container.appendChild(message)
    }

    show (title, message) {
        this.title.innerHTML = title
        this.message.innerHTML = message
        document.body.appendChild(this.banner)
        setTimeout(() => {
            this.banner.classList.add('active')
        }, 100)
        setTimeout(() => {
            this.banner.classList.remove('active')
        }, this.options.duration + 100 + 300)
        setTimeout(() => {
            this.banner.parentNode.removeChild(this.banner)
        }, this.options.duration + 100 + 300 + 300)
    }
}
