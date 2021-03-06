import Vue from 'vue'
import Router from 'vue-router'
import Auth from '@/script/auth'

import Home from '@/pages/home'
import Album from '@/pages/album'
import Artist from '@/pages/artist'
import User from '@/pages/user'
import Following from '@/pages/following'
import Playlists from '@/pages/playlists'
import Playlist from '@/pages/playlist'

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
        path: '/user/:id',
        name: 'User',
        component: User
    }, {
        path: '/user/:id/friends',
        name: 'Following',
        component: Following
    }, {
        path: '/playlists',
        name: 'Playlists',
        component: Playlists
    }, {
        path: '/playlist/:id',
        name: 'Playlist',
        component: Playlist
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
    }, {
        path: '*',
        redirect: '/'
    }]
})

router.beforeEach(async (to, from, next) => {
    let query = { redirect: to.fullPath }
    if (to.name === 'Logout') {
        Auth.logout()
        return next({ path: '/login' })
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
