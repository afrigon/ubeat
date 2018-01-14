<template>
    <main class="dark no-scroll">
        <div class="section">
            <div class="row">
                <div class="column s12">
                    <div class="column s12 l5 text-center scroll-animate fadeInRight">
                        <div class="column s12 m6 l12 padding-0 relative">
                            <img id="albumArt" alt="Connecting the Dots EP album art" class="hoverable-pop no-select" src="https://is5-ssl.mzstatic.com/image/thumb/Music117/v4/d4/da/52/d4da52cb-524e-5995-232c-d2485fcdf5a4/source/200x200bb.jpg" 
                                 srcset="https://is5-ssl.mzstatic.com/image/thumb/Music117/v4/d4/da/52/d4da52cb-524e-5995-232c-d2485fcdf5a4/source/200x200bb.jpg,
                                         https://is5-ssl.mzstatic.com/image/thumb/Music117/v4/d4/da/52/d4da52cb-524e-5995-232c-d2485fcdf5a4/source/400x400bb.jpg 2x,
                                         https://is5-ssl.mzstatic.com/image/thumb/Music117/v4/d4/da/52/d4da52cb-524e-5995-232c-d2485fcdf5a4/source/600x600bb.jpg 3x" />
                            <div class="row">
                                <p id="releaseDate" class="text-grey text-center text-size-small-5 margin-0">Released: August 9, 2017</p>
                            </div>
                        </div>
                        <div class="column s12 m6 l12 padding-0 scroll-animate fadeInRight">
                            <div class="row">
                                <a class="itunes-button" target="_blank" rel="noopener" href="https://geo.itunes.apple.com/ca/album/connecting-the-dots-ep/1255658593?app=itunes"></a>
                            </div>
                        </div>
                    </div>
                    <div class="column s12 l7 padding-0">
                        <div class="scroll-animate fadeInLeft">
                            <h2 id="collectionName" class="text-light-color text-size-5 margin-down-0 scroll-animate fadeInLeft">Connecting the dots EP</h2>
                            <div class="row margin-0">
                                <div class="column s12 l6 padding-0">
                                    <a class="no-hover-decoration" href="/#/artist?id=583126594"><h3 class="text-primary-light text-size-3 text-thin margin-left-20 margin-0"><span class="text-size-2">by </span><span id="artistName">Conro</span></h3></a>
                                </div>
                                <div class="column s12 l6 padding-0">
                                    <h5 class="text-grey text-size-1 text-thin margin-0 padding-5 margin-left-15"><span id="primaryGenreName">Dance</span> • <span id="releaseDateYear">2017</span></h5>
                                </div>
                            </div>
                        </div>
                        <div class="section padding-left-0 padding-right-0 scroll-animate fadeIn">
                            <div class="row">
                                <table class="interactive text-light-color">
                                    <thead>
                                        <tr class="uppercase text-grey text-darken-3 text-size-small-9">
                                            <th>&nbsp;</th>
                                            <th>name</th>
                                            <th>time</th>
                                            <th>&nbsp;</th>
                                        </tr>
                                    </thead>
                                    <tbody class="clickable" id="tracks">
                                        <tr>
                                            <td class="text-center">1</td>
                                            <td>Close</td>
                                            <td>3:04</td>
                                            <td><i class="material-icons no-select">play_circle_outline</i></td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">2</td>
                                            <td>Circus (feat. Beckii Power)</td>
                                            <td>3:34</td>
                                            <td><i class="material-icons no-select">play_circle_outline</i></td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">3</td>
                                            <td>Remedy</td>
                                            <td>3:09</td>
                                            <td><i class="material-icons no-select">play_circle_outline</i></td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">4</td>
                                            <td>Lay Low (feat. David Benjamin)</td>
                                            <td>3:26</td>
                                            <td><i class="material-icons no-select">play_circle_outline</i></td>
                                        </tr>
                                        <tr>
                                            <td class="text-center">5</td>
                                            <td>Love Divine (feat. Alice Berg)</td>
                                            <td>3:07</td>
                                            <td><i class="material-icons no-select">play_circle_outline</i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="row margin-0">
                                <p class="text-grey text-size-small-5 margin-0">5 songs, 17 minutes</p>
                            </div>
                            <div class="row margin-0">
                                <p class="text-grey text-size-small-5">℗ 2017 Monstercat</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script type="text/javascript">
    export default {
        mounted () {
            this.load()
        },
        methods: {
            load () {
                FS.addComponent(new AutoScrollAnimator()) // eslint-disable-line no-undef
                setTimeout(() => {
                    document.getElementById('link-home').classList.remove('active')
                    document.getElementById('link-artist').classList.remove('active')
                    document.getElementById('link-album').classList.add('active')
                }, 100)
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
        width: 200px;
        height: auto;
    }
</style>
