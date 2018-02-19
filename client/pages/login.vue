<template lang="pug">
    main.primary-dark.no-scroll.flex.flex-center.flex-vertical.login-main
        div
            .section.text-center.text-white.padding-0.margin-down-100
                .row.margin-0
                    h1.text-size-7.margin-0.text-regular Good music this way!
                    h2.text-size-2.margin-10.text-regular Find YOUR beat
            form.login.dark
                logo.logo.dark
                .input-wrapper
                    input(type="text" name="email" id="email")
                    label(for="email") Email

                .input-wrapper
                    input(type="password" name="password" id="password")
                    label(for="password") Password

                input.primary.text-white.login-button(type="submit" value="Login")
                router-link.text-primary-light(:to="{ path: '/signup', query: $route.query }") Create an account
</template>

<script>
    import Logo from '@/components/logo'

    export default {
        components: {
            'logo': Logo
        },
        mounted () {
            FS.addComponent(new MaterialInput())
        }
    }
</script>

<style lang="scss">
    .login-main {
        background-image: url('/static/img/login.jpg');
        background-repeat: no-repeat;
        background-size: cover;
    }

    .logo {
        width: 64px;
        border-radius: 50%;
        left: 50%;
        top: -57px;
        padding: 30px;
        margin-left: -62px;
        box-sizing: content-box;
        position: absolute;
    }

    .login {
        position: relative;
        padding: 30px;
        width: 90vw;
        max-width: 500px;
        border-radius: 10px;
        box-sizing: border-box;
        text-align: center;
    }

    .login-button {
        display: block;
        border-radius: 5px;
        padding: 10px 65px;
        margin: 25px auto 15px auto;
    }
</style>
