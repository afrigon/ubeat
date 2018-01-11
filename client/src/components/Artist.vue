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
        watch: { '$route': 'load' },
        methods: {
            load () {
                FS.addComponent(new AutoScrollAnimator()) // eslint-disable-line no-undef
            }
        }
    }
</script>

<style>
</style>