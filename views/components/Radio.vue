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
        mounted () {
            window.addEventListener('beforeunload', () => {
                window.sessionStorage.setItem('unload-timestamp', Date.now())
            })

            window.addEventListener('load', () => {
                let station = window.sessionStorage.getItem('radio-station')

                try {
                    station = JSON.parse(station)
                } catch (e) {
                    return
                }

                if (station && station.genre) {
                    const unloadTimestamp = window.sessionStorage.getItem('unload-timestamp')

                    // if reloading took more than 3s
                    if (unloadTimestamp < Date.now() - 3000) return

                    // eslint-disable-next-line no-undef
                    const player = new AudioPlayer({
                        visual: true,
                        visualColor: station.color,
                        autoplay: true,
                        barHeight: 30,
                        fetchCallback: (audioPlayer, callback) => {
                            return Util.request(`/radio/${station.genre}`, 'get', null, (err, data) => { // eslint-disable-line no-undef
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
                            window.sessionStorage.removeItem('radio-station')
                            let radio = document.getElementById('radio')
                            radio.style.backgroundColor = 'transparent'
                            radio.style.transform = 'translateY(100%)'
                            const playlist = document.getElementById(station.genre)
                            playlist && playlist.classList.remove('playing')
                            setTimeout(() => {
                                while (audioPlayer.el.firstChild) audioPlayer.el.removeChild(audioPlayer.el.firstChild)
                            }, 250)
                        },
                        clipEndCallback: (audioPlayer) => {
                            return Util.request(`/radio/${station.genre}`, 'get', null, (err, data) => { // eslint-disable-line no-undef
                                if (err) return console.log(err)
                                audioPlayer.audio.src = data.url
                                return audioPlayer.setMeta(data.meta)
                            })
                        }
                    })
                    FS.addComponent(player, '#player') // eslint-disable-line no-undef
                }
            })
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
