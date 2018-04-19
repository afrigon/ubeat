<template lang="pug">
    div
        img.avatar.hoverable-pop.no-select.circle(:alt="`{{name}} Profile Picture`" :src="getAvatar")
        .text-white {{name}}
</template>

<script>
    import Api from '@/api'

    export default {
        props: {
            name: String,
            email: String
        },
        computed: {
            getAvatar () {
                return Api.getGravatar(150, this.email)
            }
        }
    }
</script>

<style lang="scss" scoped>

    .avatar
    {
        width: 75%;
    }

    @media only screen and (max-width: 600px) {
        .avatar
        {
            width: 60%;
        }
    }
</style>
