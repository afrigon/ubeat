import Getters from './getters'
import Mutations from './mutations'
import Actions from './actions'
import Modules from './modules'

const Store = {
    state: {},
    getters: Getters,
    mutations: Mutations,
    actions: Actions,
    modules: Modules,
    strict: true
}

export default Store
