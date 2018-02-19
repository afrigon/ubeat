<template lang="pug">
    main.primary-dark.no-scroll.flex.flex-center.flex-vertical.auth-main
        #auth-background
        .wrapper
            .section.text-center.text-white.padding-0.margin-down-100
                .row.margin-0(v-if="signup")
                    h1.text-size-7.margin-0.text-regular Create an account
                    h2.text-size-2.margin-10.text-regular Make a good life choice for once

                .row.margin-0(v-else)
                    h1.text-size-7.margin-0.text-regular Good music this way!
                    h2.text-size-2.margin-10.text-regular Login and find YOUR beat
            form#auth-form.box.dark(v-bind:class="signup ? 'signup' : 'login'")
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
                    input.primary.text-white.button(type="submit" value="Sign up")
                    router-link.text-primary-light(:to="{ path: '/login', query: $route.query }") Already have an account?

                div(v-else)
                    input.primary.text-white.button(type="submit" value="Login")
                    router-link.text-primary-light(:to="{ path: '/signup', query: $route.query }") Create an account
</template>

<script>
    import Logo from '@/components/logo'
    
    export default {
        data: () => ({
            signup: null,
            toast: new Toast() // eslint-disable-line no-undef
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
                    } else {
                        document.getElementById('email').value = ''
                    }
                    FS.addComponent(new MaterialInput())
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
            FS.addComponent(new MaterialInput())
            window.addEventListener('mousemove', (event) => {
                const translateX = event.clientX * 2 / window.innerWidth - 1
                const translateY = event.clientY * 2 / window.innerHeight - 1
                const background = document.getElementById('auth-background')
                return background && (background.style.transform = `scale(1.1) translate(${translateX}%, ${translateY}%)`)
            })

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
            login (form) {
                const email = document.getElementById('email').value.toLowerCase()
                const password = document.getElementById('password').value
                if (!email || !password) {
                    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
                    return this.toast.show('Error', 'Email and password don\'t match any of our records', { type: 'error' })
                }

                Util.requestJSON('/api/login', {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    method: 'POST',
                    body: new URLSearchParams(new FormData(form))
                }, (err, data) => {
                    if (err || !data || !data.token) {
                        window.scroll({ top: 0, left: 0, behavior: 'smooth' })
                        return this.toast.show('Error', 'Email and password don\'t match any of our records', { type: 'error' })
                    }
                    if (data.name) window.localStorage.setItem('name', data.name)
                    window.localStorage.setItem('access_token', data.token)
                    return this.$router.push(this.$route.query.redirect || '/')
                })
            },
            register () {
                let params = new URLSearchParams()
                let error = false
                const name = document.getElementById('name').value
                if (!name) {
                    error = true
                    this.toast.show('Error', 'A valid name must be provided', { type: 'error' })
                } else {
                    params.append('name', name)
                }

                const email = document.getElementById('email').value.toLowerCase()
                const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                if (!email || !emailRegex.test(email)) {
                    error = true
                    this.toast.show('Error', 'A valid email adress must be provided', { type: 'error' })
                } else {
                    params.append('email', email)
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
                } else {
                    params.append('password', password)
                }

                if (error) return window.scroll({ top: 0, left: 0, behavior: 'smooth' })
                Util.requestJSON('/api/signup', {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    method: 'POST',
                    body: params
                }, (err, data) => {
                    if (err) {
                        window.scroll({ top: 0, left: 0, behavior: 'smooth' })
                        return this.toast.show('Error', 'Could not create account, try again later', { type: 'error' })
                    }

                    Util.requestJSON('/api/login', {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        method: 'POST',
                        body: params
                    }, (err, data) => {
                        if (err || !data || !data.token) {
                            window.scroll({ top: 0, left: 0, behavior: 'smooth' })
                            this.toast.show('Error', 'Could not login after account creation for some obscure reason', { type: 'error' })
                            return this.$router.push('/login')
                        }
                        window.localStorage.setItem('access_token', data.token)
                        return this.$router.push(this.$route.query.redirect || '/')
                    })
                })
            }
        }
    }
</script>

<style lang="scss">
    .auth-main {
        position: relative;
        overflow: hidden;
        height: 100vh;
        width: 100vw;
        box-sizing: border-box;
    }

    #auth-background {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background-image: url('/static/img/login.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        display: inline-block;
        transform-origin: 50% 50%;
        transform: scale(1.1);
        will-change: transform;
    }

    @media only screen and (max-width : 600px) {
        .auth-main { justify-content: flex-start; overflow-y: scroll; }
        .wrapper { margin: 50px auto; }
        #auth-background { transform: scale(1) translate(0, 0) !important; }
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
    .button {
        display: block;
        border-radius: 5px;
        padding: 10px 65px;
        margin: 25px auto 15px auto;
    }
</style>
