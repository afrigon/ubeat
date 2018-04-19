import Component from '../component'
import Util from '../tools/util'

export default class Drawer extends Component {
    init () {
        this.initDrawers()
        this.initTriggers()
    }

    initDrawers () {
        const drawers = document.querySelectorAll('.drawer-wrapper')
        return drawers.forEach((drawer) => {
            return this.initDrawer(drawer)
        })
    }

    initDrawer (drawer) {
        const component = document.createElement('div')
        component.classList.add('drawer')
        while (drawer.firstChild) { component.appendChild(drawer.removeChild(drawer.firstChild)) }
        drawer.appendChild(component)

        const filter = document.createElement('div')
        filter.classList.add('drawer-filter')
        Util.addEvent(filter, 'click', (event) => {
            return event.currentTarget.parentNode.classList.remove('open')
        })
        Util.addEvent(window, 'resize', (event) => {
            return drawer.classList.remove('open')
        })
        component.querySelectorAll('.drawer-close').forEach((closeButton) => {
            Util.addEvent(closeButton, 'click', (event) => {
                return drawer.classList.remove('open')
            })
        })
        this.initActions(drawer)
        return drawer.appendChild(filter)
    }

    initTriggers () {
        const elements = document.querySelectorAll('.drawer-trigger')
        return elements.forEach((element) => {
            return Util.addEvent(element, 'click', (event) => {
                const targetId = event.currentTarget.getAttribute('data-drawer-wrapper-id').replace(/^#/, '')
                const target = document.getElementById(targetId)
                return target && target.classList.add('open')
            })
        })
    }

    initActions (drawer) {
        const elements = drawer.querySelectorAll('.drawer-action')
        return elements.forEach((element) => {
            return Util.addEvent(element, 'click', (event) => {
                const actions = drawer.querySelectorAll('.drawer-action')
                actions.forEach((action) => {
                    action.classList.remove('active')
                })
                event.target.classList.add('active')
                return drawer.classList.remove('open')
            })
        })
    }
}
