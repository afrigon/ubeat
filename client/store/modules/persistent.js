import {
    STORE_USER,
    UPDATE_USER,
    FOLLOW_USER,
    UNFOLLOW_USER
} from '../mutation-types'

const defaults = {
    user: {
        id: null,
        name: null,
        email: null,
        following: null
    }
}

let stored = window.localStorage.getItem('persistent-store')
if (stored) {
    try {
        stored = JSON.parse(stored)
    } catch (e) { stored = defaults }
} else {
    stored = defaults
}

const Persistent = {
    state: stored,
    mutations: {
        [STORE_USER] (state, payload) {
            state.user.id = payload.id
            state.user.name = payload.name
            state.user.email = payload.email
            state.user.following = payload.following
            return window.localStorage.setItem('persistent-store', JSON.stringify(state))
        },
        [UPDATE_USER] (state, user) {
            state.user = user
            return window.localStorage.setItem('persistent-store', JSON.stringify(state))
        },
        [FOLLOW_USER] (state, friend) {
            state.user.following.push(friend)
            return window.localStorage.setItem('persistent-store', JSON.stringify(state))
        },
        [UNFOLLOW_USER] (state, id) {
            state.user.following = state.user.following.filter(n => id !== n.id)
            return window.localStorage.setItem('persistent-store', JSON.stringify(state))
        }
    }
}

export default Persistent
