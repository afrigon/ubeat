<template lang="pug">
    main.dark.no-scroll
        error(:message="error" v-if="error")
        loading(v-if="loading || playlistName" color="#b29adb")

        transition(name="playlist-modal")
            new-playlist.fixed(v-if="isCreatingPlaylist" @close="closeModal" @createPlaylist="createPlaylist")
        .container.margin-up-30
            .section
                .row.text-center
                    router-link.no-hover-decoration.playlist(v-for="playlist in playlists" :to="{ path: `/playlist/${playlist.id}`, query: $route.query }" :key="playlist.id")
                        playlist-card.item.playlist(:name="playlist.name" :tracks="playlist.tracks")
                    .item.item-add.text-center.clickable(@click="isCreatingPlaylist = true")
                        p.text-white.margin-0.text-size-2
                            i.material-icons add
                            span.icon-text Add
</template>

<script>
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'
    import PlaylistCard from '@/components/playlist-card'
    import NewPlaylist from '@/components/new-playlist'

    import { PlaylistApi } from '@/api'
    import { FScript, Banner } from '@/script/fscript'
    import { CREATE_PLAYLIST } from '@/store/mutation-types'

    export default {
        components: {
            'error': ErrorBox,
            'loading': Loading,
            'playlist-card': PlaylistCard,
            'new-playlist': NewPlaylist
        },
        data: () => ({
            error: null,
            loading: null,
            playlists: [],
            isCreatingPlaylist: false,
            newPlaylistName: null
        }),
        computed: {
            playlistName () {
                return this.$store.state.temp.newPlaylistName
            }
        },
        mounted () {
            this.$store.watch(() => this.$store.state.temp.newPlaylistName, (playlistName, oldPlaylistName) => {
                if (!playlistName || playlistName === oldPlaylistName) return
                this.createPlaylist(playlistName)
                this.$store.commit(CREATE_PLAYLIST, null)
            })
        },
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
            async createPlaylist (name) {
                try {
                    const playlist = await PlaylistApi.createPlaylist(name)
                    this.closeModal()
                    return this.playlists.push(playlist)
                } catch (err) {
                    this.closeModal()
                    FScript.addComponent(new Banner({
                        title: 'Error',
                        message: 'An error occured while creating your playlist'
                    }))
                }
            },
            closeModal () {
                this.isCreatingPlaylist = false
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

    .playlist-modal-enter-active, .playlist-modal-leave-active {
        will-change: transform, opacity;
        transition: transform 250ms ease-out, opacity 250ms ease-out;
        transform: scale(1);
        opacity: 1;
    }
    .playlist-modal-enter, .playlist-modal-leave-to {
        transform: scale(.95);
        opacity: 0;
    }
</style>
