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
                router-link.drawer-action(to="/")
                    i.material-icons home
                    li Home
                router-link.drawer-action(to="/artist")
                    i.material-icons person
                    li Artist
                router-link.drawer-action(to="/album")
                    i.material-icons album
                    li Album
        .divider.margin-up-10.margin-down-10
        nav
            ul.capitalize
                router-link.drawer-action(to="/playlists")
                    i.material-icons playlist_play
                    li Playlists
                router-link.drawer-action(to="/settings")
                    i.material-icons settings
                    li Settings
                a.drawer-action(href="/logout")
                    i.material-icons exit_to_app
                    li Logout
</template>

<style lang="scss">
    .drawer {
        background-color: #454545 !important;
    }
</style>
