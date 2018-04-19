<template lang="pug">
    main.dark.no-scroll
        error(:message="error" v-if="error")
        loading(v-if="loading" color="#b29adb")
        .section
            .absolute.action.action-left
                button.text-button.transparent.text-primary-light(@click="back") Return
            .row
                .column.s12
                    user-sidebar(:key="targetUser.id" :user="targetUser")
                    .column.s12.l9.padding-0
                        .container.margin-up-30
                            h1.text-white.text-size-3.text-light.text-center Friends ({{ targetUser.following.length }})
                            .section
                                .row.text-center
                                    i.text-white.text-size-2(v-if="targetUser.following.length === 0") This user is antisocial and does not have any friends.
                                    user-card.user-card.clickable(v-else v-for="followingUser in targetUser.following" :key="followingUser.id" :user="followingUser" @click.native="() => selectFollowingUser (followingUser.id)")

</template>

<script>
    // 5aaaad66d85c31000414d68a Frigon
    // 5aac54dba6d6b600042f3082 Sam
    import UserSidebar from '@/components/user-sidebar'
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'
    import UserCard from '@/components/user-card'

    import {UserApi} from '@/api'

    export default {
        components: {
            'error': ErrorBox,
            'loading': Loading,
            'user-card': UserCard,
            'user-sidebar': UserSidebar
        },
        data: () => ({
            targetUser: {
                id: null,
                name: null,
                email: null,
                following: []
            },
            error: null,
            loading: null
        }),
        beforeRouteEnter (to, from, next) {
            try {
                return next(async vm => {
                    const user = await UserApi.getUser(to.params.id)
                    vm.setData(user)
                })
            } catch (err) {
                return next(vm => vm.setData(null))
            }
        },
        async beforeRouteUpdate (to, from, next) {
            try {
                const user = await UserApi.getUser(to.params.id)
                return this.setData(user) & next()
            } catch (err) {
                return this.setData(null) & next()
            }
        },
        beforeRouteLeave (to, from, next) {
            this.loading = true
            return next()
        },
        methods: {
            back () {
                return this.$router.go(-1)
            },
            setData (data) {
                this.loading = false
                if (!data) {
                    this.targetUser = null
                    return (this.error = 'An error occured while fetching data for this user.')
                }

                this.error = null
                this.targetUser = data
            },
            selectFollowingUser (id) {
                this.$router.push({path: `/user/${id}`})
            }
        }
    }
</script>

<style lang="scss" scoped>
    .action {
        top: 90px;
        button {
            padding: 5px 0;
            text-align: center;
            width: 75px;
            font-weight: 200;
            font-size: 1.32rem;
        }
        .text-button {
            text-shadow: 0px 0px 8px #555555
        }
        .full-button {
            border-radius: 13px;
            background-color: #484156;
            padding: 0;
            line-height: 31px;
        }
    }

    .action-left {
        left: 32px;
    }

    .user-card {
        vertical-align: top;
        display: inline-block;
        margin: 15px;
        width: 150px;
        height: 150px;
        margin-bottom: 40px;
    }

    .following-profile-image {
        width: 75%;
    }

    @media only screen and (max-width: 600px) {
        .following-profile-image {
            width: 60%;
        }
    }
</style>
