import { SET_PLAYLIST_NAME, PREPARE_SONG_FOR_INSERT } from '../mutation-types'

const Temp = {
    state: {
        playlistName: '',
        songs: null
    },
    mutations: {
        [SET_PLAYLIST_NAME] (state, name) {
            state.playlistName = name
        },
        [PREPARE_SONG_FOR_INSERT] (state, songs) {
            state.songs = songs
        }
    }
}

export default Temp
