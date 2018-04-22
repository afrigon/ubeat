<template lang="pug">
    router-link.inline-block.text-center.text-white.text-size-2.album(:to="{ path: `/album/${id}` }")
        img.album-art(:src="pictureUrl" alt="Album Art")
        p.truncate {{ title }}
        .playlist-add-album.text-white.clickable(@click.stop="addAlbumToPlaylist")
            i.material-icons playlist_add
            span.icon-text Add album to playlist
</template>

<script>
    import { AlbumApi } from '@/api'
    import { PREPARE_SONG_FOR_INSERT } from '@/store/mutation-types'

    export default {
        props: [ 'id', 'title', 'pictureUrl' ],
        methods: {
            async addAlbumToPlaylist () {
                try {
                    const tracks = await AlbumApi.getAlbumTracks(this.id)
                    this.$store.commit(PREPARE_SONG_FOR_INSERT, tracks.list.map(n => n.trackId))
                } catch (err) { console.log('Could not add to playlist') }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .album {
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
</style>
