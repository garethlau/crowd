<template>
    <b-navbar>
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
                <div class="buttons" v-if="!this.user._id">
                    <router-link :to="{ path: '/signup' }">
                        <a class="button is-primary">
                            <strong>Sign up</strong>
                        </a>
                    </router-link>

                    <router-link :to="{ path: '/login' }">
                        <a class="button is-light">
                            Log in
                        </a>
                    </router-link>
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
                                    this.user.firstName
                                        .charAt(0)
                                        .toUpperCase() +
                                        this.user.firstName.slice(1) +
                                        ' ' +
                                        this.user.lastName
                                            .charAt(0)
                                            .toUpperCase() +
                                        this.user.lastName.slice(1)
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
import AuthService from '../services/AuthService';
const authService = new AuthService();

export default {
    name: 'Navbar',
    props: ['theme'],
    data() {
        return {
            navigation: 'profile',
            user: {}
        };
    },
    mounted() {
        authService
            .isAuth()
            .then(res => {
                // console.log('res in isAuth is');
                // console.log(res);
                this.user = res.data.user;
            })
            .catch(err => {
                console.log(err);
                this.user = {};
            });
    },
    watch: {
        $route() {
            authService
                .isAuth()
                .then(res => {
                    // console.log('res in isAuth is');
                    // console.log(res);
                    this.user = res.data.user;
                })
                .catch(err => {
                    console.log(err);
                    this.user = {};
                });
        }
    },
    methods: {
        logout() {
            authService
                .logout()
                .then(res => {
                    console.log(res);
                    this.user = {};
                    this.toast('Logged out.', 'is-success', 2000);
                })
                .catch(err => {
                    console.log(err);
                    this.toast('Error logging out.', 'is-danger', 3000);
                });
        },
        toast(message, type, duration) {
            this.$buefy.toast.open({
                message: message,
                duration: duration,
                type: type
            });
        }
    }
};
</script>

<style lang="scss"></style>
