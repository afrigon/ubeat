<template lang="pug">
    header.fixed.grey.darken-5.margin-0.flex.flex-spaced
        .hide-after-s.scroll-animate.fadeInRight.drawer-trigger(data-drawer-wrapper-id="drawer-menu")
            i.material-icons.m.text-white.margin-left-25 menu
        drawer(:username="username")
        navigation
        search()
        options(:username="username")
</template>

<script>
    import { mapState } from 'vuex'
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
        computed: {
            ...mapState({
                username: state => state.persistent.user.name
            })
        }
    }
</script>

<style lang="scss" scoped>
    header nav.underline-animate li::after { opacity: 0.75; }
    nav ul li { line-height: 1.5; }
</style>
