<template>
    <div class="main-container">
        <section class="side">
            hi
        </section>
        <section class="main-login">
            <div>
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
            </div>
            <b-button type="is-primary" expanded v-on:click="login"
                >Login</b-button
            >
        </section>
    
    </div>
</template>

<script>
import notificationMixin from '../mixins/notificationMixin';
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
    mixins: [notificationMixin],
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
        }
    }
};
</script>

<style lang="scss" scoped>
.main-container {
    height: calc(100vh - 52px);
    display: flex;
    flex-direction: row;
    overflow: hidden;
}
.main-login {
    width: 60%;
}
.side {
    width: 40%;
}
</style>
