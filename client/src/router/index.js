import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

import SignupRoute from '@/routes/SignupRoute';
import EmailVerification from '@/routes/EmailVerificationRoute';
import LoginRoute from '@/routes/LoginRoute';
import ContentRoute from '@/routes/ContentRoute';
import CreateResourceRoute from '@/routes/CreateResourceRoute';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Hello',
            component: HelloWorld
        },
        {
            path: '/signup',
            name: 'Signup',
            component: SignupRoute
        },
        {
          path: '/verify-email',
          name: 'VertifyEmail',
          component: EmailVerification
        },
        {
          path: '/login',
          name: 'Login',
          component: LoginRoute
        },
			{
				path: '/content',
				name: 'Content',
				component: ContentRoute
			},
			{
				path: '/content/create',
				name: "Create Resource",
				component: CreateResourceRoute
			}

    ]
});
