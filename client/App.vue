<template>
    <div id="app" class="body" style="overflow-x: hidden;" onclick="document.getElementById('options-wrapper').classList.remove('active')">
        <nav-menu></nav-menu>
        <radio></radio>
        <router-view></router-view>
    </div>
</template>

<script>
    import Navigation from '@/components/Navigation'
    import Radio from '@/components/Radio'
    
    export default {
        name: 'app',
        components: {
            'nav-menu': Navigation,
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
