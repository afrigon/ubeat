<template lang="pug">
    transition(name="fade")
        .fixed.edge-0.grey.darken-5(v-if="opened")
            form.dark(@submit.prevent="x => x")
                p.hide-until-m.tagline.text-white Search for an artist, album song or user
                input.text-white.text-fat.transparent.browser-default(type="text" name="q" autocomplete="off" @keyup="search" ref="search" v-model="qString")
                .close-search.absolute.clickable(@click="close")
                    i.material-icons.l.text-white close

            .results.grey.darken-5
                ul.no-select.filter-wrapper.text-white.text-size-1.text-fat.text-center.clickable(@click="focus")
                    li.filter(@click="_ => selectMode(0)" :class="{ selected: mode == 0 }") ALL RESULTS
                    li.filter(@click="_ => selectMode(1)" :class="{ selected: mode == 1 }") ARTISTS
                    li.filter(@click="_ => selectMode(2)" :class="{ selected: mode == 2 }") ALBUMS
                    li.filter(@click="_ => selectMode(3)" :class="{ selected: mode == 3 }") SONGS
                    li.filter(@click="_ => selectMode(4)" :class="{ selected: mode == 4 }") USERS

                .result-items.scroll
                    .container
                        .section.result-item.result-artists(v-if="mode <= 1 && artists && artists.length > 0" @click="close")
                            h1.row.text-white.text-size-3.text-regular Artists
                            .text-center
                                artist.row(v-for="artist in artists" :key="artist.artistId" :id="artist.artistId" :name="artist.artistName")
                        .section.result-item.result-albums(v-if="(mode == 0 || mode == 2) && albums && albums.length > 0" @click="close")
                            h1.row.text-white.text-size-3.text-regular Albums
                            .text-center
                                album.row(v-for="album in albums" :key="album.collectionId" :id="album.collectionId" :title="album.collectionName" :pictureUrl="album.artworkUrl100")
                        .section.result-item.result-songs(v-if="(mode == 0 || mode == 3) && songs && songs.length > 0" @click="close")
                            h1.row.text-white.text-size-3.text-regular Songs
                            .text-center
                                song.row(v-for="song in songs" :key="song.trackId" :id="song.trackId" :albumId="song.collectionId" :name="song.trackName" :pictureUrl="song.artworkUrl60")
                        .section.result-item.result-users(v-if="(mode == 0 || mode == 4) && users && users.length > 0" @click="close")
                            h1.row.text-white.text-size-3.text-regular Users
                            .text-center
                                router-link.inline-block.text-center.text-white.text-size-2.user(v-for="user in users" :to="{ path: `/user/${user.id}` }" :key="user.id")
                                    user-card.row(:id="user.id" :name="user.name" :email="user.email")
                        .section(v-if="error")
                            .row.text-center
                                h1.text-red.text-size-2 {{ error }}
</template>

<script>
    import Vue from 'vue'
    import { SearchApi } from '@/api'
    import Artist from '@/components/search-results/artist'
    import Album from '@/components/search-results/album'
    import Song from '@/components/search-results/song'
    import UserCard from '@/components/user-card'

    export default {
        components: {
            'artist': Artist,
            'album': Album,
            'song': Song,
            'user-card': UserCard
        },
        data: () => ({
            opened: false,
            qString: '',
            mode: 0,
            albums: null,
            artists: null,
            songs: null,
            users: null,
            timer: null,
            error: null
        }),
        async mounted () {
            const action = document.getElementById('search-action')
            if (!action) return
            action.addEventListener('click', e => {
                this.opened = true
                Vue.nextTick(_ => this.focus())
            })
        },
        methods: {
            focus () {
                if (this.$refs.search) this.$refs.search.focus()
            },
            selectMode (mode) {
                this.mode = mode
                if (this.qString !== '') this.search()
            },
            close () {
                this.opened = false
                this.qString = ''
                this.mode = 0
                this.albums = this.artists = this.songs = this.users = null
            },
            search () {
                clearTimeout(this.timer)
                this.timer = setTimeout(async _ => {
                    this.error = null
                    try {
                        switch (this.mode) {
                        case 0:
                            const result = await SearchApi.search(this.qString)
                            this.albums = result.filter(n => n.wrapperType === 'collection')
                            this.artists = result.filter(n => n.wrapperType === 'artist')
                            this.songs = result.filter(n => n.wrapperType === 'track')
                            this.users = await SearchApi.searchUsers(this.qString)
                            this.users.splice(30, this.users.length - 1)
                            break
                        case 1:
                            this.artists = await SearchApi.searchArtists(this.qString)
                            break
                        case 2:
                            this.albums = await SearchApi.searchAlbums(this.qString)
                            break
                        case 3:
                            this.songs = await SearchApi.searchSongs(this.qString)
                            break
                        case 4:
                            this.users = await SearchApi.searchUsers(this.qString)
                            this.users.splice(30, this.users.length - 1)
                            break
                        }
                    } catch (err) { this.error = `An error occured while searching for '${this.qString}', try again later.` }
                }, 500)
            }
        }
    }
</script>

<style lang="scss" scoped>
    ul, h1 { margin: 0; }
    h1 { margin-bottom: 10px; }
    form {
        height: 125px;
        position: relative;
    }
    .results { height: calc(100vh - 125px); }
    .result-items {
        height: calc(100vh - 125px - 62px);
        overflow-x: hidden;
    }
    .filter {
        display: inline-block;
        margin: 20px;
    }
    input {
        -webkit-appearance: none;
        border-radius: 0;
        outline: none;
        border: none;
        box-shadow: none;
        height: 50px;
        line-height: 50px;
        box-sizing: border-box;
        font-size: 34px;
        position: absolute;
        bottom: 25px;
        left: 100px;
        right: 100px;
        width: 80%;
        padding: 10px 15px;
        border-bottom: 1px solid #9E9E9E;
    }
    .tagline {
        margin: 0;
        margin-left: 100px;
        padding-top: 20px;
    }
    .close-search {
        right: 50px;
        bottom: 23px;
    }
    .filter.selected { border-bottom: 1px solid white; }
    .section { box-sizing: content-box; }

    .result-items::-webkit-scrollbar {
        width: 6px;
        background-color: rgba(0,0,0,0);
    }
    .result-items::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,0);
        border: none;
    }
    .result-items::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #656565;
        border-color: #353535;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .user {
        width: 200px;
        margin-top: 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
    }

    @media only screen and (max-width : 600px) {
        form {
            height: 75px;
        }
        input {
            left: 10px;
            bottom: 12.5px;
            right: 36px;
        }
        .close-search {
            right: 10px;
            bottom: 11px;
        }
        ul {
            width: 100%;
            height: 61px;
            overflow: scroll;
            white-space: nowrap;
        }
        ul::-webkit-scrollbar {
            display: none;
        }
    }
</style>
