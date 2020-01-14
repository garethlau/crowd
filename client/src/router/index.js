import Vue from 'vue';
import Router from 'vue-router';

import SignupRoute from '@/routes/SignupRoute';
import EmailVerification from '@/routes/EmailVerificationRoute';
import LoginRoute from '@/routes/LoginRoute';
import CreateResourceRoute from '@/routes/CreateResourceRoute';
import ProfileRoute from '@/routes/ProfileRoute';
import CourseRoute from '@/routes/CourseRoute';
import PasswordResetRoute from '@/routes/PasswordResetRoute';

import AuthService from '../services/AuthService';
const authService = new AuthService();

Vue.use(Router);

const isLoggedIn = (to, from, next) => {
    const redirectUrl = `/login?redirect=${to.path}`;
    authService
        .isAuth()
        .then(() => {
            next();
            return;
        })
        .catch(() => {
            next(redirectUrl);
        });
};

const isNotLoggedIn = (to, from, next) => {
    authService
        .isAuth()
        .then(() => {
            next(from);
            return;
        })
        .catch(() => {
            next();
        });
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
            path: '/password-reset',
            name: 'PasswordReset',
            component: PasswordResetRoute
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginRoute,
            beforeEnter: isNotLoggedIn
        },
        {
            path: '/resource/create',
            name: 'Create Resource',
            component: CreateResourceRoute,
            beforeEnter: isLoggedIn
        },
        {
            path: '/profile',
            name: 'Profile',
            component: ProfileRoute
        },
        {
            path: '/:courseCode',
            name: 'CourseRoute',
            component: CourseRoute
        }
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
