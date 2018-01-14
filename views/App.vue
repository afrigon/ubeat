<template>
    <div id="app" class="body" style="overflow-x: hidden;" onclick="document.getElementById('options-wrapper').classList.remove('active')">
        <nav-menu></nav-menu>
        <router-view></router-view>
        <footer-view></footer-view>
    </div>
</template>

<script>
    import Navigation from '@/components/Navigation'
    import Footer from '@/components/Footer'

    export default {
        name: 'app',
        components: {
            'nav-menu': Navigation,
            'footer-view': Footer
        },
        mounted () {
            // eslint-disable-next-line no-undef
            setFilter(null, 7)

            // eslint-disable-next-line no-undef
            Util.addEvent(window, 'resize', () => {
                const element = document.getElementById('options-wrapper')
                if (element) { element.classList.remove('active') }
            })
        }
    }
</script>
