import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

import SignupRoute from '@/routes/SignupRoute';
import EmailVerification from '@/routes/EmailVerificationRoute';
import LoginRoute from '@/routes/LoginRoute';
import ProfileRoute from '@/routes/ProfileRoute';

Vue.use(Router);
import { store } from '../store';

const isLoggedIn = (to, from, next) => {
    if (store.state.user != null) {
        next(to);
        return;
    }
    next('/login');
};

const isNotLoggedIn = (to, from, next) => {
    if (store.state.user == null) {
        next();
        return;
    }
    next(from);
};

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
            component: SignupRoute,
            beforeEnter: isNotLoggedIn
        },
        {
            path: '/verify-email',
            name: 'VertifyEmail',
            component: EmailVerification,
            beforeEnter: isLoggedIn
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginRoute,
            beforeEnter: isNotLoggedIn
        },
        {
            path: '/profile',
            name: 'Profile',
            component: ProfileRoute
        }
    ]
});
