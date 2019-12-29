import axios from 'axios';

export default class AuthService {
    signup(data) {
        return new Promise((resolve, reject) => {
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
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    login(data) {
        return new Promise((resolve, reject) => {
            let config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const url = '/api/v1/user/login';
            axios
                .post(url, data, config)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
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
