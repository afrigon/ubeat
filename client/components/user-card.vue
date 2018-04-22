<template lang="pug">
    .column.s12.l4.text-center(v-if="name")
        loading(v-if="loading" color="#b29adb")
        .column.s12.m12.l12.padding-0.relative
            img.hoverable-pop.no-select.circle(v-if="avatar" alt="Profile Picture" :src="avatar")
            .row
                p.text-white.text-center.text-size-2.margin-0.truncate.width-100 {{ name }}
                p.text-white.text-center.margin-0.truncate.width-100(v-if="following") {{ email }}
            .row
                .text-white.clickable(@click="showFollowing" v-if="following")
                    i.material-icons perm_identity
                    span.icon-text {{ following.length }} following
                span(v-if="self.id !== id")
                    .text-white.clickable(v-if="self && isFollowing" @click.stop="unfollow")
                        i.material-icons remove_circle_outline
                        span.icon-text Unfollow
                    .text-white.clickable(v-else @click.stop="follow")
                        i.material-icons person_add
                        span.icon-text Follow
</template>

<script>
    import { mapState } from 'vuex'
    import Api, { UserApi } from '@/api'
    import Loading from '@/components/loading'
    import { FOLLOW_USER, UNFOLLOW_USER } from '@/store/mutation-types'

    export default {
        components: {
            'loading': Loading
        },
        props: [ 'id', 'name', 'email', 'following' ],
        data: () => ({
            avatar: null,
            loading: null,
            isFollowing: false
        }),
        computed: {
            ...mapState({
                self: state => state.persistent.user
            })
        },
        methods: {
            async follow () {
                this.loading = true
                try {
                    await UserApi.followUser(this.id)
                    this.$store.commit(FOLLOW_USER, { id: this.id, name: this.name, email: this.email })
                    this.error = null
                    this.isFollowing = true
                } catch (err) { this.error = 'An error occured while following this user.' }
                this.loading = false
            },
            async unfollow () {
                this.loading = true
                try {
                    await UserApi.unfollowUser(this.id)
                    this.$store.commit(UNFOLLOW_USER, this.id)
                    this.error = null
                    this.isFollowing = false
                } catch (err) { this.error = 'An error occured while unfollowing this user.' }
                this.loading = false
            },
            showFollowing () {
                this.$router.push({ path: `/user/${this.id}/friends` })
            }
        },
        async mounted () {
            if (this.following) this.avatar = Api.getGravatar(this.email, 150)
            else this.avatar = Api.getGravatar(this.email, 60)
            this.isFollowing = this.self.following.filter(n => n.id === this.id).length > 0
        }
    }
</script>
