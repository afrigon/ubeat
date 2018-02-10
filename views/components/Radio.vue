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
            const stations = [
                { genre: 'pop', color: '#f06292' },
                { genre: 'classical', color: '#4caf50' },
                { genre: 'dance', color: '#5c6bc0' },
                { genre: 'rock', color: '#ffb74d' },
                { genre: 'metal', color: '#f44336' },
                { genre: 'rap', color: '#ba68c8' }
            ]

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
                    // if reloading took more than 3s quit
                    const unloadTimestamp = window.sessionStorage.getItem('unload-timestamp')
                    if (unloadTimestamp < Date.now() - 3000) return
                    !FS.hasComponentOfType(AudioPlayer.name) && this.startStation(station) // eslint-disable-line no-undef
                }
            })

            // starts radio for query param ?station={station}
            let station = Util.getQueryParam('station') // eslint-disable-line no-undef
            station = stations.filter(n => n.genre === station)[0]
            if (station) {
                this.startStation(station)
                return window.history.pushState(null, null, window.location.href.replace(/\?.*/, ''))
            }
        },
        methods: {
            startStation (station) {
                FS.addComponent(new AudioPlayer({ // eslint-disable-line no-undef
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
                        window.sessionStorage.setItem('radio-station', JSON.stringify(station))
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
                }), '#player')
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
