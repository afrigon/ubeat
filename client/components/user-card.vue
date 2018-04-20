<template lang="pug">
    div
        img.avatar.hoverable-pop.no-select.circle(:alt="`{{ user.name }} Profile Picture`" :src="getAvatar")
        .text-white.text-size-2 {{ user.name }}
        .text-white.text-center {{ user.email }}
</template>

<script>
    import Api from '@/api'

    export default {
        props: {
            user: Object
        },
        computed: {
            getAvatar () {
                return Api.getGravatar(150, this.user.email)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .avatar
    {
        width: 55%;
    }
</style>
