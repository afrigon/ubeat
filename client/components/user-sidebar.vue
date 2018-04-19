<template lang="pug">
    .column.s12.l3.text-center
        .column.s12.m12.l12.padding-0.relative
            img.hoverable-pop.no-select.circle(:alt="`{{ name }} Profile Picture`" :src="getAvatar")
            .row(v-if="name")
                p.text-white.text-center.text-size-2.margin-0 {{ name }}
                p.text-white.text-center.margin-0 {{ email }}
            .row(v-if="isFollowed")
                .text-white.clickable(@click="unfollow")
                    i.material-icons remove_circle_outline
                    span.icon-text Unfollow
            .row(v-else)
                .text-white.clickable(@click="follow")
                    i.material-icons person_add
                    span.icon-text Follow
</template>

<script>
    import Api, { UserApi } from '@/api'

    export default {
        props: {
            id: String,
            name: String,
            email: String
        },
        data: () => ({
            avatar: null,
            isFollowed: null
        }),
        computed: {
            getAvatar () {
                return this.avatar
            },
            async follow () {
                this.loading = true
                try {
                    await UserApi.followUser(this.id)
                    this.error = null
                    this.isFollowed = true
                } catch (err) { this.error = 'An error occured while following this user.' }
                this.loading = false
            },
            async unfollow () {
                this.loading = true
                try {
                    await UserApi.unfollowUser(this.id)
                    this.error = null
                    this.isFollowed = false
                } catch (err) { this.error = 'An error occured while following this user.' }
                this.loading = false
            }
        },
        async created () {
            this.avatar = Api.getGravatar(150, this.email)
            this.isFollowed = await UserApi.isFollowing(this.id)
        }
    }
</script>

<style lang="scss" scoped>

</style>
