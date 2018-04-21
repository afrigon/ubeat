<template lang="pug">
    #drawer-menu.drawer-wrapper.drawer-popup-wrapper.invisible
        div.drawer-header
            div.drawer-close
                i.material-icons close
        router-link.no-decoration.drawer-close(:to="{ path: '/user/' + me.id, query: $route.query }")
            div.drawer-profile
                div.drawer-profile-image
                    img.circle.primary-border(:src="avatar")
                    p.text-white.margin-0.truncate {{ username }}
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
                router-link.drawer-action(:to="{ path: '/logout' }")
                    i.material-icons exit_to_app
                    li Logout
</template>

<script>
    import Api from '@/api'
    import { FScript, Drawer } from '@/script/fscript'

    export default {
        props: {
            username: String
        },
        data: () => ({
            avatar: null,
            me: {
                id: null
            }
        }),
        async mounted () {
            this.avatar = Api.getGravatar()
            this.me.id = window.localStorage.getItem('id')
            FScript.addComponent(new Drawer())
        }
    }
</script>


<style lang="scss" scoped>
    .drawer {
        background-color: #454545 !important;
    }
</style>
