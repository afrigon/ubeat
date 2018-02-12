import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/home'
import Album from '@/pages/album'
import Artist from '@/pages/artist'
import Playlists from '@/pages/playlists'
import Settings from '@/pages/settings'

Vue.use(Router)

export default new Router({
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
    }]
})
