<template>
    <main class="dark no-scroll">
        <div class="container" id="test">
            <div class="section">
                <div class="row">
                </div>
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
                    document.getElementById('link-home').classList.remove('active')
                    document.getElementById('link-artist').classList.add('active')
                    document.getElementById('link-album').classList.remove('active')
                }, 100)
            }
        }
    }
</script>

<style>
</style>