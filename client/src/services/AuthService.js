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
}
