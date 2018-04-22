<template lang="pug">
    .dark.no-scroll.flex.flex-spaced.flex-vertical.scroll-invisible
        error(:message="error" v-if="error")
        loading(v-if="loading" color="#b29adb")

        .absolute.close-icon(@click="closeModal")
            i.material-icons.text-white.l.clickable close
        .container.margin-up-30(:class="{'full-width': modal}")
            h1.text-white.text-size-3.text-light.text-center Add to a playlist
            .section
                .row.text-center
                    playlist-card.item.playlist.clickable(v-for="playlist in playlists" :key="playlist.id" :name="playlist.name" :tracks="playlist.tracks" @click.native.stop="() => selectPlaylist(playlist.id)")
</template>

<script>
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'
    import PlaylistCard from '@/components/playlist-card'

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
            'playlist-card': PlaylistCard
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
                        } else {
                            FScript.addComponent(new Banner({
                                title: 'Playlist Info',
                                message: 'One or more songs were already in the playlist',
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
