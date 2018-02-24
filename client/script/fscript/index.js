import Component from './component'
import Util from './tools/util'

export { default as Network, HttpError } from './tools/network'
export { default as Util } from './tools/util'
export { default as Color } from './tools/color'
export { default as Toast } from './tools/toast'

export { default as AudioPlayer } from './components/audio-player'
export { default as Banner } from './components/banner'
export { default as Drawer } from './components/drawer'
export { default as GradientFader } from './components/gradient-fader'
export { default as MaterialInput } from './components/material-input'
export { default as Particle } from './components/particle'
export { default as ScrollAnimator } from './components/scroll-animator'

export class FScript {
    static addComponent (component, selector) {
        return Util.onReady(() => {
            if (!component || !(component instanceof Component)) {
                return Util.logError(new Error('invalid component passed to FrigStudio.addComponent'))
            }

            if (!this.comopnents) this.components = []
            this.components.push(component)
            if (!selector) { return component.init() }
            if (!Util.isString(selector)) {
                return Util.logError(new Error('invalid selector passed to FrigStudio.addComponent'))
            }

            const elements = document.querySelectorAll(selector)
            for (let i = 0; i < elements.length; i++) {
                component.init(elements[i])
            }
            return null
        })
    }

    static removeComponent (component) {
        if (component.deinit && Util.isFunction(component.deinit())) {
            component.deinit()
        }
        return this.components.splice(this.components.indexOf(component), 1)
    }

    static autoRemoveComponentsOfTypes (type) {
        const components = this.components.filter(n => n.constructor.name === type)

        for (let i = 0; i < components.length - 1; ++i) {
            if (components[i].options.shouldAutoRemove) {
                this.removeComponent(components[i])
            }
        }
    }

    static hasComponentOfType (type) {
        return this.components.filter(n => n.constructor.name === type).length > 0
    }
}
