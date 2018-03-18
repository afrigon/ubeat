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

                transition(name="error-show" appear v-if="submitError")
                    .section.error-wrapper
                        .row.text-white
                            strong.error-title.text-size-2 Error
                            .error.text-size-small-7 {{ submitError }}

                .input-wrapper(v-if="signup" :class="{ 'error': nameError }")
                    input(type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="name" id="name" v-model="name")
                    label(for="name") Name
                    span(v-if="nameError" class="input-message") {{ nameError }}

                .input-wrapper(:class="{ 'error': emailError }")
                    input(type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="email" id="email" v-model="email")
                    label(for="email") Email
                    span(v-if="emailError" class="input-message") {{ emailError }}

                .input-wrapper(:class="{ 'error': passwordError }")
                    input(type="password" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="password" id="password" v-model="password")
                    label(for="password") Password
                    span(v-if="passwordError" class="input-message") {{ passwordError }}

                .input-wrapper(v-if="signup" :class="{ 'error': passwordConfirmationError }")
                    input(type="password" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" name="confirm" id="confirm" v-model="passwordConfirmation")
                    label(for="confirm") Confirm Password
                    span(v-if="passwordConfirmationError" class="input-message") {{ passwordConfirmationError }}

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
            },
            name: null,
            email: null,
            password: null,
            passwordConfirmation: null,
            validatedOnce: null,
            submitError: null
        }),
        components: {
            'logo': Logo
        },
        watch: {
            '$route' () {
                this.validatedOnce = false
                this.submitError = false
                this.signup = this.$route.name !== 'Login'

                this.password = this.signup ? null : window.localStorage.getItem('password')
                this.email = this.signup ? null : window.localStorage.getItem('email')

                setTimeout(() => {
                    FScript.addComponent(new MaterialInput())
                }, 100)
            }
        },
        created () {
            this.signup = this.$route.name !== 'Login'
        },
        mounted () {
            this.email = this.signup ? null : window.localStorage.getItem('email')
            this.password = this.signup ? null : window.localStorage.getItem('password')
            setTimeout(() => {
                FScript.addComponent(new MaterialInput())
            }, 100)

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

                this.email && window.localStorage.setItem('email', this.email)
                this.name && window.localStorage.setItem('name', this.name)

                if (this.signup) {
                    return this.register(form)
                }

                return this.login(form)
            })
        },
        methods: {
            async login (form) {
                if (!this.validateLogin()) return form.scrollIntoView({ behavior: 'smooth' })
                try {
                    const data = await Api.login(this.email.toLowerCase(), this.password)
                    if (data) {
                        if (data.token) window.localStorage.setItem('access_token', data.token)
                        if (data.name) window.localStorage.setItem('name', data.name)
                    }
                    return this.$router.push(this.$route.query.redirect || '/')
                } catch (err) {
                    this.submitError = 'Your email and password combination don\'t match any of our records.'
                    form.scrollIntoView({ behavior: 'smooth' })
                }
            },
            validateLogin () {
                this.validatedOnce = true
                return (!this.emailError && !this.passwordError)
            },
            async register (form) {
                if (!this.validateRegistration()) return form.scrollIntoView({ behavior: 'smooth' })
                try {
                    const data = await Api.register(this.email, this.name, this.password)
                    if (data) {
                        if (data.token) window.localStorage.setItem('access_token', data.token)
                        if (data.name) window.localStorage.setItem('name', data.name)
                    }
                    return this.$router.push(this.$route.query.redirect || '/')
                } catch (err) {
                    this.submitError = 'We could not create account, please try again later.'
                    form.scrollIntoView({ behavior: 'smooth' })
                }
            },
            validateRegistration () {
                this.validatedOnce = true
                return (!this.nameError && !this.emailError && !this.passwordError && !this.passwordConfirmationError)
            }
        },
        computed: {
            nameError () {
                if (this.validatedOnce && !this.name) return 'Your name is required.'
                return null
            },
            emailError () {
                if (this.validatedOnce) {
                    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                    if (!this.email) return 'Your email is required.'
                    if (!emailRegex.test(this.email)) return 'You must provide a valid email.'
                }
                return null
            },
            passwordError () {
                if (this.validatedOnce && !this.password) return 'Your password is required.'
                return null
            },
            passwordConfirmationError () {
                if (this.validatedOnce) {
                    if (!this.passwordConfirmation) return 'You must confirm your password.'
                    if (this.passwordConfirmation !== this.password) return 'Your password confirmation does not match with your password.'
                }
                return null
            }
        }
    }
</script>

<style lang="scss" scoped>
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

    .error-wrapper {
        background-color: #c64d47;
        border-radius: 0 0 4px 4px;
        padding: 10px 30px;
        border: 1px solid #993a35;
        margin: 40px auto 30px;
        text-align: left;
    }

    .error-show-enter-active {
        will-change: transform;
        transition: transform 250ms ease-out;
        transform: translateY(0);
    }

    .error-show-enter {
        transform: translateY(-100%);
    }
</style>
