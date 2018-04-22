<template lang="pug">
    main.dark.no-scroll
        error(:message="error" v-if="error")
        loading(v-if="loading" color="#b29adb")

        .section
            .row
                .column.s12(v-if="targetUser")
                    user-sidebar(:id="targetUser.id" :name="targetUser.name" :email="targetUser.email" :following="targetUser.following")
                    .column.s12.l9.padding-0
                        show-playlist(:user-id="targetUser.id")

</template>

<script>
    import UserSidebar from '@/components/user-sidebar'
    import ShowPlaylist from '@/components/show-playlist'
    import ErrorBox from '@/components/error'
    import Loading from '@/components/loading'

    import { UserApi } from '@/api'

    export default {
        components: {
            'error': ErrorBox,
            'loading': Loading,
            'show-playlist': ShowPlaylist,
            'user-sidebar': UserSidebar
        },
        data: () => ({
            targetUser: null,
            error: null,
            loading: null
        }),
        beforeRouteEnter (to, from, next) {
            try {
                return next(async vm => {
                    const user = await UserApi.getUser(to.params.id)
                    vm.setData(user)
                })
            } catch (err) { return next(vm => vm.setData(null)) }
        },
        async beforeRouteUpdate (to, from, next) {
            try {
                const user = await UserApi.getUser(to.params.id)
                return this.setData(user) & next()
            } catch (err) { return this.setData(null) & next() }
        },
        beforeRouteLeave (to, from, next) {
            this.loading = true
            return next()
        },
        methods: {
            async setData (data) {
                this.loading = false
                if (!data) {
                    this.targetUser = null
                    return (this.error = 'An error occured while searching for this user.')
                }

                this.error = null
                this.targetUser = data
            }
        }
    }
</script>
