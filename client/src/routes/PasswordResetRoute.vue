<template>
    <div class="main-container">
        <div class="request form" v-if="token == ''">
            <div class="text-container">
                <p class="title">
                    Forgot your password?
                </p>
                <p>
                    Enter your account email address and we will send you a link
                    to reset your password.
                </p>
            </div>

            <div>
                <b-field
                    :type="emailStatus"
                    :message="emailMessage"
                    v-model="email"
                >
                    <b-input v-model="email" placeholder="Email"></b-input>
                </b-field>
            </div>
            <div class="button-container">
                <b-button
                    expanded
                    @click="requestPasswordReset"
                    type="is-primary"
                >
                    Request Password Reset
                </b-button>
            </div>
        </div>
        <div class="reset form" v-else>
            <div class="text-container">
                <p class="title">
                    Reset Password
                </p>
            </div>
            <div>
                <div>
                    <b-input
                        type="password"
                        password-reveal
                        v-model="newPassword"
                        placeholder="Password"
                    ></b-input>
                </div>
                <div id="confirm-password">
                    <b-field :type="passwordStatus" :message="passwordMessage">
                        <b-input
                            type="password"
                            password-reveal
                            v-model="confirmPassword"
                            placeholder="Confirm Password"
                        ></b-input>
                    </b-field>
                </div>
            </div>
            <div class="button-container">
                <b-button expanded @click="resetPassword" type="is-primary">
                    Reset Password
                </b-button>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from '../services/AuthService';
const authService = new AuthService();
import notificationMixin from '../mixins/notificationMixin';

export default {
    name: 'PasswordResetRoute',
    data() {
        return {
            email: '',
            emailStatus: '',
            emailMessage: '',
            newPassword: '',
            confirmPassword: '',
            passwordStatus: '',
            passwordMessage: '',
            token: ''
        };
    },
    mixins: [notificationMixin],

    methods: {
        requestPasswordReset() {
            authService
                .requestReset(this.email)
                .then(res => {
                    this.toast(res, 'is-success', 2000);
                })
                .catch(err => {
                    this.emailStatus = 'is-danger';
                    this.emailMessage = err;
                    setTimeout(() => {
                        this.emailStatus = '';
                        this.emailMessage = '';
                    }, 5000);
                });
        },
        resetPassword() {
            authService
                .reset(this.token, this.newPassword, this.confirmPassword)
                .then(res => {
                    this.toast(res, 'is-success', 2000);
                    this.newPassword = '';
                    this.confirmPassword = '';
                    this.$router.push('/login');
                })
                .catch(err => {
                    this.passwordStatus = 'is-danger';
                    this.passwordMessage = err;
                    setTimeout(() => {
                        this.passwordStatus = '';
                        this.passwordMessage = '';
                    }, 5000);
                });
        }
    },
    created() {
        if (this.$route.params.token) {
            // they have a token
            this.token = this.$route.params.token;
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
.form {
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
}
.request {
    @include sm {
        width: 90%;
        height: 40%;
        top: 0;
        border-radius: 15px;
    }
    @include md {
        width: 60%;
        height: 40%;
        top: 0;
        border-radius: 15px;
    }
    @include lg {
        width: 50%;
        height: 40%;
        max-width: 700px;
        top: 0;
        border-radius: 15px;
    }
    @include xl {
        width: 40%;
        height: 40%;
        max-width: 700px;
        top: 0;
        border-radius: 15px;
    }
}
.reset {
    @include sm {
        width: 90%;
        height: 40%;
        top: 0;
        border-radius: 15px;
    }
    @include md {
        width: 60%;
        height: 40%;
        top: 0;
        border-radius: 15px;
    }
    @include lg {
        width: 50%;
        height: 40%;
        max-width: 700px;
        top: 0;
        border-radius: 15px;
    }
    @include xl {
        width: 40%;
        height: 40%;
        max-width: 700px;
        top: 0;
        border-radius: 15px;
    }
}
.button-container {
    margin-top: 15px;
}
.text-container {
    text-align: center;
    margin-bottom: 15px;
}
#confirm-password {
    margin-top: 15px;
}
</style>
