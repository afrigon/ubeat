import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './script/router'

import Vuex from 'vuex'
import Store from '@/store'
Vue.use(Vuex)
const store = new Vuex.Store(Store)

Vue.config.productionTip = false

new Vue({ // eslint-disable-line no-new
    el: '#app',
    components: { App },
    template: '<App/>',
    store,
    router
})

if (process.env === 'development') {
    require('eventsource-polyfill')
    var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

    hotClient.subscribe(function (event) {
        if (event.action === 'reload') {
            window.location.reload()
        }
    })
}
