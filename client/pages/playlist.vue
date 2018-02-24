<template lang="pug">
    main.dark.no-scroll.flex.flex-spaced.flex-vertical
        .container.margin-up-30
            .section
                .row
                    table.interactive.text-light-color(v-if="playlist && playlist.tracks && playlist.tracks.length > 0")
                        thead
                            tr.uppercase.text-grey.text-darken-3.text-size-small-9
                                th
                                th name
                                th time
                                th
                        tbody#tracks.clickable
                            tr(v-for="track in playlist.tracks" :key="track.trackId")
                                td.text-center {{ i + 1 }}
                                td {{ track.trackName }}
                                td {{ track.duration }}
                                td
                                    i.material-icons.no-select play_circle_outline
</template>

<script>
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'

    import { PlaylistApi } from '@/api'
    import { FScript, Banner } from '@/script/fscript'

    export default {
        components: {
            'error': ErrorBox,
            'loading': Loading
        },
        data: () => ({
            error: null,
            loading: null,
            playlist: null
        }),
        beforeRouteEnter (to, from, next) {
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
            },
            async updatePlaylist () {
                try {
                    const playlist = await PlaylistApi.updatePlaylist(this.$route.params.id, 'Empty Playlist')
                    return this.playlists.push(playlist)
                } catch (err) {
                    FScript.addComponent(new Banner({
                        title: 'Error',
                        message: 'An error occured while renaming this playlist'
                    }))
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>

