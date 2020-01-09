import axios from 'axios';

export default class AuthService {
    /**
     *
     * @param {string} email user email
     * @param {string} password user password
     * @param {string} firstName first name
     * @param {string} lastName last name
     * @param {string[]} classes array of classes
     */
    signup(email, password, firstName, lastName, classes) {
        return new Promise((resolve, reject) => {
            const data = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                classes: classes
            };
            let config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const url = '/api/v1/user/signup';
            axios
                .post(url, data, config)
                .then(res => {
                    resolve(res);
                    if (res.status == 200) {
                        resolve('Account created. Please verify your email.');
                    }
                    // Uncaught error
                    reject('There was an error.');
                })
                .catch(err => {
                    if (err.response.status == 409) {
                        reject('This email is already being used.');
                    }
                    if (err.response.status == 500) {
                        reject('There was an error saving your account.');
                    }
                    reject('There was an error.');
                });
        });
    }
    /**
     *
     * @param {string} email User email
     * @param {string} password User password
     */
    login(email, password) {
        return new Promise((resolve, reject) => {
            let config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            let data = {
                email: email,
                password: password
            };
            const url = '/api/v1/user/login';
            axios
                .post(url, data, config)
                .then(res => {
                    if (res.status == 200) {
                        // logged in
                        resolve('Logged in.');
                    } else {
                        // no clue
                        reject('There was an erorr.');
                    }
                })
                .catch(err => {
                    if (err.response.status == 400) {
                        // Incorrect password
                        reject('Incorrect password');
                    }
                    if (err.response.status == 404) {
                        // No user
                        reject('User does not exist.');
                    }
                    // catch all errors
                    reject('There was an error.');
                });
        });
    }
    logout() {
        return new Promise((resolve, reject) => {
            axios
                .get('/api/v1/user/logout')
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    isAuth() {
        return new Promise((resolve, reject) => {
            axios
                .get('/api/v1/user/current')
                .then(res => {
                    if (res.data.user) {
                        resolve(res.data.user);
                    }
                    reject('Not logged in.');
                })
                .catch(() => {
                    reject('There was an error.');
                });
        });
    }
    verify(code) {
        return new Promise((resolve, reject) => {
            const url = '/api/v1/user/signup/' + code;
            axios
                .get(url)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
