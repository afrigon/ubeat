<template lang="pug">
    main.dark.no-scroll.flex.flex-center
        #playlists.container.scroll-animate-router.fadeInHalfScale
            .section
                .row.text-center.no-select
                    radio-playlist(genre="pop", color="#f06292")
                    radio-playlist(genre="classical", color="#4caf50")
                    radio-playlist(genre="dance", color="#5c6bc0")
                    radio-playlist(genre="rock", color="#ffb74d")
                    radio-playlist(genre="metal", color="#f44336")
                    radio-playlist(genre="rap", color="#ba68c8")
</template>

<script>
    import RadioPlaylist from '@/components/radio-playlist'

    export default {
        components: {
            'radio-playlist': RadioPlaylist
        },
        mounted () {
            this.load()
        },
        methods: {
            hideLiveIcons () {
                document.querySelectorAll('.playlist').forEach((playlist) => {
                    playlist.classList.remove('playing')
                })
            },
            showLiveIcon (element) {
                this.hideLiveIcons()
                element.classList.add('playing')
            },
            load () {
                FS.addComponent(new AutoScrollAnimator({ selector: 'scroll-animate-router' }))

                window.addEventListener('load', () => {
                    // set the live icon if radio is playing (watch out for that catch)
                    let station = window.sessionStorage.getItem('radio-station')
                    try { station = JSON.parse(station) } catch (e) { return }
                    if (station && station.genre) return this.showLiveIcon(document.getElementById(station.genre))
                })
            }
        }
    }
</script>

<style lang="scss">
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
