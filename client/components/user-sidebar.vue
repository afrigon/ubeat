<template lang="pug">
    .column.s12.l3.text-center(v-if="name")
        loading(v-if="loading" color="#b29adb")
        .column.s12.m12.l12.padding-0.relative
            img.hoverable-pop.no-select.circle(alt="Profile Picture" :src="getAvatar")
            .row
                p.text-white.text-center.text-size-2.margin-0.truncate {{ name }}
                p.text-white.text-center.margin-0.truncate(v-if="following") {{ email }}
            .row
                .text-white.clickable(@click="showFollowing" v-if="following")
                    i.material-icons perm_identity
                    span.icon-text {{ following.length }} friend(s)
                span(v-if="selfId !== id")
                    .text-white.clickable(v-if="isFollowed" @click.stop="unfollow")
                        i.material-icons remove_circle_outline
                        span.icon-text Unfollow
                    .text-white.clickable(v-else @click.stop="follow")
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
        props: [ 'id', 'name', 'email', 'following', 'selfId' ],
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
                } catch (err) { this.error = 'An error occured while unfollowing this user.' }
                this.loading = false
            },
            showFollowing () {
                this.$router.push({ path: `/user/${this.id}/friends` })
            }
        },
        async created () {
            if (this.following) this.avatar = Api.getGravatar(150, this.email)
            else this.avatar = Api.getGravatar(60, this.email)
            this.isFollowed = await UserApi.isFollowing(this.id)
        }
    }
</script>
