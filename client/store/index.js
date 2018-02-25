import Vue from 'vue'
import Vuex from 'vuex'

import Getters from './getters'
import Mutations from './mutations'
import Actions from './actions'
import Modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {},
    getters: Getters,
    mutations: Mutations,
    actions: Actions,
    modules: Modules,
    strict: true
})

export default store
