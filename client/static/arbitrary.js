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

const spinTarget = document.getElementById('turntable')
// const spinImageTarget = document.getElementById('turntable-image');
var isPlaying = false

// spinTarget.addEventListener('animationiteration', () => {
//     if (!isPlaying) {
//     }
// })

// eslint-disable-next-line no-unused-vars
function spin () {
    isPlaying = !isPlaying

    if (isPlaying) {
        spinTarget.classList.remove('hoverable-pop')
        spinTarget.classList.add('circle')
        spinTarget.style.animation = 'spin 2s linear infinite'
    } else {
        spinTarget.classList.remove('circle')
        spinTarget.style.animation = 'none'
        spinTarget.classList.add('hoverable-pop')
    }
}
