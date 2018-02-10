<template lang="pug">
    header.relative.grey.darken-5.margin-0.flex.flex-spaced
        .hide-after-s.scroll-animate.fadeInRight.drawer-trigger(data-drawer-wrapper-id="drawer-menu")
            i.material-icons.m.text-white.margin-left-25 menu
        drawer
        navigation
        search
        search(v-bind:mobile="true")
        options
</template>

<script>
    import Navigation from '@/components/navigation'
    import Drawer from '@/components/drawer'
    import Search from '@/components/search'
    import Options from '@/components/options'

    export default {
        components: {
            'navigation': Navigation,
            'drawer': Drawer,
            'search': Search,
            'options': Options
        },
        mounted () {
            FS.addComponent(new AutoScrollAnimator()) // eslint-disable-line no-undef
        }
    }
</script>

<style lang="scss">
    header nav.underline-animate li::after {
        opacity: 0.75;
    }

    nav ul li {
        line-height: 1.5;
    }
</style>
