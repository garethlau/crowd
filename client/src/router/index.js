import Vue from "vue";
import Router from "vue-router";
import SignupRoute from "@/routes/SignupRoute";
import HelloWorld from "@/components/HelloWorld";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Hello",
      component: HelloWorld
    },
    {
      path: "/signup",
      name: "Signup",
      component: SignupRoute
    }
  ]
});
