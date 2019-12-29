import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

import SignupRoute from '@/routes/SignupRoute';
import EmailVerification from '@/routes/EmailVerificationRoute';
import LoginRoute from '@/routes/LoginRoute';

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
        }
    ]
});
