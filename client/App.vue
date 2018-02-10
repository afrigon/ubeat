<template lang="pug">
    div#app.body
        navigation
        radio
        router-view
</template>

<script>
    import Header from '@/components/header'
    import Radio from '@/components/radio'
    
    export default {
        name: 'app',
        components: {
            'navigation': Header,
            'radio': Radio
        },
        mounted () {
            Util.addEvent(window, 'resize', () => { // eslint-disable-line no-undef
                const element = document.getElementById('options-wrapper')
                return element && element.classList.remove('active')
            })
            Util.addEvent(document.getElementById('app'), 'click', () => { // eslint-disable-line no-undef
                const element = document.getElementById('options-wrapper')
                return element && element.classList.remove('active')
            })
            setFilter(null, window.sessionStorage.getItem('search-flags') || 7) // eslint-disable-line no-undef
        }
    }
</script>

<style>
    .body { overflow-x: hidden; }
</style>
