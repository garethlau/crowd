import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

import SignupRoute from '@/routes/SignupRoute';
import EmailVerification from '@/routes/EmailVerificationRoute';
import LoginRoute from '@/routes/LoginRoute';
import ContentRoute from '@/routes/ContentRoute';
import CreateResourceRoute from '@/routes/CreateResourceRoute';
import ProfileRoute from '@/routes/ProfileRoute';

Vue.use(Router);
import { store } from '../store';

const isLoggedIn = (to, from, next) => {
    if (store.state.user != null) {
        next();
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
            component: EmailVerification
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginRoute,
            beforeEnter: isNotLoggedIn
        },
        {
<<<<<<< HEAD
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

=======
            path: '/profile',
            name: 'Profile',
            component: ProfileRoute,
            beforeEnter: isLoggedIn
        }
>>>>>>> 2fa1a98049e6e861ca9325d60f33a58c92f793ee
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
