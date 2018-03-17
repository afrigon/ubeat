<template lang="pug">
    main.dark.no-scroll.flex.flex-spaced.flex-vertical
        error(:message="error" v-if="error")
        loading(v-if="loading" color="#b29adb")
        
        .container.margin-up-30(v-if="playlist")
            .section
                .absolute.action.action-left
                    button.text-button.transparent.text-primary-light(v-if="!isEditing" @click="back") Return
                    button.text-button.transparent.text-primary-light(v-else @click="cancel") Cancel
                .absolute.action.action-right
                    button.text-button.transparent.text-primary-light(v-if="!isEditing" @click="edit") Edit
                    button.full-button.text-white(v-else @click="save") Done
                .row
                    .column.s12.l3
                        playlist-card.head(:tracks="playlist.tracks" :editing="isEditing" :validatedOnce="validatedOnce")
                        div.text-center.margin-up-20(v-if="isEditing")
                            i.material-icons.circle.red.text-white.lighten-1.delete-all.clickable(@click="deleteAll") delete_forever
                    .column.s12.l9
                        table.interactive.text-light-color(v-if="playlist.tracks && playlist.tracks.length > 0")
                            thead
                                tr.uppercase.text-grey.text-darken-3.text-size-small-9
                                    th.hide-until-m
                                    th name
                                    th time
                                    th
                            tbody#tracks.clickable
                                tr(v-for="track in playlist.tracks" :key="track.trackId" @click="play(track.trackId, { title: track.trackName, artist: track.artistName, pictureUrl: track.artworkUrl30 }, track.previewUrl)" :class="playingId === track.trackId ? 'active': ''")
                                    td.artwork.hide-until-m
                                        img(:src="track.artworkUrl30")
                                    td {{ track.trackName }}
                                    td {{ track.duration }}
                                    td(:class="{ active: isEditing, 'text-red text-lighten-1': isEditing }")
                                        i.material-icons.no-select(@click="() => { if (isEditing) deleteTrack(track.trackId) }") {{ isEditing ? 'remove_circle_outline' : playingId === track.trackId ? 'pause_circle_outline': 'play_circle_outline' }}
                        .text-center(v-else)
                            p.text-grey.text-size-2 This playlist is empty, you should look for sick beats to add to it!
</template>

<script>
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'
    import PlaylistCard from '@/components/playlist-card'

    import { PlaylistApi } from '@/api'
    import { FScript, Banner } from '@/script/fscript'
    import { SET_PLAYLIST_NAME } from '@/store/mutation-types'

    export default {
        components: {
            'error': ErrorBox,
            'loading': Loading,
            'playlist-card': PlaylistCard
        },
        data: () => ({
            error: null,
            loading: null,
            playlist: null,
            isEditing: null,
            initialPlaylistName: null,
            validatedOnce: null
        }),
        computed: {
            name: {
                get () {
                    return this.$store.state.temp.playlistName
                },
                set (value) {
                    this.$store.commit(SET_PLAYLIST_NAME, value)
                }
            }
        },
        watch: {
            '$route': 'setPlayingSong'
        },
        async beforeRouteEnter (to, from, next) {
            try {
                return next(async vm => vm.setData(await PlaylistApi.getPlaylist(to.params.id)))
            } catch (err) { return next(vm => vm.setData(null)) }
        },
        async beforeRouteUpdate (to, from, next) {
            try {
                return this.setData(await PlaylistApi.getPlaylist(to.params.id)) & next()
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
                    this.playlist = null
                    return (this.error = 'An error occured while searching for this playlist.')
                }

                this.error = null
                this.playlist = data
                this.name = data.name
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
            },
            async save () {
                if (!this.validate()) return
                this.error = null
                this.loading = true
                try {
                    await PlaylistApi.updatePlaylist(this.playlist.id, {
                        name: this.name,
                        tracks: this.playlist.tracks
                    })
                } catch (err) {
                    FScript.addComponent(new Banner({
                        title: 'Error',
                        message: 'An error occured while saving your changes'
                    }))
                }
                this.loading = false
                this.isEditing = false
            },
            validate () {
                if (!this.name) {
                    this.validatedOnce = true
                    return false
                }

                return true
            },
            edit () {
                this.initialPlaylistName = this.name
                this.isEditing = true
            },
            cancel () {
                this.name = this.initialPlaylistName
                this.isEditing = false
                this.validatedOnce = false
            },
            back () {
                this.$router.replace({ path: `/playlists`, query: this.$route.query })
            },
            async deleteTrack (id) {
                this.loading = true
                try {
                    await PlaylistApi.removeTrackFromPlaylist(this.playlist.id, id)
                    this.playlist.tracks = this.playlist.tracks.filter(n => n.trackId !== id)
                } catch (err) {
                    FScript.addComponent(new Banner({
                        title: 'Error',
                        message: 'An error occured while deleting this track'
                    }))
                }
                this.loading = false
            },
            async deleteAll () {
                try {
                    await PlaylistApi.removePlaylist(this.playlist.id)
                    this.$router.replace({ path: `/playlists`, query: this.$route.query })
                } catch (err) {
                    FScript.addComponent(new Banner({
                        title: 'Error',
                        message: 'An error occured while deleting this playlist'
                    }))
                }
            }
        },
        watch: {
            isEditing: () => {
                if (!this.isEditing) this.validatedOnce = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .artwork { width: 70px; }
    td:not(.active) i { visibility: hidden; }
    tr:hover td i { visibility: visible; }
    .head { text-align: center; margin: auto; max-width: 250px;}
    .action {
        top: 90px;
        button {
            padding: 5px 0;
            text-align: center;
            width: 75px;
            font-weight: 200;
            font-size: 1.32rem;
        }
        .text-button { text-shadow: 0px 0px 8px #555555 }
        .full-button {
            border-radius: 13px;
            background-color: #484156;
            padding: 0;
            line-height: 31px;
        }
    }
    .action-right { right: 32px; }
    .action-left { left: 32px; }
    td.text-red i {
        transition: transform 150ms ease-out;
        &:hover { transform: scale(1.1) }
    }
    .delete-all { width: 36px; height: 36px; }
</style>
