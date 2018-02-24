<template lang="pug">
    main.dark.no-scroll
        error(:message="error" v-if="error")
        loading(v-if="loading" color="#b29adb")

        .banner.dance(v-if="artist && artist.genre" :class="artist.genre")
        #banner-text-wrapper.container.scroll-animate-router.fadeIn(v-if="artist && artist.genre")
            .inline-block
                h2#artistName.margin-0.text-white.text-light.text-size-6.text-shadow-5(v-if="artist.artistName") {{ artist.artistName }}
            .inline-block.right
                h3#primaryGenreName.margin-0.text-primary-light.text-light.text-size-3.text-shadow-5(v-if="artist.primaryGenreName") {{ artist.primaryGenreName }}
        .section.container.albums(v-if="albums")
            .row(v-if="latestAlbums")
                .scroll-animate-router.fadeIn.margin-up-40(v-if="artist")
                    h4.text-white.text-size-3.text-light.inline-block Latest Releases
                    a#itunes-button.right(target="_blank" rel="noopener" :href="artist.artistLinkUrl")
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

    import { ArtistApi } from '@/api'

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
            try {
                return next(async vm => vm.setData(await ArtistApi.getFullArtist(to.params.id)))
            } catch (err) { return next(vm => vm.setData(null)) }
        },
        async beforeRouteUpdate (to, from, next) {
            try {
                return this.setData(await ArtistApi.getFullArtist(to.params.id)) & next()
            } catch (err) { return this.setData(null) & next() }
        },
        beforeRouteLeave (to, from, next) {
            this.loading = true
            return next()
        },
        methods: {
            setData (data) {
                this.loading = false
                if (!data) {
                    this.artist = this.albums = this.latestAlbums = null
                    return (this.error = 'An error occured while searching for this artist.')
                }

                this.error = null
                this.artist = data.artist
                this.albums = data.albums
                this.latestAlbums = data.latestAlbums
            }
        }
    }
</script>

<style lang="scss" scoped>
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
