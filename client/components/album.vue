<template lang="pug">
    div
        router-link.no-hover-decoration(v-if="highlight" :to="{ path: `/album/${id}`, query: $route.query }")
            .column.s12.l6.scroll-animate-router.fadeInRight
                img.center(v-bind:alt="`${title} Album Art`" v-bind:src="pictureUrl")
                h5.text-white.text-thin.text-size-1.truncate.text-center.margin-down-5 {{ title }}
                h6.text-primary-light.text-thin.text-size-small-9.truncate.margin-0.text-center {{ artist }}
        router-link.no-hover-decoration(v-else :to="{ path: `/album/${id}`, query: $route.query }")
            .column.s12.m6.l4.xl3.text-center.scroll-animate-router.fadeInUp
                img.center(v-bind:alt="`${title} Album Art`" v-bind:src="pictureUrl")
                h5.text-white.text-thin.text-size-small-8.truncate.margin-down-5 {{ title }}
                h6.text-primary-light.text-thin.text-size-small-7.truncate.margin-0 {{ artist }}
</template>

<script>
    export default {
        props: ['id', 'title', 'artist', 'pictureUrl', 'highlight']
    }
</script>

<style lang="scss" scoped>
    img { width: 80%; height: auto; }
</style>

