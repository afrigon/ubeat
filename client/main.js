import 'babel-polyfill'
import Vue from 'vue'
import App from '@/App'
import router from '@/script/router'

import Vuex from 'vuex'
import Store from '@/store'
Vue.use(Vuex)
const store = new Vuex.Store(Store)

new Vue({ // eslint-disable-line no-new
    el: '#app',
    components: { App },
    template: '<App/>',
    store,
    router
})
