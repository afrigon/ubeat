<template lang="pug">
    div
        router-link.no-hover-decoration(:to="{ path: `/playlist/${id}`, query: $route.query }")
            img.center.hoverable-pop(v-if="!images" :alt="`${name} Playlist Art`" src="/static/img/empty-playlist.jpg")
            img.center.hoverable-pop(v-else-if="!tracks.length" :alt="`${name} Playlist Art`" :src="images")
            .tiled(v-else)
                img.center.hoverable-pop(:alt="`${name} Playlist Art 1`" :src="images[0]")
                img.center(:alt="`${name} Playlist Art 2`" :src="images[1]")
                img.center(:alt="`${name} Playlist Art 3`" :src="images[2]")
                img.center(:alt="`${name} Playlist Art 4`" :src="images[3]")
            h5.text-white.text-thin.text-size-1.truncate.text-center {{ name }}
</template>

<script>
    export default {
        props: {
            id: String,
            name: String,
            tracks: Array
        },
        computed: {
            images () {
                if (!this.tracks || this.tracks.length <= 0) return null
                if (this.tracks.length < 4) return this.tracks[0].replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2150x150$4')
                return [
                    this.tracks[0].replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2150x150$4'),
                    this.tracks[1].replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2150x150$4'),
                    this.tracks[2].replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2150x150$4'),
                    this.tracks[3].replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2150x150$4')
                ]
            }
        }
    }
</script>

<style lang="scss" scoped>
    img { width: 100%; height: auto; }
    img, .tiled {
        width: 150px;
        height: 150px;
        border-radius: 5px;
    }
    .tiled img {
        width: 25%;
    }
</style>

