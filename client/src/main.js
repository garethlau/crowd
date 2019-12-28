import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Buefy from "buefy";
// import "buefy/dist/buefy.css";

Vue.config.productionTip = false;
Vue.use(Buefy, {
  defaultIconPack: "fas",
  defaultIconComponent: "vue-fontawesome"
});

new Vue({
  el: "#app",
  router,
  template: "<App/>",
  components: { App },
  render: h => h(App)
});
