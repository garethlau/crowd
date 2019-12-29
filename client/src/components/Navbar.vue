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
                <div class="buttons" v-if="storeState.user == null">
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
                    <a class="button is-light" v-on:click="logout">Logout</a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
import { store } from '../store';
import AuthService from '../services/AuthService';
const authService = new AuthService();

export default {
    name: 'Navbar',
    props: ['theme'],
    data() {
        return {
            storeState: store.state
        };
    },
    methods: {
        logout() {
            authService
                .logout()
                .then(res => {
                    console.log(res);
                    this.toast('Logged out.', 'is-success');
                    store.clearUser();
                })
                .catch(err => {
                    console.log(err);
                    this.toast('Error logging out.', 'is-danger');
                });
        },
        toast(message, type) {
            this.$buefy.toast.open({
                message: message,
                type: type
            });
        }
    }
};
</script>
