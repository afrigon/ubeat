<template lang="pug">
    main.dark.no-scroll.flex.flex-spaced.flex-vertical
        error(:message="error" v-if="error")
        loading(v-if="loading" color="#b29adb")

        .container.margin-up-30
            h1.text-white.text-size-3.text-light.text-center Playlists
            .section
                .row.text-center
                    playlist-card.item.playlist.clickable(v-for="playlist in playlists" :key="playlist.id" :name="playlist.name" :tracks="playlist.tracks" @click.native="() => selectPlaylist(playlist.id)")
</template>

<script>
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'
    import PlaylistCard from '@/components/playlist-card'

    import { PlaylistApi } from '@/api'

    export default {
        props: {
            'user-id': String
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
                return next(async vm => vm.setData(await PlaylistApi.getUsersPlaylists(this.userId)))
            } catch (err) { return next(vm => vm.setData(null)) }
        },
        async beforeRouteUpdate (to, from, next) {
            try {
                return this.setData(await PlaylistApi.getUsersPlaylists(this.userId)) & next()
            } catch (err) { return this.setData(null) & next() }
        },
        beforeRouteLeave (to, from, next) {
            this.loading = true
            return next()
        },
        async created () {
            try {
                return this.setData(await PlaylistApi.getUsersPlaylists(this.userId))
            } catch (err) { return this.setData(null) }
        },
        methods: {
            setData (data) {
                this.loading = false
                if (!data) {
                    this.playlists = []
                    return (this.error = 'An error occured while searching for playlists.')
                }

                this.error = null
                this.playlists = data
            },
            selectPlaylist (id) {
                this.$router.push({ path: `/playlist/${id}`, query: { redirectUrl: this.$route.path } })
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

    .close-icon {
        top: 0px; right: 15px;
    }
</style>
