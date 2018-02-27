<template lang="pug">
    main.dark.no-scroll.flex.flex-spaced.flex-vertical.scroll-invisible
        error(:message="error" v-if="error")
        loading(v-if="loading" color="#b29adb")

        .absolute.close-icon(v-if="modal" @click="closeModal")
            i.material-icons.text-white.l.clickable close
        .container.margin-up-30(:class="{'full-width': modal}")
            .section
                .row.text-center(v-if="!modal")
                    router-link.no-hover-decoration.playlist(v-for="playlist in playlists" :to="{ path: `/playlist/${playlist.id}`, query: $route.query }" :key="playlist.id")
                        playlist.item.playlist(:name="playlist.name" :tracks="playlist.tracks")
                    .item.item-add.text-center.clickable(@click="createPlaylist" v-if="!modal")
                        p.text-white.margin-0.text-size-2
                            i.material-icons add
                            span.icon-text Add
                .row.text-center(v-else)
                    playlist.item.playlist.clickable(v-for="playlist in playlists" :key="playlist.id" :name="playlist.name" :tracks="playlist.tracks" @click.native="() => selectPlaylist(playlist.id)")
</template>

<script>
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'
    import Playlist from '@/components/playlist'

    import { PlaylistApi } from '@/api'
    import { FScript, Banner } from '@/script/fscript'
    import { PREPARE_SONG_FOR_INSERT } from '@/store/mutation-types'

    export default {
        props: {
            modal: Boolean
        },
        components: {
            'error': ErrorBox,
            'loading': Loading,
            'playlist': Playlist
        },
        data: () => ({
            error: null,
            loading: null,
            playlists: []
        }),
        beforeRouteEnter (to, from, next) {
            try {
                return next(async vm => vm.setData(await PlaylistApi.getPersonalPlaylists()))
            } catch (err) { return next(vm => vm.setData(null)) }
        },
        async beforeRouteUpdate (to, from, next) {
            try {
                return this.setData(await PlaylistApi.getPersonalPlaylists()) & next()
            } catch (err) { return this.setData(null) & next() }
        },
        beforeRouteLeave (to, from, next) {
            this.loading = true
            return next()
        },
        async created () {
            if (!this.modal) return
            try {
                return this.setData(await PlaylistApi.getPersonalPlaylists())
            } catch (err) { return this.setData(null) }
        },
        methods: {
            setData (data) {
                this.loading = false
                if (!data) {
                    this.playlists = []
                    return (this.error = 'An error occured while searching for your playlists.')
                }

                this.error = null
                this.playlists = data
            },
            async createPlaylist () {
                try {
                    const playlist = await PlaylistApi.createPlaylist('Empty Playlist')
                    return this.playlists.push(playlist)
                } catch (err) {
                    FScript.addComponent(new Banner({
                        title: 'Error',
                        message: 'An error occured while creating your playlist'
                    }))
                }
            },
            async selectPlaylist (id) {
                this.loading = true
                const songs = this.$store.state.temp.songs
                for (let song of songs) {
                    try {
                        await PlaylistApi.addTrackToPlaylist(id, song)
                    } catch (err) {
                        if (songs.length === 1) {
                            FScript.addComponent(new Banner({
                                title: 'Playlist Info',
                                message: 'This song is already in the playlist',
                                type: 'info'
                            }))
                        }
                    }
                }
                this.$store.commit(PREPARE_SONG_FOR_INSERT, null)
                this.loading = false
            },
            closeModal () {
                this.$store.commit(PREPARE_SONG_FOR_INSERT, null)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .item {
        vertical-align: top;
        display: inline-block;
        margin: 15px;
        width: 150px;
        height: 150px;
        margin-bottom: 48px;
    }

    .item-add {
        border-radius: 5px;
        border: #696969 1px dashed;
        p, p i, p span {
            line-height: 150px;
            vertical-align: top;
        }
    }

    .full-width {
        width: 100%;
        max-width: 100%;
    }

    .close-icon {
        top: 0px; right: 15px;
    }
</style>

