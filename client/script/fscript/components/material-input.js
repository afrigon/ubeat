import Component from '../component'
import Util from '../tools/util'

export default class MaterialInput extends Component {
    init () {
        const selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea'
        document.querySelectorAll(selector).forEach((element) => {
            const label = element.parentNode.getElementsByTagName('label')[0]
            if (!label) return
            if (element.value) {
                label.classList.add('active')
            } else {
                label.classList.remove('active')
            }
            Util.addEvent(element, 'focus', (event) => {
                label.classList.add('active')
            })
            Util.addEvent(element, 'blur', (event) => {
                !element.value && label.classList.remove('active')
            })
        })
    }
}
