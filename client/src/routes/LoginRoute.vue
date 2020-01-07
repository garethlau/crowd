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
                        <b-input
                            v-model="password"
                            type="password"
                            password-reveal
                        ></b-input>
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
            redirect: ''
        };
    },
    mounted() {
        console.log('inside loginroute');
        console.log(this.$route);
        this.redirect = this.$route.query.redirect;
    },
    methods: {
        login() {
            let email = this.email.toLowerCase();
            console.log(email, this.password);
            authService
                .login(email, this.password)
                .then(res => {
                    // the only case that gets resolved is if the user successfully logs in
                    this.toast(res, 'is-success', 2000);
                    setTimeout(() => {
                        if (!this.redirect) {
                            this.$router.push('/');
                        } else {
                            this.$router.push(this.redirect);
                        }
                    }, 1000);
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
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
