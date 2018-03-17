<template lang="pug">
    div#app.body
        header-bar(v-if="!public")
        router-view.margin-up-70
        radio(v-if="!public")
</template>

<script>
    import HeaderBar from '@/components/header-bar'
    import Radio from '@/components/radio'
    
    export default {
        name: 'app',
        components: {
            'header-bar': HeaderBar,
            'radio': Radio
        },
        data: () => ({
            public: null
        }),
        created () {
            this.public = this.$route.meta.public
        },
        watch: {
            $route () {
                this.public = this.$route.meta.public
            }
        }
    }
</script>

<style lang="scss">
    .body { overflow-x: hidden; }

    .submit-button {
        display: block;
        border-radius: 5px;
        padding: 10px 65px;
        margin: 25px auto 15px auto;
    }
</style>
