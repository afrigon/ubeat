// eslint-disable no-unused-vars
let flags = 0
function setFilter (event, value) {
    event && event.preventDefault()
    value || (value = flags)
    // add or remove value from flags
    if ((flags & value) !== 0) { flags &= ~value } else { flags |= value }

    const filter = document.getElementById('search-filter')
    filter && (filter.value = Util.getBitwiseArray(4).map((n) => { // eslint-disable-line no-undef
        const buttons = document.querySelectorAll(`.filter-button-${n}`)
        if (!buttons || buttons.length <= 0) return null
        if ((n & flags) === 0) {
            buttons.forEach((button) => {
                button.classList.remove('active')
            })
            return null
        }

        buttons.forEach((button) => {
            button.classList.add('active')
        })
        return n
    }).join(','))
    return window.sessionStorage.setItem('search-flags', flags)
}

function toggleOptionsMenu () {
    const wrapper = document.getElementById('options-wrapper')
    return wrapper && wrapper.classList.toggle('active')
}
// eslint-enable no-unused-vars
