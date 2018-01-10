var flags = 0
function setFilter (event, value) {
    if (event) { event.preventDefault() }
    if ((flags & value) !== 0) {
        flags -= (flags & value)
    } else {
        flags |= value
    }

    document.getElementById('search-filter').value = [1, 2, 4, 8].map((n) => {
        if ((n & flags) === 0) {
            document.getElementById(`filter-button-${n}`).classList.remove('active')
            return null
        }

        document.getElementById(`filter-button-${n}`).classList.add('active')
        return n
    }).join(',')
}
setFilter(null, 7)
