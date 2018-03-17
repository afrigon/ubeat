<template lang="pug">
    main.primary-dark.no-scroll.flex.flex-center.flex-vertical
        #auth-background.background
        .wrapper
            .section.text-center.text-white.padding-0.margin-down-100
                .row.margin-0(v-if="signup")
                    h1.text-size-7.margin-0.text-regular Create an account
                    h2.text-size-2.margin-10.text-regular Make a good life choice for once

                .row.margin-0(v-else)
                    h1.text-size-7.margin-0.text-regular Good music this way!
                    h2.text-size-2.margin-10.text-regular Login and find YOUR beat
            form#auth-form.box.dark(:class="signup ? 'signup' : 'login'")
                logo.logo-login.dark
                .input-wrapper(v-if="signup")
                    input(type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="name" id="name")
                    label(for="name") Name

                .input-wrapper
                    input(type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="email" id="email")
                    label(for="email") Email

                .input-wrapper
                    input(type="password" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="password" id="password")
                    label(for="password") Password

                .input-wrapper(v-if="signup")
                    input(type="password" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="confirm" id="confirm")
                    label(for="confirm") Confirm Password

                div(v-if="signup")
                    input.primary.text-white.submit-button(type="submit" value="Sign up")
                    router-link.text-primary-light(:to="{ path: '/login', query: $route.query }") Already have an account?

                div(v-else)
                    input.primary.text-white.submit-button(type="submit" value="Login")
                    router-link.text-primary-light(:to="{ path: '/signup', query: $route.query }") Create an account
</template>

<script>
    import Logo from '@/components/logo'
    import Api from '@/api'
    import { FScript, Toast, MaterialInput, Util } from '@/script/fscript'

    export default {
        data: () => ({
            signup: null,
            toast: new Toast(),
            background: {
                beta: null,
                gamma: null,
                x: 0,
                y: 0
            }
        }),
        components: {
            'logo': Logo
        },
        watch: {
            '$route' () {
                this.signup = this.$route.name !== 'Login'
                setTimeout(() => {
                    if (!this.signup) {
                        document.getElementById('email').value = window.localStorage.getItem('email')
                        document.getElementById('password').value = window.localStorage.getItem('password')
                    } else {
                        document.getElementById('email').value = ''
                        document.getElementById('password').value = ''
                    }
                    FScript.addComponent(new MaterialInput())
                }, 100)
            }
        },
        created () {
            this.signup = this.$route.name !== 'Login'
        },
        mounted () {
            if (!this.signup) {
                document.getElementById('email').value = window.localStorage.getItem('email')
            } else {
                document.getElementById('email').value = ''
            }
            FScript.addComponent(new MaterialInput())
            if (window.DeviceOrientationEvent && Util.isTouch()) {
                window.addEventListener('deviceorientation', (event) => {
                    const gamma = (Util.clamp(event.gamma, -90, 90) + 90) * 200 / 180
                    const beta = Util.clamp(event.beta, -50, 150) + 50

                    if (!this.background.gamma || !this.background.beta) {
                        this.background.gamma = gamma
                        this.background.beta = beta
                    }

                    const deltaX = this.background.gamma - gamma
                    const deltaY = this.background.beta - beta

                    this.background.gamma = gamma
                    this.background.beta = beta

                    const translateX = Util.clamp((this.background.x - deltaX / 10), -4, 4)
                    const translateY = Util.clamp((this.background.y - deltaY / 10), -4, 4)

                    this.background.x = translateX
                    this.background.y = translateY

                    const background = document.getElementById('auth-background')
                    return background && (background.style.transform = `scale(1.1) translate(${translateX}%, ${translateY}%)`)
                })
            } else {
                window.addEventListener('mousemove', (event) => {
                    const translateX = event.clientX * 2 / window.innerWidth - 1
                    const translateY = event.clientY * 2 / window.innerHeight - 1
                    const background = document.getElementById('auth-background')
                    return background && (background.style.transform = `scale(1.1) translate(${translateX}%, ${translateY}%)`)
                })
            }

            const form = document.getElementById('auth-form')
            form && form.addEventListener('submit', (event) => {
                event.preventDefault()

                const email = document.getElementById('email')
                email && window.localStorage.setItem('email', email.value)

                const name = document.getElementById('name')
                name && window.localStorage.setItem('name', name.value)

                if (this.signup) {
                    return this.register(form)
                }

                return this.login(form)
            })
        },
        methods: {
            async login (form) {
                const email = document.getElementById('email').value.toLowerCase()
                const password = document.getElementById('password').value
                if (!email || !password) {
                    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
                    return this.toast.show('Error', 'Email and password don\'t match any of our records', { type: 'error' })
                }

                try {
                    const data = await Api.login(email, password)
                    if (data) {
                        if (data.token) window.localStorage.setItem('access_token', data.token)
                        if (data.name) window.localStorage.setItem('name', data.name)
                    }
                    return this.$router.push(this.$route.query.redirect || '/')
                } catch (err) {
                    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
                    return this.toast.show('Error', 'Email and password don\'t match any of our records', { type: 'error' })
                }
            },
            async register () {
                let error = false
                const name = document.getElementById('name').value
                if (!name) {
                    error = true
                    this.toast.show('Error', 'A valid name must be provided', { type: 'error' })
                }

                const email = document.getElementById('email').value.toLowerCase()
                const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                if (!email || !emailRegex.test(email)) {
                    error = true
                    this.toast.show('Error', 'A valid email adress must be provided', { type: 'error' })
                }

                const password = document.getElementById('password').value
                if (!password) {
                    error = true
                    this.toast.show('Error', 'A password must be provided', { type: 'error' })
                }

                const confirm = document.getElementById('confirm').value
                if (!confirm || password !== confirm) {
                    error = true
                    this.toast.show('Error', 'Password confirmation must be the same as password', { type: 'error' })
                }

                if (error) return window.scroll({ top: 0, left: 0, behavior: 'smooth' })
                try {
                    const data = await Api.register(email, name, password)
                    if (data) {
                        if (data.token) window.localStorage.setItem('access_token', data.token)
                        if (data.name) window.localStorage.setItem('name', data.name)
                    }
                    return this.$router.push(this.$route.query.redirect || '/')
                } catch (err) {
                    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
                    return this.toast.show('Error', 'Could not create account, try again later', { type: 'error' })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    main {
        position: relative;
        overflow: hidden;
        height: 100vh;
        width: 100vw;
        box-sizing: border-box;
    }

    .background {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background-image: url('/static/img/login.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        display: inline-block;
        transform-origin: 50% 50%;
        transform: scale(1.1);
        will-change: transform;
        background-color: #a797c4;
    }

    @media only screen and (max-width : 600px) {
        main { justify-content: flex-start; overflow-y: scroll; }
        .wrapper { margin: 50px auto; }
    }

    .logo-login {
        width: 64px;
        border-radius: 50%;
        left: 50%;
        top: -57px;
        padding: 30px;
        margin-left: -62px;
        box-sizing: content-box;
        position: absolute;
    }

    .wrapper, .box { position: relative; }

    .box {
        transition: 300ms max-width ease-out;
        width: 90vw;
        padding: 30px;
        border-radius: 10px;
        box-sizing: border-box;
        text-align: center;
        max-width: 500px;
        margin: auto;
    }
</style>
