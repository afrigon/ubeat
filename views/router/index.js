import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Album from '@/components/Album'
import Artist from '@/components/Artist'
import Playlists from '@/components/Playlists'
import Settings from '@/components/Settings'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/artist',
        name: 'Artist',
        component: Artist
    }, {
        path: '/album',
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
