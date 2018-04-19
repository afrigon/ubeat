<template lang="pug">
    .column.s12.l3.text-center(v-if="user.name")
        loading(v-if="loading" color="#b29adb")
        .column.s12.m12.l12.padding-0.relative
            img.hoverable-pop.no-select.circle(:alt="`{{ user.name }} Profile Picture`" :src="getAvatar")
            .row
                p.text-white.text-center.text-size-2.margin-0 {{ user.name }}
                p.text-white.text-center.margin-0 {{ user.email }}
            .row
                .text-white.clickable(@click="showFollowing")
                    i.material-icons list
                    span.icon-text {{ user.following ? user.following.length : null }} friend(s)
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
    import Loading from '@/components/loading'

    export default {
        components: {
            'loading': Loading
        },
        props: {
            user: Object
        },
        data: () => ({
            avatar: null,
            isFollowed: null,
            loading: null
        }),
        computed: {
            getAvatar () {
                return this.avatar
            }
        },
        methods: {
            async follow () {
                this.loading = true
                try {
                    await UserApi.followUser(this.user.id)
                    this.error = null
                    this.isFollowed = true
                } catch (err) { this.error = 'An error occured while following this user.' }
                this.loading = false
            },
            async unfollow () {
                this.loading = true
                try {
                    await UserApi.unfollowUser(this.user.id)
                    this.error = null
                    this.isFollowed = false
                } catch (err) { this.error = 'An error occured while following this user.' }
                this.loading = false
            },
            showFollowing () {
                this.$router.push({ path: `/user/${this.user.id}/friends` })
            }
        },
        async created () {
            this.avatar = Api.getGravatar(150, this.user.email)
            this.isFollowed = await UserApi.isFollowing(this.user.id)
        }
    }
</script>

<style lang="scss" scoped>

</style>
