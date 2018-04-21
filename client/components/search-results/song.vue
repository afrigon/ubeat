<template lang="pug">
    router-link.inline-block.text-center.text-white.text-size-2.song(:to="{ path: `/album/${albumId}` }")
        img.song-art(:src="pictureUrl" alt="Album Art")
        p.truncate {{ name }}
</template>

<script>
    export default {
        props: [ 'id', 'albumId', 'name', 'pictureUrl' ]
    }
</script>

<style lang="scss" scoped>
    .song {
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