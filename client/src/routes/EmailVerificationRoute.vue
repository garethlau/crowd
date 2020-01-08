<template>
    <div class="container">
        <div class="card-container">
            <b-field label="Verification Code">
                <b-input v-model="code" @input="handleChange()"></b-input>
            </b-field>
            <div class="buttons">
                <b-button type="is-primary" v-on:click="submit()"
                    >Verify</b-button
                >
            </div>
        </div>
    </div>
</template>

<script>
import notificationMixin from '../mixins/notificationMixin';
import AuthService from '../services/AuthService';
const authService = new AuthService();

export default {
    name: 'EmailVerificationRoute',
    data() {
        return {
            code: ''
        };
    },
    mixins: [notificationMixin],
    methods: {
        handleChange() {
            console.log(this.code);
        },
        submit() {
            console.log('Submitting code: ', this.code);
            authService
                .verify(this.code)
                .then(res => {
                    console.log(res);
                    // check if verification was successful
                    if (res.data.message == 'User verified.') {
                        // indicate to the user that their account has been verified
                        this.toast(res.data.message, 'is-success', 2000);
                        // redirect back to the main page
                        setTimeout(() => {
                            this.$router.push('/');
                        }, 3000);
                    } else {
                        this.toast(res.data.message, 'is-danger', 3000);
                    }
                })
                .catch(err => {
                    console.log(err);
                    // indicate that something went wrong
                    this.toast(
                        'There was an error. Please try again.',
                        'is-danger',
                        3000
                    );
                });
        }
    }
};
</script>

<style lang="scss">
@import '../styles/views/emailVerification.scss';
</style>
