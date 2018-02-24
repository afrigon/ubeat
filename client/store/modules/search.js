import { TOGGLE_FILTER_FLAGS } from '../mutation-types'
import { Util } from '@/script/fscript'

const Search = {
    state: {
        filterFlags: window.sessionStorage.getItem('search-flags') || 7
    },
    getters: {
        getFilterFlags: state => Util.getBitwiseArray(4).filter((n) => (n & state.filterFlags) !== 0)
    },
    mutations: {
        [TOGGLE_FILTER_FLAGS] (state, payload) {
            if ((state.filterFlags & payload) !== 0) {
                state.filterFlags &= ~payload
            } else {
                state.filterFlags |= payload
            }
            return window.sessionStorage.setItem('search-flags', state.filterFlags)
        }
    }
}

export default Search
