<template lang="pug">
    main.dark.no-scroll
        error(:message="error" v-if="error")
        loading(v-if="loading" color="#b29adb")

        .section
            .row
                .column.s12(v-if="album")
                    .column.s12.l5.text-center.scroll-animate-router.fadeInRight
                        .column.s12.m6.l12.padding-0.relative
                            img#albumArt.hoverable-pop.no-select(v-bind:alt="`${album.collectionName} Album Art`" v-bind:src="album.artworkUrl400")
                            .row(v-if="album.releaseDate")
                                p#releaseDate.text-grey.text-center.text-size-small-5.margin-0 Released: {{ new Date(album.releaseDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                        .column.s12.m6.l12.padding-0.scroll-animate-router.fadeInRight(v-if="album.collectionViewUrl")
                            .row
                                a.itunes-button(target="_blank" rel="noopener" v-bind:href="album.collectionViewUrl")
                    .column.s12.l7.padding-0
                        .scroll-animate-router.fadeInLeft
                            h2#collectionName.text-light-color.text-size-5.margin-down-0.scroll-animate-router.fadeInLeft(v-if="album.collectionName") {{ album.collectionName }}
                            .row.margin-0
                                .column.s12.l6.padding-0(v-if="album.artistName")
                                    router-link.no-hover-decoration(:to="{ path: `/artist/${album.artistId}`, query: $route.query }")
                                        h3.text-primary-light.text-size-3.text-thin.margin-left-20.margin-0
                                            span.text-size-2 by 
                                            span#artistName {{ album.artistName }}
                                .column.s12.l6.padding-0
                                    h5.text-grey.text-size-1.text-thin.margin-0.padding-5.margin-left-15
                                        span#primaryGenreName {{ album.primaryGenreName || 'whatever' }}
                                        |  • 
                                        span#releaseDateYear {{ new Date(album.releaseDate).getFullYear() || '' }}
                        .section.padding-left-0.padding-right-0.scroll-animate-router.fadeIn(v-if="tracks")
                            .row
                                table.interactive.text-light-color
                                    thead
                                        tr.uppercase.text-grey.text-darken-3.text-size-small-9
                                            th
                                            th name
                                            th time
                                            th
                                    tbody#tracks.clickable
                                        tr(v-for="(track, i) in tracks" :key="track.trackId" v-on:click="play(track.trackId, { title: track.trackName, artist: album.artistName, pictureUrl: album.artworkUrl30 }, track.previewUrl)" v-bind:class="playingId === track.trackId ? 'active': ''")
                                            td.text-center {{ i + 1 }}
                                            td {{ track.trackName }}
                                            td {{ track.duration }}
                                            td(v-bind:class="playingId === track.trackId ? 'playing': ''")
                                                i.material-icons.no-select {{ playingId === track.trackId ? 'pause_circle_outline': 'play_circle_outline' }}
                            .row.margin-0.margin-left-20
                                p.text-grey.text-size-small-5.margin-0 {{ tracks.length }} songs, {{ tracks.totalDuration }} minutes
                            .row.margin-0.margin-left-20(v-if="album.copyright")
                                p.text-grey.text-size-small-5 {{ album.copyright }}
</template>

<script type="text/javascript">
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'

    function fetchData (to, callback) {
        let data = {}
        Util.requestJSON(`/api/albums/${to.params.id}`, {
            headers: { Authorization: window.localStorage.getItem('access_token') }
        }, (err, response) => {
            if (err || !response.results || response.results.length <= 0) return callback(new Error('An error occured while searching for this album'))

            data.album = response.results[0]
            data.album.artworkUrl30 = data.album.artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$230x30$4')
            data.album.artworkUrl400 = data.album.artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2400x400$4')
            data.album.collectionViewUrl = `${data.album.collectionViewUrl}&app=itunes`

            Util.requestJSON(`/api/albums/${to.params.id}/tracks`, {
                headers: { Authorization: window.localStorage.getItem('access_token') }
            }, (err, response) => {
                if (err || !response.results || response.results.length <= 0) return callback(new Error('An error occured while searching for this album'))

                data.tracks = response.results
                data.tracks.totalDuration = 0
                for (let i = 0; i < data.tracks.length; ++i) {
                    data.tracks[i].duration = Util.secondsToTime(data.tracks[i].trackTimeMillis / 1000)
                    data.tracks.totalDuration += data.tracks[i].trackTimeMillis / 1000
                }
                data.tracks.totalDuration = Math.ceil(data.tracks.totalDuration / 60)
                return callback(null, data)
            })
        })
    }

    export default {
        components: {
            'error': ErrorBox,
            'loading': Loading
        },
        data: () => ({
            album: null,
            tracks: null,
            error: null,
            playingId: null,
            loading: null
        }),
        watch: {
            '$route': 'setPlayingSong'
        },
        beforeDestroy () { this.playingId = null },
        beforeRouteEnter (to, from, next) {
            return fetchData(to, (err, data) => {
                return next(vm => vm.setData(err, data))
            })
        },
        beforeRouteUpdate (to, from, next) {
            return fetchData(to, (err, data) => {
                this.setData(err, data)
                return next()
            })
        },
        beforeRouteLeave (to, from, next) {
            this.loading = true
            return next()
        },
        methods: {
            setData (err, data) {
                this.loading = false
                if (err) {
                    this.album = this.tracks = null
                    return (this.error = err.message)
                }

                this.error = null
                this.album = data.album
                this.tracks = data.tracks
            },
            play (id, meta, url) {
                if (this.playingId === id) {
                    this.playingId = null
                    window.sessionStorage.removeItem('song-url')
                } else {
                    this.playingId = id
                    window.sessionStorage.setItem('song-url', JSON.stringify({ id: id, meta: meta, url: url }))
                }

                this.$router.replace({
                    path: this.$route.path,
                    query: Object.assign({}, this.$route.query, { refreshId: Math.random().toString(36).substr(2) })
                })
            },
            setPlayingSong () {
                const songData = window.sessionStorage.getItem('song-url')
                let song = {}
                if (songData) {
                    try { song = JSON.parse(songData) } catch (e) {}
                }
                this.playingId = song.id || null
            }
        }
    }
</script>

<style>
    td:not(.playing) i {
        visibility: hidden;
    }

    tr:hover td i {
        visibility: visible;
    }

    .itunes-button {
        display: inline-block;
        overflow: hidden;
        background: url(https://linkmaker.itunes.apple.com/assets/shared/badges/en-us/itunes-lrg.svg) no-repeat;
        width: 110px;
        height :40px;
        background-size: contain
    }

    #albumArt {
        width: 50%;
        height: auto;
        border: 1px solid #5b5b5b;
        border-radius: 5px;
    }

    @media only screen and (max-width : 992px) {
        #albumArt {
            width: 75%;
        }   
    }
</style>
