import Component from '../component'
import Util from '../tools/util'

export default class Banner extends Component {
    get defaults () {
        return {
            backgroundColor: '#c64d47',
            color: '#FFFFFF',
            borderColor: '#993a35',
            duration: 3000,
            title: 'FScript Banner',
            message: 'You should put a message in your banner!'
        }
    }

    constructor (options) {
        super()
        if (!options) throw new Error('Banner should always have an option object as it\'s first parameter')
        this.options = Util.extends(options, this.defaults)
    }

    init () {
        this.createBanner()
        setTimeout(() => {
            this.banner.classList.add('active')
        }, 100)
        setTimeout(() => {
            this.banner.classList.remove('active')
        }, this.options.duration + 100 + 300)
    }

    createBanner () {
        this.banner = document.getElementById('fscript-banner')
        if (!this.banner) {
            const banner = document.createElement('div')
            this.banner = banner
            banner.classList.add('banner')
            banner.id = 'fscript-banner'
            document.body.appendChild(banner)

            const container = document.createElement('div')
            container.classList.add('container')
            banner.appendChild(container)

            const title = document.createElement('strong')
            this.title = title
            title.classList.add('text-size-2')
            container.appendChild(title)

            const message = document.createElement('div')
            this.message = message
            message.classList.add('text-size-small-7')
            container.appendChild(message)
        }

        this.banner.style.backgroundColor = this.options.backgroundColor
        this.banner.style.color = this.options.color
        this.banner.style.borderColor = this.options.borderColor
        this.title.innerHTML = this.options.title
        this.message.innerHTML = this.options.message
    }
}
