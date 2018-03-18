import { Util } from '@/script/fscript'
import {
    TOGGLE_FILTER_FLAGS,
    WILL_UNLOAD, START_RADIO,
    PLAY_SONG,
    STOP_AUDIO_PLAYER,
    RESTORE_RADIO
} from '../mutation-types'

const defaults = {
    filterFlags: 7,
    audioPlayer: {
        isRadio: false,
        trackId: 'default',
        unloadTime: null,
        trackToRestore: null,
        meta: {
            url: null,
            artist: null,
            title: null,
            pictureUrl: null,
            color: '#999999'
        }
    }
}

let stored = window.sessionStorage.getItem('persistent-store')
// clear radio if page was closed and not refreshed (or has peasant internet)
if (stored) {
    try {
        stored = JSON.parse(stored)
    } catch (e) {
        stored = defaults
    }
    if (stored.audioPlayer && (Date.now() - stored.audioPlayer.unloadTime) > 10000) stored.audioPlayer = defaults.audioPlayer
} else {
    stored = defaults
}

const Persistent = {
    state: stored,
    getters: {
        getFilterFlags: state => Util.getBitwiseArray(4).filter((n) => (n & state.filterFlags) !== 0)
    },
    mutations: {
        [TOGGLE_FILTER_FLAGS] (state, value) {
            if ((state.filterFlags & value) !== 0) state.filterFlags &= ~value
            else state.filterFlags |= value
            return window.sessionStorage.setItem('persistent-store', JSON.stringify(state))
        },
        [WILL_UNLOAD] (state) {
            if (state.audioPlayer.isRadio || state.audioPlayer.trackToRestore) state.audioPlayer.unloadTime = Date.now()
            if (state.audioPlayer.trackToRestore) {
                state.audioPlayer.trackId = state.audioPlayer.trackToRestore
                state.audioPlayer.isRadio = true
            }
            return window.sessionStorage.setItem('persistent-store', JSON.stringify(state))
        },
        [START_RADIO] (state, station) {
            state.audioPlayer.isRadio = true
            state.audioPlayer.trackId = station.genre
            state.audioPlayer.meta.color = station.color
            return window.sessionStorage.setItem('persistent-store', JSON.stringify(state))
        },
        [PLAY_SONG] (state, payload) {
            if (state.audioPlayer.isRadio) {
                state.audioPlayer.trackToRestore = state.audioPlayer.trackId
            }

            state.audioPlayer.isRadio = false
            state.audioPlayer.trackId = payload.trackId
            state.audioPlayer.meta.artist = payload.meta.artist
            state.audioPlayer.meta.title = payload.meta.title
            state.audioPlayer.meta.pictureUrl = payload.meta.pictureUrl
            state.audioPlayer.meta.url = payload.url
            return window.sessionStorage.setItem('persistent-store', JSON.stringify(state))
        },
        [STOP_AUDIO_PLAYER] (state) {
            state.audioPlayer.isRadio = false
            state.audioPlayer.trackId = null
            return window.sessionStorage.setItem('persistent-store', JSON.stringify(state))
        },
        [RESTORE_RADIO] (state) {
            state.audioPlayer.trackId = state.audioPlayer.trackToRestore
            state.audioPlayer.trackToRestore = null
            state.audioPlayer.isRadio = true
            return window.sessionStorage.setItem('persistent-store', JSON.stringify(state))
        }
    }
}

export default Persistent
