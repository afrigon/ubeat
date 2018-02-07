<template>
    <main class="dark no-scroll flex flex-spaced flex-vertical">
        <div class="container">
            <div class="section">
                <div class="row text-center">
                    <div class="playlist hoverable-pop clickable" id="pop"></div>
                    <div class="playlist hoverable-pop clickable" id="classical"></div>
                    <div class="playlist hoverable-pop clickable" id="dance"></div>
                    <div class="playlist hoverable-pop clickable" id="rock"></div>
                    <div class="playlist hoverable-pop clickable" id="metal"></div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="section">
                <div id="player"></div>
            </div>
        </div>
    </main>
</template>

<script>
    export default {
        mounted () {
            this.load()
        },
        methods: {
            load () {
                FS.addComponent(new AutoScrollAnimator()) // eslint-disable-line no-undef
                setTimeout(() => {
                    document.getElementById('link-home').classList.add('active')
                    document.getElementById('link-artist').classList.remove('active')
                    document.getElementById('link-album').classList.remove('active')
                }, 100)

                // eslint-disable-next-line no-undef
                FS.addComponent(new AudioPlayer('https://audio-ssl.itunes.apple.com/apple-assets-us-std-000001/AudioPreview127/v4/9d/91/a0/9d91a04c-f41a-f605-8ca8-71821a1f69d2/mzaf_1381500230730914803.plus.aac.p.m4a', {
                    visual: true,
                    visualColor: '#9575CD'
                }), '#player')
            }
        }
    }
</script>

<style lang="scss">
    .playlist {
        $size: 150;
        background-image: url('/static/img/playlists.jpg');
        background-repeat: no-repeat;
        width: #{$size}px;
        height: #{$size}px;
        border-radius: 4px;
        margin: 10px;
        display: inline-block;

        @for $i from 0 to 4 {
            @for $j from 0 to 4 {
                &:nth-child(#{$i * 4 + $j + 1}) {
                    background-position: #{-$size * $j}px #{-$size * $i}px;
                }
            }
        }
    }
</style>