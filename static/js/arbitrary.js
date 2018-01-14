var flags = 0

// eslint-disable-next-line no-unused-vars
function setFilter (event, value) {
    if (event) { event.preventDefault() }
    if ((flags & value) !== 0) {
        flags -= (flags & value)
    } else {
        flags |= value
    }

    const filter = document.getElementById('search-filter')
    return filter && (filter.value = [1, 2, 4, 8].map((n) => {
        const button = document.getElementById(`filter-button-${n}`)
        if (!button) { return null }
        if ((n & flags) === 0) {
            button.classList.remove('active')
            return null
        }

        button.classList.add('active')
        return n
    }).join(','))
}

// eslint-disable-next-line no-unused-vars
function toggleOptionsMenu () {
    const wrapper = document.getElementById('options-wrapper')
    return wrapper && wrapper.classList.toggle('active')
}
