import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/auth'

import Home from '@/pages/home'
import Album from '@/pages/album'
import Artist from '@/pages/artist'
import Playlists from '@/pages/playlists'
import Settings from '@/pages/settings'

import Login from '@/pages/login'
// import Signup from '@/pages/signup'

Vue.use(Router)

const router = new Router({
    mode: 'hash',
    routes: [{
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/artist/:id',
        name: 'Artist',
        component: Artist
    }, {
        path: '/album/:id',
        name: 'Album',
        component: Album
    }, {
        path: '/playlists',
        name: 'Playlists',
        component: Playlists
    }, {
        path: '/settings',
        name: 'Settings',
        component: Settings
    }, {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { public: true }
    }, {
        path: '/signup',
        name: 'Signup',
        component: Login,
        meta: { public: true }
    }, {
        path: '/logout',
        name: 'Logout',
        component: Vue.component('logout', {})
    }]
})

router.beforeEach((to, from, next) => {
    let query = { redirect: to.fullPath }
    if (to.name === 'Logout') {
        window.localStorage.removeItem('access_token')
        query = {}
    }

    return Auth.checkAuth((err) => {
        if (err) {
            if (!to.meta.public) return next({ path: '/login', query: query })
        } else {
            if (to.meta.public) return next({ path: '/' })
        }
        return next()
    })
})

export default router
