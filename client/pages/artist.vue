<template lang="pug">
    main.dark.no-scroll
        .text-center.error.text-red(v-if="error") {{ error }}
        .banner.dance(v-if="artist && artist.genre" v-bind:class="artist.genre")
        #banner-text-wrapper.container.scroll-animate-router.fadeIn(v-if="artist && artist.genre")
            .inline-block
                h2#artistName.margin-0.text-white.text-light.text-size-6.text-shadow-5(v-if="artist.artistName") {{ artist.artistName }}
            .inline-block.right
                h3#primaryGenreName.margin-0.text-primary-light.text-light.text-size-3.text-shadow-5(v-if="artist.primaryGenreName") {{ artist.primaryGenreName }}
        .section.container.albums(v-if="albums")
            .row(v-if="latestAlbums")
                .scroll-animate-router.fadeIn.margin-up-40(v-if="artist")
                    h4.text-white.text-size-3.text-light.inline-block Latest Releases
                    a#itunes-button.right(target="_blank" rel="noopener" v-bind:href="artist.artistLinkUrl")
                    .divider
                #latestReleases.column.s12.padding-0
                    album(v-for="album in latestAlbums" :id="album.collectionId" :title="album.collectionName" :artist="album.artistName" :pictureUrl="album.artworkUrl400" :key="album.collectionId" highlight)
            .row(v-if="albums")
                .scroll-animate-router.fadeIn
                    h4.text-white.text-size-3.text-light Albums
                    .divider
                #albums.column.s12.padding-0
                    album(v-for="album in albums" :id="album.collectionId" :title="album.collectionName" :artist="album.artistName" :pictureUrl="album.artworkUrl200" :key="album.collectionId" )
</template>

<script>
    import Album from '@/components/album'

    export default {
        components: {
            'album': Album
        },
        data: () => ({
            artist: null,
            albums: null,
            latestAlbums: null,
            error: null
        }),
        created () { this.fetchData() },
        watch: {
            '$route': 'fetchData'
        },
        methods: {
            fetchData (to, from) {
                if (to && from && to.params.id === from.params.id) return
                this.error = null
                Util.request(`/api/artists/${this.$route.params.id}`, 'GET', null, (err, response) => {
                    if (err || !response.results || response.results.length <= 0) return (this.error = 'An error occured while getting this album')
                    this.artist = response.results[0]

                    switch (this.artist.primaryGenreName.toLowerCase()) {
                    case 'dance':
                        this.artist.genre = 'dance'
                        break
                    case 'classical':
                        this.artist.genre = 'classical'
                        break
                    case 'country':
                        this.artist.genre = 'country'
                        break
                    case 'metal':
                        this.artist.genre = 'metal'
                        break
                    case 'rock':
                        this.artist.genre = 'rock'
                        break
                    case 'songwriter':
                        this.artist.genre = 'songwriter'
                        break
                    case 'hip-hop/rap':
                        this.artist.genre = 'rap'
                        break
                    default:
                        this.artist.genre = 'dance'
                        console.log(this.artist.primaryGenreName.toLowerCase())
                        break
                    }

                    Util.request(`/api/artists/${this.$route.params.id}/albums?limit=15`, 'GET', null, (err, response) => {
                        if (err || !response.results || response.results.length <= 0) return (this.error = 'An error occured while searching for this album')
                        this.albums = response.results

                        for (let i = 0; i < this.albums.length; ++i) {
                            this.albums[i].artworkUrl400 = this.albums[i].artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2400x400$4')
                            this.albums[i].artworkUrl200 = this.albums[i].artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2200x200$4')
                        }

                        this.albums.sort((a, b) => {
                            const timeSinceA = Date.now() - new Date(a.releaseDate).getTime()
                            const timeSinceB = Date.now() - new Date(b.releaseDate).getTime()
                            if (timeSinceA === timeSinceB) return 0
                            return timeSinceA > timeSinceB ? 1 : -1
                        })

                        this.latestAlbums = this.albums.splice(0, 2)
                    })
                })
            }
        }
    }
</script>

<style lang="scss">
    .banner.dance {
        background-image: url('/static/img/genre/dance.jpg');
        background-position: center 70%;
    }
    .banner.rock {
        background-image: url('/static/img/genre/rock.jpg');
        background-position: center 10%;
    }
    .banner.classical {
        background-image: url('/static/img/genre/classical.jpg');
        background-position: center 40%;
    }
    .banner.country {
        background-image: url('/static/img/genre/country.jpg');
        background-position: center 45%;
    }
    .banner.songwriter {
        background-image: url('/static/img/genre/songwriter.jpg');
        background-position: center 40%;
    }
    .banner.metal {
        background-image: url('/static/img/genre/metal.jpg');
        background-position: center 70%;
    }

    #banner-text-wrapper {
        margin-top: -50px;

        h2, h3 {
            vertical-align: middle;
            line-height: 37px;
        }
    }

    .albums {
        img {
            width: 75%;
            height: auto;
        }

        p {
            width: 100%;
        }
    }

    #itunes-button {
        margin: 8.46px 0px;
        display: inline-block;
        overflow: hidden;
        background: url(https://linkmaker.itunes.apple.com/assets/shared/badges/en-us/itunes-lrg.svg) no-repeat;
        width: 110px;
        height :40px;
        background-size: contain
    }
</style>
