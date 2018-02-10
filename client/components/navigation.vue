<template lang="pug">
    nav.underline-animate.padding-0.margin-0.margin-left-25.margin-right-25.scroll-animate.fadeIn.text-left
        a.block.clickable(href="/#/")
            .logo.scroll-animate.fadeInScale
                logo
        ul.margin-left-5.capitalize.hide-until-m
            router-link(to="/")
                li.text-size-1 Home
            router-link(to="/artist")
                li.text-size-1 Artist
            router-link(to="/album")
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
