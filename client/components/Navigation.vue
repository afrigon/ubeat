<template lang="pug">
    header.relative.grey.darken-5.margin-0.flex.flex-spaced
        .hide-after-s.scroll-animate.fadeInRight.drawer-trigger(data-drawer-wrapper-id="drawer-menu")
            i.material-icons.m.text-white.margin-left-25 menu
        #drawer-menu.drawer-wrapper.drawer-wrapper-popup
            nav
                ul.capitalize
                    router-link#link-home.drawer-action.active(to="/")
                        i.material-icons home
                        li Home
                    router-link#link-artist.drawer-action(to="/artist")
                        i.material-icons person
                        li Artist
                    router-link#link-album.drawer-action(to="/album")
                        i.material-icons album
                        li Album
        nav.underline-animate.padding-0.margin-0.margin-left-25.margin-right-25.scroll-animate.fadeIn.text-left
            a.block.clickable(href="/#/")
                .logo.scroll-animate.fadeInScale
                    logo
            ul.margin-left-5.capitalize.hide-until-m
                router-link#link-home(to="/")
                    li.text-size-1 Home
                router-link#link-artist(to="/artist")
                    li.text-size-1 Artist
                router-link#link-album(to="/album")
                    li.text-size-1 Album
        search
        search(v-bind:mobile="true")
        #options-wrapper.grey.darken-5.scroll-animate.fadeInLeft.no-select(onclick="event.stopPropagation()")
            ul#options-list.hide-until-m
                router-link#link-playlists.no-hover-decoration(onclick="document.getElementById('options-wrapper').classList.remove('active')" to="/playlists")
                    li.text-white.capitalize.interactive.clickable
                        i.material-icons.s playlist_play
                        span Playlists
                router-link#link-settings.no-hover-decoration(onclick="document.getElementById('options-wrapper').classList.remove('active')" to="/settings")
                    li.text-white.capitalize.interactive.clickable
                        i.material-icons.s settings
                        span Settings
                a.no-hover-decoration(href="/logout")
                    li.text-white.capitalize.interactive.clickable
                        i.material-icons.s exit_to_app
                        span Logout
            #options-divider.divider.hide-until-m
            #avatar.text-right.flex.flex-right.clickable.margin-left-25.margin-right-25
                i#search-action.material-icons.m.text-white.clickable.hide-after-m.margin-right-20 search
                p#username.text-white.inline-block.margin-0.margin-right-20.truncate.hide-until-l alexfrigon154
                .flex.flex-center.clickable(onclick="toggleOptionsMenu();")
                    img.circle.primary-border.hide-until-m(src="/static/img/card.jpg")
                    i#options-button.material-icons.s.text-white.margin-left-5.hide-until-m keyboard_arrow_down
</template>

<script>
    import Search from '@/components/search'
    import Logo from '@/components/logo'

    export default {
        components: {
            'search': Search,
            'logo': Logo
        },
        mounted () {
            FS.addComponent(new AutoScrollAnimator()) // eslint-disable-line no-undef
        }
    }
</script>

<style lang="scss">
    header nav.underline-animate li::after {
        opacity: 0.75;
    }

    nav ul li {
        line-height: 1.5;
    }

    .input-wrapper label.active {
        transform: translateY(-8px) scale(.8);
    }

    #options-wrapper {
        border-bottom-left-radius: 15px;
        transition: margin-bottom 300ms ease;
        align-self: flex-end;
        max-width: 367px;

        .interactive {
            padding: 2px 0px;
            min-width: 120px;

            &:hover {
                background-color: #353535;
            }
        }

        #options-divider {
            margin: 13px 0;
        }

        &.active {
            #options-button { transform: scale(-1); }
            margin-bottom: -139px;
        }

        #options-list {
            padding: 0px 25px;
            margin: 13px 0px;

            i, span {
                line-height: 30px;
                vertical-align: middle;
            }

            i {
                padding: 0px 5px;
            }
        }

        #avatar {
            margin: 8px 0px;
            padding: 5px;
            
            p {
                max-width: 220px;
            }
            #options-button {
                transition: transform 300ms linear;
            }

            &:hover #options-button {
                color: #C0C0C0 !important;
            }
        
            img {
                height: 40px;
                width: 40px;
                border: solid 2px;
            }

            i {
                line-height: 40px;
            }
        }

        @media only screen and (max-width : 600px) {
            #avatar {
                margin-left: 0px !important;
                margin-right: 0px !important;
            }
        }
    }
</style>
