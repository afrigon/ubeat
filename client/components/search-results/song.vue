<template lang="pug">
    div.inline-block.song.margin-down-45
        router-link.text-center.text-white.text-size-2(:to="{ path: `/album/${albumId}` }")
            img.song-art(:src="pictureUrl" alt="Album Art")
            p.truncate {{ name }}
        .playlist-add-album.text-white.clickable(@click.stop="addSongToPlaylist(id)")
            i.material-icons playlist_add
            span.icon-text Add song to playlist
</template>

<script>
    import { PREPARE_SONG_FOR_INSERT } from '@/store/mutation-types'

    export default {
        props: [ 'id', 'albumId', 'name', 'pictureUrl' ],
        methods: {
            addSongToPlaylist (id) {
                this.$store.commit(PREPARE_SONG_FOR_INSERT, [id])
            }
        }
    }
</script>

<style lang="scss" scoped>
    .song {
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
