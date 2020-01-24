<template>
    <div class="main-container">
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
            <div class="button-container">
                <b-button
                    class="login"
                    type="is-primary"
                    expanded
                    v-on:click="login"
                >
                    Login
                </b-button>
                <router-link :to="{ path: '/password-reset' }">
                    Forgot Password?
                </router-link>
            </div>
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
    created() {
        // add event listener for escape key press
        window.addEventListener('keydown', e => {
            if (e.key == 'Enter') {
                this.login();
            }
        });
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
@import '../styles/global';
@import '../styles/mixins';

.main-container {
    height: calc(100vh - 52px);
    overflow: hidden;
    background: $main-brand;
    background: linear-gradient(198deg, $main-brand 18%, $light-accent 97%);
}
.main-login {
    background-color: $white;
    position: absolute;
    left: 0;
    right: 0;
    top: 52px;
    bottom: 0;
    margin: auto;

    max-width: 100%;
    max-height: 100%;

    padding: 30px 50px 30px 50px;

    @include sm {
        width: 90%;
        height: 55%;
        top: 0;
        border-radius: 15px;
    }
    @include md {
        width: 60%;
        height: 55%;
        top: 0;
        border-radius: 15px;
    }
    @include lg {
        width: 50%;
        height: 55%;
        max-width: 700px;
        top: 0;
        border-radius: 15px;
    }
    @include xl {
        width: 40%;
        height: 55%;
        max-width: 700px;
        top: 0;
        border-radius: 15px;
    }
}
.login {
    margin-bottom: 10px;
}
.button-container {
    margin-top: 15px;
    text-align: center;
}
</style>
