<template>
    <div id="radio">
        <div class="container">
            <div class="section padding-up-5">
                <div id="player"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import { RadioApi } from '@/api'

    export default {
        watch: {
            '$route': 'init'
        },
        mounted () {
            window.addEventListener('beforeunload', () => {
                window.sessionStorage.removeItem('song-url')
            })

            window.addEventListener('load', () => {
                this.init()
            })
        },
        methods: {
            init () {
                const songData = window.sessionStorage.getItem('song-url')
                if (songData) {
                    let song
                    try { song = JSON.parse(songData) } catch (e) {}
                    if (song) {
                        if (!this.song || song.id !== this.song.id) return this.startSong(song)
                    }
                    if (this.song) return
                }

                const stations = [
                    { genre: 'pop', color: '#f06292' },
                    { genre: 'classical', color: '#4caf50' },
                    { genre: 'dance', color: '#5c6bc0' },
                    { genre: 'rock', color: '#ffb74d' },
                    { genre: 'metal', color: '#f44336' },
                    { genre: 'rap', color: '#ba68c8' }
                ]

                let station = this.$route.query.station
                station = stations.filter(n => n.genre === station)[0]

                if (!station) return this.stopStation() // this was commented but song won't stop if it ain't stack on top of radio (needs vuex love)
                this.startStation(station)
                this.setLiveIcon()
            },
            startStation (station) {
                this.song = null
                if (this.player && this.player.genre === station.genre) return
                this.player = new AudioPlayer({
                    visual: true,
                    visualColor: station.color,
                    autoplay: true,
                    barHeight: 30,
                    fetchCallback: async (audioPlayer, callback) => {
                        try {
                            const radioData = await RadioApi.fetchRadio(station.genre)
                            audioPlayer.options.startTime = radioData.time
                            audioPlayer.setMeta(radioData.meta)
                            return callback(null, radioData.url)
                        } catch (err) { return callback(err) }
                    },
                    createdCallback: (audioPlayer) => {
                        const radio = document.getElementById('radio')
                        radio.style.backgroundColor = '#353535'
                        radio.style.transform = 'translateY(0)'
                    },
                    stopCallback: (audioPlayer) => {
                        this.stopStation()
                        this.$router.replace({ path: this.$route.path })
                    },
                    clipEndCallback: async (audioPlayer) => {
                        try {
                            const radioData = await RadioApi.fetchRadio(station.genre)
                            audioPlayer.audio.src = radioData.url
                            return audioPlayer.setMeta(radioData.meta)
                        } catch (err) { return console.log(err) }
                    }
                })
                this.player.genre = station.genre
                FS.addComponent(this.player, '#player')
            },
            stopStation () {
                this.song = null
                this.player = null
                let radio = document.getElementById('radio')
                if (!radio) return

                radio.style.backgroundColor = 'transparent'
                radio.style.transform = 'translateY(100%)'
                this.setLiveIcon()
                setTimeout(() => {
                    const player = document.getElementById('player')
                    if (!player) return
                    while (player.firstChild) player.removeChild(player.firstChild)
                }, 250)
            },
            setLiveIcon () {
                let genre = false
                if (this.player) genre = this.player.genre
                document.querySelectorAll('.playlist').forEach(playlist => {
                    playlist.id === genre
                        ? playlist.classList.add('playing')
                        : playlist.classList.remove('playing')
                })
            },
            startSong (song) {
                this.song = song
                this.player = new AudioPlayer(song.url, {
                    visual: true,
                    visualColor: '#999999',
                    autoplay: true,
                    barHeight: 30,
                    meta: song.meta,
                    createdCallback: () => {
                        const radio = document.getElementById('radio')
                        radio.style.backgroundColor = '#353535'
                        radio.style.transform = 'translateY(0)'
                    },
                    stopCallback: () => {
                        this.song = null
                        window.sessionStorage.removeItem('song-url')
                        const query = Object.assign({}, this.$route.query, { refreshId: Math.random().toString(36).substr(2) })
                        // uncomment to stop station at the same time
                        // query.station = null
                        this.$router.replace({
                            path: this.$route.path,
                            query: query
                        })
                    },
                    clipEndCallback: () => {
                        this.song = null
                        window.sessionStorage.removeItem('song-url')
                        this.$router.replace({
                            path: this.$route.path,
                            query: Object.assign({}, this.$route.query, { refreshId: Math.random().toString(36).substr(2) })
                        })
                    }
                })
                FS.addComponent(this.player, '#player')
            }
        }
    }
</script>

<style lang="scss">
    #radio {
        border-top: #454545 solid 1px;
        position: fixed;
        width: 100%;
        bottom: 0px;
        z-index: 3000;
        transform: translateY(100%);
        will-change: transform;
        transition: transform 200ms ease-out;
        @media only screen and (max-width : 600px) {
            .container {
                width: 100%;
            }
        }
    }

    #player {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        .timeline {
            width: 60%;
        }
        .audio-player-meta {
            width: 40%;
        }
    }

    @media only screen and (max-width : 800px) {
        #player {
            .timeline, .audio-player-meta {
                width: 100%;
            }
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
