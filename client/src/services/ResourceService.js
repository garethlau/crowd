import axios from 'axios';
const base = '/api/v1/resource/';

export default class ResourceService {
    getResources(courseCode, week, id) {
        return new Promise((resolve, reject) => {
            let params = {};
            if (id) {
                params['id'] = id;
            } else if (courseCode && week) {
                params['courseCode'] = courseCode;
                params['week'] = week;
            } else if (courseCode) {
                params['courseCode'] = courseCode;
            } else {
                reject({ message: 'Did not provide enough details.' });
            }
            axios
                .get(base, { params: params })
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    updateResource(id, newResource) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject('Missing ID.');
            }
            let data = {
                data: newResource,
                resourceId: id
            };
            let config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            axios
                .put(base, data, config)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    deleteResource(id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject('Missing ID.');
            }
            let config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            let data = {
                resourceId: id
            };
            axios
                .delete(base, data, config)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
    // TODO
    // method to change favourite status
}
