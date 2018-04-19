<template lang="pug">
    main.dark.no-scroll
        error(:message="error" v-if="error")
        loading(v-if="loading" color="#b29adb")

        .section
            .row
                .column.s12(v-if="targetUser")
                    .column.s12.l3.text-center
                        .column.s12.m6.l12.padding-0.relative
                            img.hoverable-pop.no-select.circle(:alt="`${targetUser.name} Profile Picture`" :src="targetUser.avatar")
                            .row(v-if="targetUser.name")
                                p.text-white.text-center.text-size-2.margin-0 {{ targetUser.name }}
                        .column.s12.m6.l12.padding-0(v-if="targetUser.id !== me.id")
                            .row(v-if="targetUser.isFollowed")
                                .text-white.clickable(@click="unfollow")
                                    i.material-icons remove_circle_outline
                                    span.icon-text Unfollow
                            .row(v-else)
                                .text-white.clickable(@click="follow")
                                    i.material-icons person_add
                                    span.icon-text Follow
                    .column.s12.l9.padding-0
                        show-playlist(:user-id="targetUser.id")

</template>

<script>
    // 5aaaad66d85c31000414d68a
    import ShowPlaylist from '@/components/show-playlist'
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'

    import Api, { UserApi } from '@/api'

    export default {
        components: {
            'error': ErrorBox,
            'loading': Loading,
            'show-playlist': ShowPlaylist
        },
        data: () => ({
            targetUser: null,
            error: null,
            loading: null,
            me: null
        }),
        beforeRouteEnter (to, from, next) {
            try {
                return next(async vm => {
                    vm.setMe()
                    const user = await UserApi.getUser(to.params.id)
                    user.avatar = Api.getGravatar(150, user.email)
                    user.isFollowed = await UserApi.isFollowing(user.id)
                    vm.setData(user)
                })
            } catch (err) { return next(vm => vm.setData(null)) }
        },
        async beforeRouteUpdate (to, from, next) {
            try {
                const user = await UserApi.getUser(to.params.id)
                user.avatar = Api.getGravatar(150, user.email)
                user.isFollowed = UserApi.isFollowing(user.id)
                return this.setData(user) & next()
            } catch (err) { return this.setData(null) & next() }
        },
        beforeRouteLeave (to, from, next) {
            this.loading = true
            return next()
        },
        methods: {
            async setMe () {
                this.me = await UserApi.me()
            },
            setData (data) {
                this.loading = false
                if (!data) {
                    this.targetUser = null
                    return (this.error = 'An error occured while searching for this user.')
                }

                this.error = null
                this.targetUser = data
            },
            async follow () {
                this.loading = true
                try {
                    await UserApi.followUser(this.targetUser.id)
                    this.error = null
                    this.targetUser.isFollowed = true
                } catch (err) { this.error = 'An error occured while following this user.' }
                this.loading = false
            },
            async unfollow () {
                this.loading = true
                try {
                    await UserApi.unfollowUser(this.targetUser.id)
                    this.error = null
                    this.targetUser.isFollowed = false
                } catch (err) { this.error = 'An error occured while following this user.' }
                this.loading = false
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
