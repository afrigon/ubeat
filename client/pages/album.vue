<template lang="pug">
    div
        error(:message="error" v-if="error")

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

    export default {
        components: {
            'error': ErrorBox
        },
        data: () => ({
            album: null,
            tracks: null,
            error: null,
            playingId: null
        }),
        created () { this.fetchData() },
        mounted () { this.load() },
        beforeDestroy () { this.playingId = null },
        watch: {
            '$route': 'fetchData'
        },
        methods: {
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
            load () {
                this.setPlaying()
            },
            setPlaying () {
                const songData = window.sessionStorage.getItem('song-url')
                let song
                if (songData) {
                    try { song = JSON.parse(songData) } catch (e) {}
                }
                this.playingId = song && song.id ? song.id : null
            },
            fetchData (to, from) {
                if (to && from && to.params.id === from.params.id) return this.setPlaying()
                this.error = null
                Util.request(`/api/albums/${this.$route.params.id}`, 'GET', null, (err, response) => {
                    if (err || !response.results || response.results.length <= 0) return ((this.error = 'An error occured while getting this album') & (this.album = null) & (this.tracks = null))
                    this.album = response.results[0]
                    this.album.artworkUrl30 = this.album.artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$230x30$4')
                    this.album.artworkUrl400 = this.album.artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2400x400$4')
                    this.album.collectionViewUrl = `${this.album.collectionViewUrl}&app=itunes`

                    Util.request(`/api/albums/${this.$route.params.id}/tracks`, 'GET', null, (err, response) => {
                        if (err || !response.results || response.results.length <= 0) return (this.error = 'An error occured while getting this album')
                        this.tracks = response.results
                        this.tracks.totalDuration = 0
                        for (let i = 0; i < this.tracks.length; ++i) {
                            this.tracks[i].duration = Util.secondsToTime(this.tracks[i].trackTimeMillis / 1000)
                            this.tracks.totalDuration += this.tracks[i].trackTimeMillis / 1000
                        }
                        this.tracks.totalDuration = Math.ceil(this.tracks.totalDuration / 60)
                    })
                })
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
