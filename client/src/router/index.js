import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import ContentMainPage from "@/components/ContentMainPage"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Hello",
      component: HelloWorld
    },
		{
			path: "/content",
			name: "ContentMainPage",
			component: ContentMainPage
		}
  ]
});
