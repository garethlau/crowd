import Vue from 'vue';
import Router from 'vue-router';

import SignupRoute from '@/routes/SignupRoute';
import EmailVerification from '@/routes/EmailVerificationRoute';
import LoginRoute from '@/routes/LoginRoute';
import ResourceRoute from '@/routes/ContentRoute';
import CreateResourceRoute from '@/routes/CreateResourceRoute';
import ProfileRoute from '@/routes/ProfileRoute';
import CourseRoute from '@/routes/CourseRoute';

Vue.use(Router);
import { store } from '../store';
/*
const isLoggedIn = (to, from, next) => {
    if (store.state.user != null) {
        next();
        return;
    }
    next('/login');
};
*/

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
            path: '/signup',
            name: 'Signup',
            component: SignupRoute,
            beforeEnter: isNotLoggedIn
        },
        {
            path: '/verify-email',
            name: 'VertifyEmail',
            component: EmailVerification
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginRoute,
            beforeEnter: isNotLoggedIn
        },
        {
          path: '/login',
          name: 'Login',
          component: LoginRoute
        },
			{
				path: '/resource',
				name: 'Resource',
				component: ResourceRoute
			},
			{
				path: '/resource/create',
				name: "Create Resource",
				component: CreateResourceRoute
			},
			{
            path: '/profile',
            name: 'Profile',
            component: ProfileRoute,
        },
        {
            path: '/:courseCode',
            name: 'CourseRoute',
            component: CourseRoute
        },
    ]
});

/*

for development use
{
            path: '/profile',
            name: 'Profile',
            component: ProfileRoute
        }

so you don't need to log in everytime you refresh
 */
