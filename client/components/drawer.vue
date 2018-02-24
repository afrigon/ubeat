<template lang="pug">
    #drawer-menu.drawer-wrapper.drawer-popup-wrapper
        div.drawer-header
            div.drawer-close
                i.material-icons close
        div.drawer-profile
            div.drawer-profile-image
                img.circle.primary-border(src="/static/img/card.jpg")
                p.text-white.margin-0.truncate alexfrigon154
        .divider.margin-down-10
        nav
            ul.capitalize
                router-link.drawer-action(:to="{ path: '/', query: $route.query }")
                    i.material-icons home
                    li Home
                router-link.drawer-action(:to="{ path: '/artist/583126594', query: $route.query }")
                    i.material-icons person
                    li Artist
                router-link.drawer-action(:to="{ path: '/album/1255658593', query: $route.query }")
                    i.material-icons album
                    li Album
        .divider.margin-up-10.margin-down-10
        nav
            ul.capitalize
                router-link.drawer-action(:to="{ path: '/playlists', query: $route.query }")
                    i.material-icons playlist_play
                    li Playlists
                router-link.drawer-action(:to="{ path: '/settings', query: $route.query }")
                    i.material-icons settings
                    li Settings
                router-link.drawer-action(:to="{ path: '/logout' }")
                    i.material-icons exit_to_app
                    li Logout
</template>

<script>
    import { FScript, Drawer } from '@/script/fscript'
    export default {
        mounted () {
            FScript.addComponent(new Drawer())
        }
    }
</script>


<style lang="scss" scoped>
    .drawer {
        background-color: #454545 !important;
    }
</style>
