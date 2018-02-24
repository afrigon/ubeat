<template lang="pug">
    main.dark.no-scroll
        error(:message="error" v-if="error")
        loading(v-if="loading" color="#b29adb")

        .section
            .row
                .column.s12(v-if="album")
                    .column.s12.l5.text-center.scroll-animate-router.fadeInRight
                        .column.s12.m6.l12.padding-0.relative
                            img#albumArt.hoverable-pop.no-select(:alt="`${album.collectionName} Album Art`" :src="album.artworkUrl400")
                            .row(v-if="album.releaseDate")
                                p#releaseDate.text-grey.text-center.text-size-small-5.margin-0 Released: {{ new Date(album.releaseDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                        .column.s12.m6.l12.padding-0.scroll-animate-router.fadeInRight(v-if="album.collectionViewUrl")
                            .row
                                a.itunes-button(target="_blank" rel="noopener" :href="album.collectionViewUrl")
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
                                        tr(v-for="(track, i) in tracks.list" :key="track.trackId" @click="play(track.trackId, { title: track.trackName, artist: album.artistName, pictureUrl: album.artworkUrl30 }, track.previewUrl)" :class="playingId === track.trackId ? 'active': ''")
                                            td.text-center {{ i + 1 }}
                                            td {{ track.trackName }}
                                            td {{ track.duration }}
                                            td(:class="playingId === track.trackId ? 'playing': ''")
                                                i.material-icons.no-select {{ playingId === track.trackId ? 'pause_circle_outline': 'play_circle_outline' }}
                            .row.margin-0.margin-left-20
                                p.text-grey.text-size-small-5.margin-0 {{ tracks.length }} songs, {{ tracks.totalDuration }} minutes
                            .row.margin-0.margin-left-20(v-if="album.copyright")
                                p.text-grey.text-size-small-5 {{ album.copyright }}
</template>

<script type="text/javascript">
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'

    import { AlbumApi } from '@/api'

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
            try {
                return next(async vm => vm.setData(await AlbumApi.getFullAlbum(to.params.id)))
            } catch (err) { return next(vm => vm.setData(null)) }
        },
        async beforeRouteUpdate (to, from, next) {
            try {
                return this.setData(await AlbumApi.getFullAlbum(to.params.id)) & next()
            } catch (err) { return this.setData(null) & next() }
        },
        beforeRouteLeave (to, from, next) {
            this.loading = true
            return next()
        },
        methods: {
            setData (data) {
                this.loading = false
                if (!data) {
                    this.album = this.tracks = null
                    return (this.error = 'An error occured while searching for this album.')
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

<style lang="scss" scoped>
    @media only screen and (max-width : 992px) { #albumArt { width: 75%; } }
    td:not(.playing) i { visibility: hidden; }
    tr:hover td i { visibility: visible; }
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
        border-radius: 5px;
    }
</style>
