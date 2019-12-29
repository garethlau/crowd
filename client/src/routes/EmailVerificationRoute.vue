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
import AuthService from '../services/AuthService';
const authService = new AuthService();

export default {
    name: 'EmailVerificationRoute',
    data() {
        return {
            code: ''
        };
    },
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
                        this.success(res.data.message);
                        // redirect back to the main page
                        setTimeout(() => {
                            this.$router.push('/');
                        }, 3000);
                    } else {
                        this.danger(res.data.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                    // indicate that something went wrong
                    this.danger('There was an error. Please try again.');
                });
        },
        success(message) {
            this.$buefy.toast.open({
                message: message,
                type: 'is-success'
            });
        },
        danger(message) {
            this.$buefy.toast.open({
                duration: 5000,
                message: message,
                type: 'is-danger'
            });
        }
    }
};
</script>

<style lang="scss">
.card-container {
    width: 60vw; /*can be in percentage also.*/
    height: auto;
    margin: 0 auto;
    padding: 10px;
    position: relative;
}
</style>
