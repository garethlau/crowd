<template>
    <b-navbar shadow>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <a class="button is-primary">
                    <strong>
                        {{ this.theme.abreviation }}
                    </strong>
                </a>
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item href="#">
                Home
            </b-navbar-item>
            <b-navbar-item href="#">
                Documentation
            </b-navbar-item>
            <b-navbar-dropdown label="Info">
                <b-navbar-item href="#">
                    About
                </b-navbar-item>
                <b-navbar-item href="#">
                    Contact
                </b-navbar-item>
            </b-navbar-dropdown>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons" v-if="this.user == null">
                    <b-button type="is-primary" @click="goSignup">
                        Sign up
                    </b-button>
                    <b-button type="is-light" @click="goLogin">
                        Log in
                    </b-button>
                </div>
                <div class="buttons" v-else>
                    <div class="navbar-end">
                        <b-dropdown
                            v-model="navigation"
                            position="is-bottom-left"
                            aria-role="menu"
                        >
                            <a class="navbar-item" slot="trigger" role="button">
                                <span>Menu</span>
                                <b-icon
                                    pack="fas"
                                    icon="caret-down"
                                    size="is-small"
                                >
                                </b-icon>
                            </a>

                            <b-dropdown-item custom aria-role="menuitem">
                                Hello,
                                <b>{{
                                    capitalizeFirst(this.user.firstName) +
                                        ' ' +
                                        capitalizeFirst(this.user.lastName)
                                }}</b>
                            </b-dropdown-item>
                            <hr class="dropdown-divider" />
                            <b-dropdown-item
                                value="home"
                                aria-role="menuitem"
                                has-link
                            >
                                <router-link :to="{ path: '/' }">
                                    <b-icon icon="home"></b-icon>
                                    Home
                                </router-link>
                            </b-dropdown-item>
                            <b-dropdown-item
                                value="profile"
                                aria-role="menuitem"
                                has-link
                            >
                                <router-link :to="{ path: '/profile' }">
                                    <b-icon icon="user"></b-icon>
                                    Profile
                                </router-link>
                            </b-dropdown-item>
                            <hr
                                class="dropdown-divider"
                                aria-role="menuitem"
                                v-if="this.user.classes.length != 0"
                            />
                            <b-dropdown-item
                                v-for="(course, index) in this.user.classes"
                                v-bind:key="index"
                                has-link
                            >
                                <router-link :to="{ path: `/${course}` }">
                                    <b-icon icon="book-open"></b-icon>
                                    {{ course }}
                                </router-link>
                            </b-dropdown-item>
                            <hr class="dropdown-divider" aria-role="menuitem" />
                            <b-dropdown-item value="settings" has-link>
                                <router-link :to="{ path: '/settings' }">
                                    <b-icon icon="cog"></b-icon>
                                    Settings
                                </router-link>
                            </b-dropdown-item>
                            <b-dropdown-item
                                value="logout"
                                aria-role="menuitem"
                                v-on:click="logout"
                            >
                                <b-icon icon="sign-out-alt"></b-icon>
                                Logout
                            </b-dropdown-item>
                        </b-dropdown>
                    </div>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
import notificationMixin from '../mixins/notificationMixin';
import stringMixin from '../mixins/stringMixin';
import AuthService from '../services/AuthService';
const authService = new AuthService();

export default {
    name: 'Navbar',
    props: ['theme'],
    data() {
        return {
            navigation: 'profile',
            user: null
        };
    },
    mixins: [notificationMixin, stringMixin],
    mounted() {
        this.checkAuth();
    },
    watch: {
        $route() {
            this.checkAuth();
        }
    },
    methods: {
        goLogin() {
            let current = this.$route.path;
            let url = '/login?redirect=' + current;
            this.$router.push(url);
        },
        goSignup() {
            this.$router.push('/signup');
        },
        logout() {
            authService
                .logout()
                .then(() => {
                    this.user = null;
                    this.toast('Logged out.', 'is-success', 2000);
                })
                .catch(() => {
                    this.toast('Error logging out.', 'is-danger', 3000);
                });
        },
        checkAuth() {
            authService
                .isAuth()
                .then(user => {
                    // console.log('res in isAuth is');
                    // console.log(res);
                    this.user = user;
                })
                .catch(() => {
                    this.user = null;
                });
        }
    }
};
</script>

<style lang="scss">
@import '../styles/global';
</style>
