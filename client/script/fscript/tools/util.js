export default class Util {
    static extends (object, defaults) {
        if (!Util.isObject(object)) object = {}
        if (!Util.isObject(defaults)) defaults = {}

        for (let k in defaults) {
            object[k] = object[k] || defaults[k]
        }
        return object
    }

    static addEvent (element, eventName, eventCallback) {
        if (element.addEventListener) {
            element.addEventListener(eventName, eventCallback, false)
        } else if (element.attachEvent) {
            element.attachEvent(`on${eventName}`, eventCallback)
        } else {
            element[eventName] = eventCallback
        }
    }

    static removeEvent (element, eventName, eventCallback) {
        if (element.removeEventListener) {
            element.removeEventListener(eventName, eventCallback, false)
        } else if (element.detachEvent) {
            element.detachEvent(`on${eventName}`, eventCallback)
        } else {
            delete element[eventName]
        }
    }

    static getBitwiseArray (length) {
        const array = []
        for (let i = 0; i < length; ++i) {
            array.push(Math.pow(2, i))
        }
        return array
    }

    static clamp (value, min, max) {
        return Math.min(Math.max(value, min), max)
    }

    static getValueAt (percent, start, end) {
        return (100 - percent) * (end - start) / 100 + start
    }

    static pythagore (x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    }

    static slope (x1, y1, x2, y2) {
        return (y2 - y1) / (x2 - x1)
    }

    static distance2D (x1, y1, x2, y2) {
        return Util.pythagore(x2 - x1, y2 - y1)
    }

    // not sure if magnification is the right name for this operation
    static magnifyTo (fullSize, value) {
        return value * fullSize
    }

    static clone (instance) {
        return Object.assign(Object.create(Object.getPrototypeOf(instance)), instance)
    }

    static logError (err) {
        console.error(`Frigscript Error line(${err.line}:${err.column}): ${err.message}`)
    }

    static isObject (target) {
        return target !== null && typeof target === 'object'
    }

    static isFunction (target) {
        return typeof target === 'function'
    }

    static safeCallback (callback, ...params) {
        if (callback && Util.isFunction(callback)) {
            callback(...params) // eslint-disable-line standard/no-callback-literal
            return true
        }
        return false
    }

    static isString (target) {
        return target.constructor === String
    }

    static secondsToTime (seconds) {
        const h = '0' + Math.floor(seconds / 3600)
        const m = '0' + Math.floor((seconds - (h * 3600)) / 60)
        const s = '0' + Math.floor(seconds - (h * 3600) - (m * 60))
        return `${h > 0 ? `${h.substr(h.length - 2)}:` : ''}${m.substr(m.length - 2)}:${s.substr(s.length - 2)}`
    }

    static isTouch () {
        return 'ontouchstart' in document.documentElement
    }

    static onReady (callback) {
        if (!['interactive', 'complete'].includes(document.readyState)) {
            return Util.addEvent(document, 'DOMContentLoaded', callback)
        }
        return callback()
    }
}
