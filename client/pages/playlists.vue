<template lang="pug">
    main.dark.no-scroll.flex.flex-spaced.flex-vertical
        .container.margin-up-30
            .section
                .row
                    playlist.item.playlist(v-for="playlist in playlists" :id="playlist.id" :key="playlist.id" :name="playlist.name" :tracks="playlist.tracks")
                    .item.item-add.text-center.clickable(@click="createPlaylist")
                        p.text-white.margin-0.text-size-2
                            i.material-icons add
                            span Add

</template>

<script>
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'
    import Playlist from '@/components/playlist'

    import { PlaylistApi } from '@/api'

    export default {
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
                } catch (err) { }// TODO: show user their shit failed }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .item {
        vertical-align: top;
        display: inline-block;
        margin: 15px;
    }

    .item-add {
        width: 150px;
        height: 150px;
        border-radius: 5px;
        border: #696969 1px dashed;
        p, p i, p span {
            line-height: 150px;
            vertical-align: top;
        }
    }
</style>

