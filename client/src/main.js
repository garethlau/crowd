import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";

Vue.config.productionTip = false;
Vue.use(VueRouter);

const Foo = {
	template: "<div> foo </div>"
}

const routes = [
	{path: "/foo", component: Foo}
]

const router = new VueRouter({
	routes
})

new Vue({
  //el: '#app',
  	router,
	render: h=> h(App)
  //components: { App },
  //template: '<App/>'
  }
).$mount("#app")
//new Vue({
//	router,
//	render: h=> h(App)
//}).$mount("#app");
//new Vue({
//  render: h => h(App)
//}).$mount("#app");
