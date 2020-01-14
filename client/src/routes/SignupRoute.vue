<template>
    <div class="main-container">
        <div class="form">
            <section>
                <div class="level">
                    <div class="level-left">
                        <b-field
                            label="First Name"
                            :type="firstNameStatus"
                            :message="firstNameMessage"
                        >
                            <b-input v-model="firstName"></b-input>
                        </b-field>
                    </div>
                    <div class="level-right">
                        <b-field
                            label="Last Name"
                            :type="lastNameStatus"
                            :message="lastNameMessage"
                        >
                            <b-input v-model="lastName"></b-input>
                        </b-field>
                    </div>
                </div>
                <b-field label="Email" :type="emailStatus">
                    <b-input v-model="email"></b-input>
                </b-field>
                <b-field label="Password">
                    <b-input type="password" v-model="password" password-reveal>
                    </b-input>
                </b-field>
            </section>

            <div class="button-container">
                <b-button type="is-primary" expanded v-on:click="createAccount"
                    >Create Account</b-button
                >
            </div>
        </div>
    </div>
</template>

<script>
/*

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
*/
const data = ['ES1036', 'AM1413', 'AM1411', 'ES1050'];
import AuthService from '../services/AuthService';
import notificationMixin from '../mixins/notificationMixin';
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
    mixins: [notificationMixin],
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
            // signup
            authService
                .signup(
                    this.email.toLowerCase(),
                    this.password,
                    this.firstName,
                    this.lastName,
                    this.classes
                )
                .then(res => {
                    // sign up went well, user needs to verify the email
                    // res.data.message == "User signed up"
                    // indicate to the user that they need to verify their account
                    this.toast(res, 'is-success', 2000);
                    // redirect
                    setTimeout(() => {
                        this.$router.push('/');
                    }, 1000);
                })
                .catch(err => {
                    // flash warning
                    this.toast(err, 'is-danger', 3000);
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
        }
    }
};
</script>

<style lang="scss">
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

    padding: 30px 50px;
    @include sm {
        width: 90%;
        height: 60%;
        top: 0;
        border-radius: 15px;
    }
    @include md {
        width: 60%;
        height: 60%;
        top: 0;
        border-radius: 15px;
    }
    @include lg {
        width: 50%;
        height: 60%;
        max-width: 700px;
        top: 0;
        border-radius: 15px;
    }
    @include xl {
        width: 40%;
        height: 60%;
        max-width: 700px;
        top: 0;
        border-radius: 15px;
    }
}
.button-container {
    margin-top: 15px;
    text-align: center;
}
</style>
