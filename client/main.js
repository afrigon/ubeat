import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './script/router'
import store from '@/store'

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
