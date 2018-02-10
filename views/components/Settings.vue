<template>
    <main class="dark no-scroll flex flex-spaced flex-vertical">
        <div class="container margin-up-30">
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
            }
        }
    }
</script>

<style lang="scss">

</style>
