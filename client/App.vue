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

    .input-error {
        input:not([type]),
        input[type=text]:not(.browser-default),
        input[type=password]:not(.browser-default),
        input[type=email]:not(.browser-default),
        input[type=url]:not(.browser-default),
        input[type=time]:not(.browser-default),
        input[type=date]:not(.browser-default),
        input[type=datetime]:not(.browser-default),
        input[type=datetime-local]:not(.browser-default),
        input[type=tel]:not(.browser-default),
        input[type=number]:not(.browser-default),
        input[type=search]:not(.browser-default),
        textarea:not(.browser-default),
        input:not([type]):focus:not([readonly]),
        input[type=text]:not(.browser-default):focus:not([readonly]),
        input[type=password]:not(.browser-default):focus:not([readonly]),
        input[type=email]:not(.browser-default):focus:not([readonly]),
        input[type=url]:not(.browser-default):focus:not([readonly]),
        input[type=time]:not(.browser-default):focus:not([readonly]),
        input[type=date]:not(.browser-default):focus:not([readonly]),
        input[type=datetime]:not(.browser-default):focus:not([readonly]),
        input[type=datetime-local]:not(.browser-default):focus:not([readonly]),
        input[type=tel]:not(.browser-default):focus:not([readonly]),
        input[type=number]:not(.browser-default):focus:not([readonly]),
        input[type=search]:not(.browser-default):focus:not([readonly]),
        textarea:not(.browser-default):focus:not([readonly]) {
            border-bottom-color: #c64d47;
        }

        .input-error-message {
            color: #c64d47;
            font-weight: 400;
        }
    }
</style>
