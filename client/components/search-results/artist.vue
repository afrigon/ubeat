<template lang="pug">
    div.inline-block.artist
        loading(v-if="loading" color="#b29adb")
        router-link.text-center.text-white.text-size-2(:to="{ path: `/artist/${id}` }")
            .artist-icon
                i.material-icons.xl account_circle
            p.truncate {{ name }}
        .playlist-add-album.text-white.clickable(@click.stop="addArtistToPlaylist")
            i.material-icons playlist_add
            span.icon-text Add artist to playlist
</template>

<script>
    import { ArtistApi } from '@/api'
    import { PREPARE_SONG_FOR_INSERT } from '@/store/mutation-types'
    import Loading from '@/components/loading'

    export default {
        props: [ 'id', 'name' ],
        components: {
            'loading': Loading
        },
        data: () => ({
            loading: null
        }),
        methods: {
            async addArtistToPlaylist () {
                try {
                    this.loading = true
                    const tracks = await ArtistApi.getArtistTracks(this.id)
                    this.loading = false
                    this.$store.commit(PREPARE_SONG_FOR_INSERT, tracks.map(n => n.trackId))
                } catch (err) { console.log('Could not add to playlist', err) }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .artist {
        width: 200px;
        margin-top: 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
    }
    p {
        display: inline-block;
        margin: 0;
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
    }
    i.xl {
        font-size: 70px;
    }
</style>

