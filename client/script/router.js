import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/script/auth'

import Home from '@/pages/home'
import Album from '@/pages/album'
import Artist from '@/pages/artist'
import Playlists from '@/pages/playlists'
import Settings from '@/pages/settings'

import AuthPage from '@/pages/auth'

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
        component: AuthPage,
        meta: { public: true }
    }, {
        path: '/signup',
        name: 'Signup',
        component: AuthPage,
        meta: { public: true }
    }, {
        path: '/logout',
        name: 'Logout',
        component: Vue.component('logout', {})
    }]
})

router.beforeEach(async (to, from, next) => {
    let query = { redirect: to.fullPath }
    if (to.name === 'Logout') {
        window.localStorage.removeItem('access_token')
        query = {}
    }

    if (await Auth.checkAuth()) {
        // disallow public paths for authenticated users
        if (to.meta.public) return next({ path: '/' })
    } else {
        // disallow non public paths for unauthenticated users
        if (!to.meta.public) return next({ path: '/login', query: query })
    }
    // all is fine (except my social life)
    return next()
})

export default router
