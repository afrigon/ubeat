<template lang="pug">
    div#app.body
        header-bar(v-if="!public")
        router-view.margin-up-70.margin-down-100
        transition(name="playlist-modal")
            add-to-playlist.fixed.playlists(v-if="isAddingToPlaylist")
        radio(v-if="!public")
</template>

<script>
    import HeaderBar from '@/components/header-bar'
    import Radio from '@/components/radio'
    import AddToPlaylist from '@/components/add-to-playlist'
    import { WILL_UNLOAD } from '@/store/mutation-types'
    
    export default {
        name: 'app',
        components: {
            'header-bar': HeaderBar,
            'radio': Radio,
            'add-to-playlist': AddToPlaylist
        },
        data: () => ({
            public: null
        }),
        computed: {
            isAddingToPlaylist () {
                return this.$store.state.temp.songs
            }
        },
        created () {
            this.public = this.$route.meta.public
            window.addEventListener('beforeunload', () => {
                this.$store.commit(WILL_UNLOAD)
            })
        },
        watch: {
            $route () {
                this.public = this.$route.meta.public
            }
        }
    }
</script>

<style lang="scss">
    .body { overflow-x: hidden; }

    .submit-button {
        display: block;
        border-radius: 5px;
        padding: 10px 65px;
        margin: 25px auto 15px auto;
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
    .playlists {
        z-index: 10001;
        top: 100px;
        bottom: 30px;
        left: 30px;
        right: 30px;
        background-color: #454545 !important;
        border-radius: 4px;
    }
</style>
