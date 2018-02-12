<template lang="pug">
    div.flex.flex-center
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

    export default {
        components: {
            'radio-playlist': RadioPlaylist
        },
        data: () => ({
            stations: [
                { genre: 'pop', color: '#f06292' },
                { genre: 'classical', color: '#4caf50' },
                { genre: 'dance', color: '#5c6bc0' },
                { genre: 'rock', color: '#ffb74d' },
                { genre: 'metal', color: '#f44336' },
                { genre: 'rap', color: '#ba68c8' }
            ]
        }),
        mounted () {
            FS.addComponent(new AutoScrollAnimator({ selector: 'scroll-animate-router' }))
        }
    }
</script>

<style lang="scss">
    div.flex.flex-center {
        height: calc(100vh - 70px);
    }

    #playlists {
        margin-top: -100px;
        max-width: 775px;
    }    

    @media only screen and (max-width : 450px) {
        #playlists {
            margin-top: 0;
        }
    }
</style>
