<template>
    <div class="container">
        <div class="columns">
            <div class="column">
                <section>
                    <b-field
                        label="Email"
                        :type="emailStatus"
                        :message="emailMessage"
                    >
                        <b-input v-model="email"></b-input>
                    </b-field>
                    <b-field
                        label="Password"
                        :type="passwordStatus"
                        :message="passwordMessage"
                    >
                        <b-input v-model="password"></b-input>
                    </b-field>
                </section>
                <div class="buttons">
                    <b-button type="is-primary" expanded v-on:click="login"
                        >Login</b-button
                    >
                </div>
            </div>
            <div class="column"></div>
        </div>
    </div>
</template>

<script>
import AuthService from '../services/AuthService';
const authService = new AuthService();
import { store } from '../store';

export default {
    name: 'LoginRoute',
    data() {
        return {
            email: '',
            emailStatus: '',
            emailMessage: '',
            password: '',
            passwordStatus: '',
            passwordMessage: '',
            storeState: store.state
        };
    },
    methods: {
        login() {
            console.log(this.email, this.password);
            const data = {
                email: this.email,
                password: this.password
            };
            authService
                .login(data)
                .then(res => {
                    if (res.data.message == 'User does not exist.') {
                        this.toast(res.data.message, 'is-danger', 3000);
                    } else if (res.data.message == 'Incorrect password.') {
                        this.danger(res.data.message, 'is-danger', 3000);
                    } else {
                        // res.data.message = "Logged in."
                        this.toast(res.data.message, 'is-success', 2000);
                        store.setUser(res.data.user);
                        setTimeout(() => {
                            this.$router.push('/');
                        }, 1000);
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.danger('There was an error. Please try again later.');
                });
        },
        toast(message, type, duration) {
            this.$buefy.toast.open({
                message: message,
                duration: duration,
                type: type
            });
        },

    }
};
</script>
