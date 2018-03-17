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
    import { FScript, AudioPlayer } from '@/script/fscript'
    import { STOP_AUDIO_PLAYER, RESTORE_RADIO } from '@/store/mutation-types'
    import { mapMutations } from 'vuex'

    export default {
        mounted () {
            this.$store.watch(() => this.$store.state.persistent.audioPlayer.trackId, (trackId, oldTrackId) => {
                if (trackId !== oldTrackId) this.stopStation()
                this.init()
            })
            window.addEventListener('load', () => {
                this.stopStation()
                this.init()
            })
        },
        methods: {
            ...mapMutations({
                stopPlayer: STOP_AUDIO_PLAYER,
                restoreRadio: RESTORE_RADIO
            }),
            init () {
                return setTimeout(() => {
                    if (!this.$store.state.persistent.audioPlayer.trackId) return
                    if (this.$store.state.persistent.audioPlayer.isRadio) {
                        return this.startStation({
                            genre: this.$store.state.persistent.audioPlayer.trackId,
                            color: this.$store.state.persistent.audioPlayer.meta.color
                        })
                    }
                    return this.startSong({
                        url: this.$store.state.persistent.audioPlayer.meta.url,
                        meta: this.$store.state.persistent.audioPlayer.meta
                    })
                }, 250)
            },
            startStation (station) {
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
                        this.stopPlayer()
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
                FScript.addComponent(this.player, '#player')
            },
            stopStation () {
                let radio = document.getElementById('radio')
                if (!radio) return

                radio.style.backgroundColor = 'transparent'
                radio.style.transform = 'translateY(100%)'
                setTimeout(() => {
                    if (this.player) this.player.deinit()
                    this.player = null
                }, 250)
            },
            startSong (song) {
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
                        this.restoreRadio()
                    },
                    clipEndCallback: () => {
                        this.restoreRadio()
                    }
                })
                FScript.addComponent(this.player, '#player')
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
