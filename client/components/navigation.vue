<template lang="pug">
    nav.underline-animate.padding-0.margin-0.margin-left-25.margin-right-25.scroll-animate.fadeIn.text-left
        router-link.block.clickable(:to="{ path: '/', query: $route.query }")
            .logo.scroll-animate.fadeInScale
                logo
        ul.margin-left-5.capitalize.hide-until-m
            router-link(:to="{ path: '/', query: $route.query }")
                li.text-size-1 Home
            router-link(:to="{ path: '/artist/583126594', query: $route.query }")
                li.text-size-1 Artist
            router-link(:to="{ path: '/album/1255658593', query: $route.query }")
                li.text-size-1 Album
</template>

<script>
    import Logo from '@/components/logo'

    export default {
        components: {
            'logo': Logo
        }
    }
</script>

<style lang="scss" scoped>
    @media only screen and (max-width : 992px) { li { font-size: 1.3rem; margin: 10px; } }
</style>

