<template>
    <div class="container">
        <div class="columns">
            <div class="column">
                <section>
                    <b-field
                        label="First Name"
                        :type="firstNameStatus"
                        :message="firstNameMessage"
                    >
                        <b-input v-model="firstName"></b-input>
                    </b-field>
                    <b-field
                        label="Last Name"
                        :type="lastNameStatus"
                        :message="lastNameMessage"
                    >
                        <b-input v-model="lastName"></b-input>
                    </b-field>
                    <b-field label="Email" :type="emailStatus">
                        <b-input v-model="email"></b-input>
                    </b-field>
                    <b-field label="Password">
                        <b-input
                            type="password"
                            v-model="password"
                            password-reveal
                        >
                        </b-input>
                    </b-field>
                </section>
                <section>
                    <b-field label="Enter some tags">
                        <b-taginput
                            v-model="classes"
                            :data="filteredClasses"
                            autocomplete
                            :allow-new="allowNew"
                            :open-on-focus="openOnFocus"
                            field="user.first_name"
                            icon="label"
                            placeholder="Add a tag"
                            @typing="getFilteredClasses"
                        >
                            <template slot-scope="props">
                                {{ props.option }}
                            </template>
                            <template slot="empty">
                                There are no items
                            </template>
                        </b-taginput>
                    </b-field>
                </section>
                <div class="buttons">
                    <b-button
                        type="is-primary"
                        expanded
                        v-on:click="createAccount"
                        >Create Account</b-button
                    >
                </div>
            </div>
            <div class="column">
                <h1>img</h1>
            </div>
        </div>
    </div>
</template>

<script>
const data = ['ES1036', 'AM1413', 'AM1411', 'ES1050'];
import AuthService from '../services/AuthService';
import {store} from '../store';
const authService = new AuthService();


export default {
    name: 'SignupRoute',
    components: {},
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            classes: [],
            filteredClasses: [],
            firstNameStatus: '',
            lastNameStatus: '',
            emailStatus: '',
            passwordIsValid: false,
            firstNameMessage: '',
            lastNameMessage: ''
        };
    },
    methods: {
        // get dropdown tags based on current user input
        getFilteredClasses(text) {
            this.filteredClasses = data.filter(option => {
                return option.toLowerCase().indexOf(text.toLowerCase()) >= 0;
            });
        },
        createAccount() {
            // check if the inputs are valid
            this.validateEmail();
            this.validateName();
            if (
                this.firstNameStatus == 'is-danger' ||
                this.lastNameStatus == 'is-danger' ||
                this.emailStatus == 'is-danger'
            ) {
                // one of the fields is incorrect, don't continue
                return;
            }
            let email = this.email.toLowerCase();
            // create user object
            const user = {
                email: email,
                password: this.password,
                firstName: this.firstName,
                lastName: this.lastName,
                classes: this.classes
            };
            console.log(user);
            // signup
            authService
                .signup(user)
                .then(res => {
                    console.log('mesage after signup', res.data.message);
                    if (res.data.message == 'Email already is being used.') {
                        // show an error on the label
                        this.toast(res.data.message, 'is-danger', 3000);
                    } else if (res.data.message == 'Error saving user.') {
                        // an error hapened on our backend
                        this.toast(res.data.message, 'is-danger', 3000);
                    } else {
                        // sign up went well, user needs to verify the email
                        // res.data.message == "User signed up"
                        // indicate to the user that they need to verify their account
                        this.toast(
                            'Account created. Please verify your email.',
                            'is-success',
                            2000
                        );
                        // set the global user
                        console.log("signup user!!!", res.data.user)
                        store.setUser(res.data.user);
                        // redirect
                        setTimeout(() => {
                            this.$router.push('/');
                        }, 1000);
                    }
                })
                .catch(err => {
                    console.log('there was anerr', err);
                    // flash warning
                });
        },
        validateEmail() {
            if (this.email.length == 0 || this.email.indexOf('@') < 0) {
                this.emailStatus = 'is-danger';
            } else {
                this.emailStatus = 'is-success';
            }
        },
        validateName() {
            // validate first name
            if (this.firstName.length == 0) {
                this.firstNameMessage = 'Cannot be blank';
                this.firstNameStatus = 'is-danger';
            } else if (!/^[a-zA-Z]*$/g.test(this.firstName)) {
                this.firstNameMessage = 'Only include characters';
                this.firstNameStatus = 'is-danger';
            } else {
                this.firstNameMessage = '';
                this.firstNameStatus = 'is-success';
            }

            // validate last name
            if (this.lastName.length == 0) {
                this.lastNameMessage = 'Cannot be blank';
                this.lastNameStatus = 'is-danger';
            } else if (!/^[a-zA-Z]*$/g.test(this.lastName)) {
                this.lastNameMessage = 'Only include characters';
                this.lastNameStatus = 'is-danger';
            } else {
                this.lastNameMessage = '';
                this.lastNameStatus = 'is-success';
            }
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
