<template lang="pug">
    main.dark.no-scroll
        .section
            .row
                .column.s12
                    .column.s12.l5.text-center.scroll-animate-router.fadeInRight
                        .column.s12.m6.l12.padding-0.relative
                            img#albumArt.hoverable-pop.no-select(alt="Connecting the Dots EP album art" src="https://is5-ssl.mzstatic.com/image/thumb/Music117/v4/d4/da/52/d4da52cb-524e-5995-232c-d2485fcdf5a4/source/400x400bb.jpg")
                            .row
                                p#releaseDate.text-grey.text-center.text-size-small-5.margin-0 Released: August 9, 2017
                        .column.s12.m6.l12.padding-0.scroll-animate-router.fadeInRight
                            .row
                                a.itunes-button(target="_blank" rel="noopener" href="https://geo.itunes.apple.com/ca/album/connecting-the-dots-ep/1255658593?app=itunes")
                    .column.s12.l7.padding-0
                        .scroll-animate-router.fadeInLeft
                            h2#collectionName.text-light-color.text-size-5.margin-down-0.scroll-animate-router.fadeInLeft Connecting the dots EP
                            .row.margin-0
                                .column.s12.l6.padding-0
                                    a.no-hover-decoration(href="/#/artist?id=583126594")
                                        h3.text-primary-light.text-size-3.text-thin.margin-left-20.margin-0
                                            span.text-size-2 by 
                                            span#artistName Conro
                                .column.s12.l6.padding-0
                                    h5.text-grey.text-size-1.text-thin.margin-0.padding-5.margin-left-15
                                        span#primaryGenreName Dance
                                        |  • 
                                        span#releaseDateYear 2017
                        .section.padding-left-0.padding-right-0.scroll-animate-router.fadeIn
                            .row
                                table.interactive.text-light-color
                                    thead
                                        tr.uppercase.text-grey.text-darken-3.text-size-small-9
                                            th  
                                            th name
                                            th time
                                            th  
                                    tbody#tracks.clickable
                                        tr
                                            td.text-center 1
                                            td Close
                                            td 3:04
                                            td
                                                i.material-icons.no-select play_circle_outline
                                        tr
                                            td.text-center 2
                                            td Circus (feat. Beckii Power)
                                            td 3:34
                                            td
                                                i.material-icons.no-select play_circle_outline
                                        tr
                                            td.text-center 3
                                            td Remedy
                                            td 3:09
                                            td
                                                i.material-icons.no-select play_circle_outline
                                        tr
                                            td.text-center 4
                                            td Lay Low (feat. David Benjamin)
                                            td 3:26
                                            td
                                                i.material-icons.no-select play_circle_outline
                                        tr
                                            td.text-center 5
                                            td Love Divine (feat. Alice Berg)
                                            td 3:07
                                            td
                                                i.material-icons.no-select play_circle_outline
                            .row.margin-0.margin-left-20
                                p.text-grey.text-size-small-5.margin-0 5 songs, 17 minutes
                            .row.margin-0.margin-left-20
                                p.text-grey.text-size-small-5 ℗ 2017 Monstercat
</template>

<script type="text/javascript">
    export default {
        mounted () {
            this.load()
        },
        methods: {
            load () {
                FS.addComponent(new AutoScrollAnimator({ selector: 'scroll-animate-router' })) // eslint-disable-line no-undef
            }
        }
    }
</script>

<style>
    td i {
        visibility: hidden;
    }

    tr:hover td i {
        visibility: visible;
    }

    .itunes-button {
        display: inline-block;
        overflow: hidden;
        background: url(https://linkmaker.itunes.apple.com/assets/shared/badges/en-us/itunes-lrg.svg) no-repeat;
        width: 110px;
        height :40px;
        background-size: contain
    }

    #albumArt {
        width: 50%;
        height: auto;
    }

    @media only screen and (max-width : 992px) {
        #albumArt {
            width: 75%;
        }   
    }
</style>
