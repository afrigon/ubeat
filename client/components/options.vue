<template lang="pug">
    #options-wrapper.grey.darken-5.scroll-animate.fadeInLeft.no-select(onclick="event.stopPropagation()")
        ul#options-list.hide-until-m
            router-link.no-hover-decoration(onclick="document.getElementById('options-wrapper').classList.remove('active')" :to="{ path: '/playlists', query: $route.query }")
                li.text-white.interactive.clickable
                    i.material-icons.s playlist_play
                    span Playlists
            router-link.no-hover-decoration(onclick="document.getElementById('options-wrapper').classList.remove('active')" :to="{ path: '/settings', query: $route.query }")
                li.text-white.interactive.clickable
                    i.material-icons.s settings
                    span Settings
            router-link.no-hover-decoration(:to="{ path: '/logout' }")
                li.text-white.interactive.clickable
                    i.material-icons.s exit_to_app
                    span Logout
        #options-divider.divider.hide-until-m
        #avatar.text-right.flex.flex-right.clickable.margin-left-25.margin-right-25
            i#search-action.material-icons.m.text-white.clickable.hide-after-m.margin-right-20 search
            p#username.text-white.inline-block.margin-0.margin-right-20.truncate.hide-until-l {{ name }}
            .flex.flex-center.clickable(onclick="toggleOptionsMenu();")
                img.circle.primary-border.hide-until-m(src="/static/img/card.jpg")
                i#options-button.material-icons.s.text-white.margin-left-5.hide-until-m keyboard_arrow_down
</template>

<script>
    export default {
        data: () => ({
            name: null
        }),
        watch: {
            '$route' () {
                this.name = window.localStorage.getItem('name') ||
                    window.localStorage.getItem('email') ||
                    ''
            }
        },
        created () {
            this.name = window.localStorage.getItem('name') ||
                window.localStorage.getItem('email') ||
                ''
        }
    }
</script>


<style lang="scss" scoped>
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
