import Util from './util'

export default class Toast {
    constructor (options) {
        this.options = {
            type: 'info',
            delay: 0,
            duration: 5000,
            position: 'toast-top-right',
            onclick: null,
            animationTime: 300
        }

        this.options = Util.extends(options || {}, this.options)
        this.createToaster()
    }

    createToast (title, message) {
        const toast = document.createElement('div')
        toast.classList.add('toast')

        const titleElement = document.createElement('p')
        titleElement.classList.add('toast-title')
        titleElement.innerHTML = title
        toast.appendChild(titleElement)

        const messageElement = document.createElement('p')
        messageElement.classList.add('toast-message')
        messageElement.innerHTML = message
        toast.appendChild(messageElement)

        return toast
    }

    createToaster () {
        this.toaster = document.createElement('div')
        this.toaster.classList.add('toast-toaster')
        document.body.appendChild(this.toaster)
    }

    clearToasterPosition () {
        this.toaster.classList.remove('toast-top-right')
        this.toaster.classList.remove('toast-top-left')
        this.toaster.classList.remove('toast-bottom-right')
        this.toaster.classList.remove('toast-bottom-left')
    }

    show (title, message, options) {
        options = Util.extends(options || {}, this.options)

        this.clearToasterPosition()
        this.toaster.classList.add(options.position)

        const toast = this.createToast(title, message)
        toast.classList.add(`toast-${options.type}`)
        toast.style.transitionDuration = `${options.animationTime}ms`

        // custom user defined click action
        if (Util.isFunction(options.onclick)) {
            toast.addEventListener('click', () => {
                options.onclick()
            })
        }

        // remove toast on any click
        toast.addEventListener('click', () => {
            this.popToast(toast, options.animationTime)
        })

        // wait for delay option
        setTimeout(() => {
            this.toaster.appendChild(toast)
            toast.style.opacity = 1

            // wait until duration has passed + fade in animation time
            setTimeout(() => {
                this.popToast(toast, options.animationTime)
            }, options.duration + options.animationTime)
        }, options.delay)
    }

    popToast (toast, animationTime) {
        toast.style.opacity = 0

        // remove the toast after it faded out
        setTimeout(() => { this.toaster.removeChild(toast) }, animationTime)
    }
}
