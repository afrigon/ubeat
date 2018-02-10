<template lang="pug">
    div#app.body(onclick="document.getElementById('options-wrapper').classList.remove('active')")
        navigation
        radio
        router-view
</template>

<script>
    import Navigation from '@/components/navigation'
    import Radio from '@/components/radio'
    
    export default {
        name: 'app',
        components: {
            'navigation': Navigation,
            'radio': Radio
        },
        mounted () {
            // eslint-disable-next-line no-undef
            setFilter(null, window.sessionStorage.getItem('search-flags') || 7)

            // eslint-disable-next-line no-undef
            Util.addEvent(window, 'resize', () => {
                const element = document.getElementById('options-wrapper')
                if (element) { element.classList.remove('active') }
            })
        }
    }
</script>

<style>
    .body { overflow-x: hidden; }
</style>
