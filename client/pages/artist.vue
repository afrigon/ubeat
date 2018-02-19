<template lang="pug">
    main.dark.no-scroll
        error(:message="error" v-if="error")
        loading(v-if="loading" color="#b29adb")

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
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'

    function fetchData (to, callback) {
        let data = {}
        Util.requestJSON(`/api/artists/${to.params.id}`, (err, response) => {
            if (err || !response.results || response.results.length <= 0) return callback(new Error('An error occured while searching for this artist'))

            data.artist = response.results[0]
            switch (data.artist.primaryGenreName.toLowerCase()) {
            case 'dance': data.artist.genre = 'dance'; break
            case 'classical': data.artist.genre = 'classical'; break
            case 'country': data.artist.genre = 'country'; break
            case 'metal': data.artist.genre = 'metal'; break
            case 'rock': data.artist.genre = 'rock'; break
            case 'songwriter': data.artist.genre = 'songwriter'; break
            case 'hip-hop/rap': data.artist.genre = 'rap'; break
            default:
                data.artist.genre = 'dance'
                console.log(this.artist.primaryGenreName.toLowerCase())
                break
            }

            Util.requestJSON(`/api/artists/${to.params.id}/albums?limit=15`, (err, response) => {
                if (err || !response.results || response.results.length <= 0) return callback(new Error('An error occured while searching for this artist'))

                data.albums = response.results
                for (let i = 0; i < data.albums.length; ++i) {
                    data.albums[i].artworkUrl400 = data.albums[i].artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2400x400$4')
                    data.albums[i].artworkUrl200 = data.albums[i].artworkUrl100.replace(/http:\/\/(is\d+)(.*)(100x100)(.*)/, 'https://$1-ssl$2200x200$4')
                }

                data.albums.sort((a, b) => {
                    const timeSinceA = Date.now() - new Date(a.releaseDate).getTime()
                    const timeSinceB = Date.now() - new Date(b.releaseDate).getTime()
                    if (timeSinceA === timeSinceB) return 0
                    return timeSinceA > timeSinceB ? 1 : -1
                })

                data.latestAlbums = data.albums.splice(0, 2)
                return callback(null, data)
            })
        })
    }

    export default {
        components: {
            'album': Album,
            'error': ErrorBox,
            'loading': Loading
        },
        data: () => ({
            artist: null,
            albums: null,
            latestAlbums: null,
            error: null,
            loading: null
        }),
        beforeRouteEnter (to, from, next) {
            return fetchData(to, (err, data) => {
                return next(vm => vm.setData(err, data))
            })
        },
        beforeRouteUpdate (to, from, next) {
            return fetchData(to, (err, data) => {
                this.setData(err, data)
                return next()
            })
        },
        beforeRouteLeave (to, from, next) {
            this.loading = true
            return next()
        },
        methods: {
            setData (err, data) {
                this.loading = false
                if (err) {
                    this.artist = this.albums = this.latestAlbums = null
                    return (this.error = err.message)
                }

                this.error = null
                this.artist = data.artist
                this.albums = data.albums
                this.latestAlbums = data.latestAlbums
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

    .loading {
        filter: blur(50%);
    }
</style>
