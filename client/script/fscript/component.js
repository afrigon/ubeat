export default class Component {
    constructor () {
        if (this.constructor === Component) {
            throw new TypeError('Can not construct abstract class.')
        }

        if (this.init === Component.prototype.init) {
            throw new TypeError('Please implement abstract method init.')
        }
    }

    getName () {
        return this.constructor.name
    }
}
