<template>
    <main class="dark no-scroll">
        <div class="section">
            <div class="row">
                <div class="column s12">
                    <div class="column s12 l5 text-center scroll-animate blurInRight">
                        <div class="column s12 m6 l12 padding-0 relative">
                            <i id="turntable-icon" class="material-icons icon-size-20 absolute text-white no-events invisible">play_arrow</i>
                            <img id="turntable" onClick="spin()" class="hoverable-pop no-select" src="https://is4-ssl.mzstatic.com/image/thumb/Music117/v4/5c/cd/0c/5ccd0cfd-61b9-e372-fc34-c2b252597920/Conro_-_Connecting_The_Dots_EP.jpg/200x200bb.jpg" />
                            <div class="row">
                                <p class="text-grey text-center text-size-small-5 margin-0">Released: August 9, 2017</p>
                            </div>
                        </div>
                        <div class="column s12 m6 l12 padding-0 scroll-animate blurInRight">
                            <div class="row">
                                <a target="_blank" href="https://geo.itunes.apple.com/ca/album/connecting-the-dots-ep/1255658593?app=itunes" style="display:inline-block;overflow:hidden;background:url(https://linkmaker.itunes.apple.com/assets/shared/badges/en-us/itunes-lrg.svg) no-repeat;width:110px;height:40px;background-size:contain"></a>
                            </div>
                        </div>
                    </div>
                    <div class="column s12 l7 padding-0">
                        <div class="scroll-animate fadeInLeft">
                            <h2 class="text-light-color text-size-5 margin-down-0 scroll-animate blurInLeft">Connecting the dots EP</h2>
                            <div class="row margin-0">
                                <div class="column s12 l6 padding-0">
                                    <a class="no-hover-decoration" href="#"><h3 class="text-primary-light text-size-3 text-thin margin-left-20 margin-0"><span class="text-size-2">by </span>Conro</h3></a>
                                </div>
                                <div class="column s12 l6 padding-0">
                                    <h5 class="text-grey text-size-1 text-thin margin-0 padding-5 margin-left-15">Dance • 2017</h5>
                                </div>
                            </div>
                        </div>
                        <div class="section padding-left-0 padding-right-0 scroll-animate blurIn">
                            <div class="row">
                                <table class="interactive text-light-color">
                                    <thead>
                                        <tr class="uppercase text-grey text-darken-3 text-size-small-9">
                                            <th></th>
                                            <th>name</th>
                                            <th>time</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody class="clickable">
                                        <tr class="active">
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
        watch: { '$route': 'load' },
        methods: {
            load () {
                FS.addComponent(new AutoScrollAnimator()) // eslint-disable-line no-undef
            }
        }
    }
</script>

<style>
    td i { visibility: hidden; }
    tr:hover td i { visibility: visible; }

    #turntable { transition: transform 0.25s ease, border-radius 0.25s ease-out; }
    #turntable-icon {
        z-index: 100;
        line-height: 200px;
        width: 200px;
        text-shadow: 1px 1px 10px rgba(0, 0, 0, 1);
    }
</style>
