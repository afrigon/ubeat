<template lang="pug">
    main.dark.no-scroll.flex.flex-spaced.flex-vertical
        .container.margin-up-30
            .section
                .row
</template>

<script>
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

<style lang="scss">

</style>
