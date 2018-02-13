import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/auth'

import Home from '@/pages/home'
import Album from '@/pages/album'
import Artist from '@/pages/artist'
import Playlists from '@/pages/playlists'
import Settings from '@/pages/settings'

import Login from '@/pages/login'
import Signup from '@/pages/signup'

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
        component: Signup,
        meta: { public: true }
    }]
})

router.beforeEach((to, from, next) => {
    if (to.meta.public) return next()
    if (Auth.checkAuth()) return next()
    return next({
        path: '/login',
        query: { redirect: to.fullPath }
    })
})

export default router
