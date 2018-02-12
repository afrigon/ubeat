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
    export default {
        watch: {
            '$route': 'init'
        },
        mounted () {
            window.addEventListener('beforeunload', () => {
                window.sessionStorage.removeItem('unload-timestamp', Date.now())
            })

            window.addEventListener('load', () => {
                this.init()
            })
        },
        methods: {
            init () {
                let station = this.$route.query.station
                if (!station) return

                const element = document.getElementById(station)
                element && (station = {
                    genre: station,
                    color: element.getAttribute('data-color') || '#FFFFFF'
                })

                if (this.player && this.player.genre === station) return
                this.startStation(station)
                this.setLiveIcon()
            },
            startStation (station) {
                if (this.player && this.player.genre === station.genre) return
                this.player = new AudioPlayer({
                    visual: true,
                    visualColor: station.color,
                    autoplay: true,
                    barHeight: 30,
                    fetchCallback: (audioPlayer, callback) => {
                        return Util.request(`/radio/${station.genre}`, 'get', null, (err, data) => {
                            if (err) return callback(err)
                            audioPlayer.options.startTime = data.time
                            audioPlayer.setMeta(data.meta)
                            return callback(null, data.url)
                        })
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
                    clipEndCallback: (audioPlayer) => {
                        return Util.request(`/radio/${station.genre}`, 'get', null, (err, data) => {
                            if (err) return console.log(err)
                            audioPlayer.audio.src = data.url
                            return audioPlayer.setMeta(data.meta)
                        })
                    }
                })
                this.player.genre = station.genre
                FS.addComponent(this.player, '#player')
            },
            stopStation () {
                this.player = undefined
                let radio = document.getElementById('radio')
                if (!radio) return

                radio.style.backgroundColor = 'transparent'
                radio.style.transform = 'translateY(100%)'
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
        z-index: 1000;
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
        .meta {
            width: 40%;
        }
    }

    @media only screen and (max-width : 800px) {
        #player {
            .timeline, .meta {
                width: 100%;
            }
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>
