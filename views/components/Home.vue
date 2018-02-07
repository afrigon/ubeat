<template>
    <main class="dark no-scroll flex flex-spaced flex-vertical">
        <div class="container">
            <div class="section">
                <div class="row text-center">
                    <img class="playlist hoverable-pop clickable" src="https://is5-ssl.mzstatic.com/image/thumb/Music117/v4/d4/da/52/d4da52cb-524e-5995-232c-d2485fcdf5a4/source/400x400bb.jpg" alt="Playlist Art" />
                    <img class="playlist hoverable-pop clickable" src="https://is5-ssl.mzstatic.com/image/thumb/Music117/v4/d4/da/52/d4da52cb-524e-5995-232c-d2485fcdf5a4/source/400x400bb.jpg" alt="Playlist Art" />
                    <img class="playlist hoverable-pop clickable" src="https://is5-ssl.mzstatic.com/image/thumb/Music117/v4/d4/da/52/d4da52cb-524e-5995-232c-d2485fcdf5a4/source/400x400bb.jpg" alt="Playlist Art" />
                    <img class="playlist hoverable-pop clickable" src="https://is5-ssl.mzstatic.com/image/thumb/Music117/v4/d4/da/52/d4da52cb-524e-5995-232c-d2485fcdf5a4/source/400x400bb.jpg" alt="Playlist Art" />
                    <img class="playlist hoverable-pop clickable" src="https://is5-ssl.mzstatic.com/image/thumb/Music117/v4/d4/da/52/d4da52cb-524e-5995-232c-d2485fcdf5a4/source/400x400bb.jpg" alt="Playlist Art" />
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
        width: 150px;
        margin: 10px;
    }
</style>