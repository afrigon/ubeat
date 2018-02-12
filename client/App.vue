<template lang="pug">
    div#app.body
        header-bar
        main.dark.no-scroll
            router-view
        radio
</template>

<script>
    import HeaderBar from '@/components/header-bar'
    import Radio from '@/components/radio'
    
    export default {
        name: 'app',
        components: {
            'header-bar': HeaderBar,
            'radio': Radio
        },
        data: () => ({
            transitionName: 'slide-right'
        }),
        watch: {
            $route: (to, from) => {
                console.log('test')
                console.log(to)
                if (from.name === 'Home') return (this.transitionName = 'slide-right')
                if (from.name === 'Album') return (this.transitionName = 'slide-left')
                if (to.name === 'Home') return (this.transitionName = 'slide-left')
                if (to.name === 'Album') return (this.transitionName = 'slide-right')
            }
        },
        mounted () {
            Util.addEvent(window, 'resize', () => {
                const element = document.getElementById('options-wrapper')
                return element && element.classList.remove('active')
            })
            Util.addEvent(document.getElementById('app'), 'click', () => {
                const element = document.getElementById('options-wrapper')
                return element && element.classList.remove('active')
            })
            setFilter(null, window.sessionStorage.getItem('search-flags') || 7) // eslint-disable-line no-undef
        }
    }
</script>

<style>
    .body { overflow-x: hidden; }
    .slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active {
        transition: transform 300ms ease-out;
        will-change: transform;
    }
    .slide-right-enter { transform: translateX(100%); }
    .slide-right-leave-to { transform: translateX(-100%); }
    .slide-left-enter { transform: translateX(-100%); }
    .slide-left-leave-to { transform: translateX(100%); }
</style>
