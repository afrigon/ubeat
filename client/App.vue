<template lang="pug">
    div#app.body
        header-bar(v-if="!public")
        router-view
        radio(v-if="!public")
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
            public: null
        }),
        created () {
            this.public = this.$route.meta.public
        },
        watch: {
            $route () {
                this.public = this.$route.meta.public
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
</style>
