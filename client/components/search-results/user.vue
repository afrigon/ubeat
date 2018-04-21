<template lang="pug">
    router-link.inline-block.text-center.text-white.text-size-2.user(:to="{ path: `/user/${id}` }")
        img.user-picture.circle(:src="pictureUrl" alt="Profile Picture")
        p.truncate {{ name }}
</template>

<script>
    export default {
        props: [ 'id', 'name', 'email', 'pictureUrl' ]
    }
</script>

<style lang="scss" scoped>
    .user {
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
