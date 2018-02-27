<template lang="pug">
    div
        img.center.hoverable-pop(v-if="!images" :alt="`${name} Playlist Art`" src="/static/img/empty-playlist.jpg")
        img.center.hoverable-pop(v-else-if="tracks.length < 4" :alt="`${name} Playlist Art`" :src="images")
        .tiled.hoverable-pop(v-else)
            img.center(:alt="`${name} Playlist Art 1`" :src="images[0]")
            img.center(:alt="`${name} Playlist Art 2`" :src="images[1]")
            img.center(:alt="`${name} Playlist Art 3`" :src="images[2]")
            img.center(:alt="`${name} Playlist Art 4`" :src="images[3]")
        h5.truncate(v-if="!editing") {{ name || computedName }}
        input.truncate(v-else v-model="computedName" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false")
</template>

<script>
    import { SET_PLAYLIST_NAME } from '@/store/mutation-types'

    export default {
        props: {
            tracks: Array,
            name: String,
            editing: Boolean
        },
        computed: {
            images () {
                if (!this.tracks || this.tracks.length <= 0) return null
                if (this.tracks.length < 4) return this.tracks[0].artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2200x200$4')
                return [
                    this.tracks[0].artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2200x200$4'),
                    this.tracks[1].artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2200x200$4'),
                    this.tracks[2].artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2200x200$4'),
                    this.tracks[3].artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2200x200$4')
                ]
            },
            computedName: {
                get () {
                    return this.$store.state.temp.playlistName || 'Playlist'
                },
                set (value) {
                    this.$store.commit(SET_PLAYLIST_NAME, value)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    img { width: 100%; height: auto; }
    img, .tiled {
        width: 100%;
        height: 100%;
        max-width: 200px;
        max-height: 200px;
        border-radius: 5px;
        margin: auto;
    }
    .tiled {
        line-height: 0;
        img {
            width: 50%;
            height: auto;
            display: inline-block;
            border-radius: 0px;
        }
        img:nth-child(1) { border-top-left-radius: 5px; }
        img:nth-child(2) { border-top-right-radius: 5px; }
        img:nth-child(3) { border-bottom-left-radius: 5px; }
        img:nth-child(4) { border-bottom-right-radius: 5px; }        
    }
    h5 { border-bottom: transparent solid 1px; }
    input { padding: 0 7px; }
    input, h5 {
        -webkit-font-smoothing: antialiased;
        margin: 5px 0 !important;
        font-size: 120%;
        line-height: 43.5px;
        text-align: center;
        font-weight: 200;
        color: #FFFFFF;
    }
</style>
