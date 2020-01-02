import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Buefy from 'buefy';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);
Vue.component('font-awesome-icon', FontAwesomeIcon);
// import "buefy/dist/buefy.css";

Vue.config.productionTip = false;
Vue.use(Buefy, {
    defaultIconPack: 'fas'
});

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
    render: h => h(App)
});
