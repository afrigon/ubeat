import {
    SET_PLAYLIST_NAME,
    PREPARE_SONG_FOR_INSERT,
    CREATE_PLAYLIST
} from '../mutation-types'

const Temp = {
    state: {
        playlistName: '',
        songs: null,
        newPlaylistName: null
    },
    mutations: {
        [SET_PLAYLIST_NAME] (state, name) {
            state.playlistName = name
        },
        [PREPARE_SONG_FOR_INSERT] (state, songs) {
            state.songs = songs
        },
        [CREATE_PLAYLIST] (state, name) {
            state.newPlaylistName = name
        }
    }
}

export default Temp
