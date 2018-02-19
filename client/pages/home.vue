<template lang="pug">
    main#home.dark.no-scroll.flex.flex-center
        loading(v-if="loading" color="#b29adb")

        #playlists.container.scroll-animate-router.fadeInHalfScale
            .section.text-center.text-white.padding-0
                .row.margin-0
                    h1.text-size-5.margin-0 Ubeat 
                        em.text-normal Radio
                    h2.text-size-1.margin-10 How do you feel?
            .section.padding-0
                .row.text-center.no-select
                    radio-playlist(v-for="station in stations" :color="station.color" :genre="station.genre" :key="station.genre")

</template>

<script>
    import RadioPlaylist from '@/components/radio-playlist'
    import Loading from '@/components/loading'

    export default {
        components: {
            'radio-playlist': RadioPlaylist,
            'loading': Loading
        },
        data: () => ({
            stations: [
                { genre: 'pop', color: '#f06292' },
                { genre: 'classical', color: '#4caf50' },
                { genre: 'dance', color: '#5c6bc0' },
                { genre: 'rock', color: '#ffb74d' },
                { genre: 'metal', color: '#f44336' },
                { genre: 'rap', color: '#ba68c8' }
            ],
            loading: null
        }),
        mounted () {
            this.loading = false
        },
        beforeRouteLeave (to, from, next) {
            this.loading = true
            return next()
        }
    }
</script>

<style lang="scss">
    #home { padding-top: 30px; margin-bottom: 150px; }
    #playlists { max-width: 775px; }
</style>
