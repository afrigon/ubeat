<template lang="pug">
    router-link.inline-block.text-center.text-white.text-size-2.album(:to="{ path: `/album/${id}` }")
        img.album-art(:src="pictureUrl" alt="Album Art")
        p.truncate {{ title }}
</template>

<script>
    export default {
        props: [ 'id', 'title', 'pictureUrl' ]
    }
</script>

<style lang="scss" scoped>
    .album {
        width: 200px;
        margin-top: 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
    }
    p {
        display: inline-block;
        margin: 0;
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
    }
</style>
