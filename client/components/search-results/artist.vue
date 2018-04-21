<template lang="pug">
    router-link.inline-block.text-center.text-white.text-size-2.artist(:to="{ path: `/artist/${id}` }")
        .artist-icon
            i.material-icons.xl account_circle
        p.truncate {{ name }}
</template>

<script>
    export default {
        props: [ 'id', 'name' ]
    }
</script>

<style lang="scss" scoped>
    .artist {
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
    i {
        font-size: 70px;
    }
</style>

