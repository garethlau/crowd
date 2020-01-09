import axios from 'axios';
const base = '/api/v1/resource/';

const config = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
};

const vote = (resourceId, type) => {
    return new Promise((resolve, reject) => {
        const url = base + 'voting';
        const data = {
            resourceId: resourceId,
            type: type
        };
        // make post request
        axios
            .post(url, data, config)
            .then(res => {
                if (res.status == 200) {
                    // everything went well
                    resolve(res);
                }
                // catch all
                reject('There was an error.');
            })
            .catch(err => {
                if (err.response.status == 400) {
                    reject('Missing information.');
                } else if (err.response.status == 401) {
                    if (type == 'up') {
                        reject('You must be logged in to upvote.');
                    } else {
                        reject('You must be logged in to downvote.');
                    }
                }
                // catch all other errors
                else {
                    reject('There was an error.');
                }
            });
    });
};

export default class ResourceService {
    // get list of resourceId's that the user has favourited
    getFavs() {
        return new Promise((resolve, reject) => {
            axios
                .get('/api/v1/user/current')
                .then(res => {
                    console.log('res in service', res);
                    if (res.data.user) {
                        resolve(res.data.user.favs);
                    } else {
                        reject('You must be logged in.');
                    }
                })
                .catch(err => {
                    console.log('err in service', err);
                    reject('There was an error.');
                });
        });
    }

    /**
     *
     * @param {string} resourceId ID of the resource to be added to user's list of favourites
     */
    makeFav(resourceId) {
        return new Promise((resolve, reject) => {
            const url = '/api/v1/user/fav';
            const data = {
                resourceId: resourceId
            };
            axios
                .post(url, data, config)
                .then(res => {
                    if (res.status == 200) {
                        // ok
                        resolve(res);
                    }
                    reject('There was an error.');
                })
                .catch(err => {
                    if (err.response.status == 400) {
                        reject('Missing information.');
                    } else if (err.response.status == 401) {
                        reject('You must be logged in to favourite.');
                    }
                    reject('There was an error.');
                });
        });
    }

    /**
     *
     * @param {string} resourceId ID of the resource to be removed from the user's list of favourites.
     */
    removeFav(resourceId) {
        return new Promise((resolve, reject) => {
            const url = '/api/v1/user/fav';
            const params = {
                resourceId: resourceId
            };
            axios
                .delete(url, { params: params, config })
                .then(() => {
                    resolve('Removed from favourites.');
                })
                .catch(err => {
                    if (err.response.status == 400) {
                        reject('Missing information.');
                    } else if (err.response.status == 401) {
                        reject('You must be logged in.');
                    }
                    reject('There was an error.');
                });
        });
    }

    /**
     *
     * @param {string} resourceId
     */
    upvote(resourceId) {
        return vote(resourceId, 'up');
    }

    /**
     *
     * @param {string} resourceId
     */
    downvote(resourceId) {
        return vote(resourceId, 'dn');
    }

    getVotes(resourceId) {
        return new Promise((resolve, reject) => {
            const url = base + 'voting';
            const params = {
                resourceId: resourceId
            };
            axios
                .get(url, { params: params })
                .then(res => {
                    if (res.status == 200) {
                        resolve(res.data.count);
                    }
                    // catch all others
                    reject('There was an error.');
                })
                .catch(err => {
                    if (err.response.status == 500) {
                        reject('There was an error.');
                    }
                    reject('There was an error.');
                });
        });
    }

    newResource(data) {
        return new Promise((resolve, reject) => {
            const url = '/api/v1/content/create';
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
    /**
     *
     * @param {string} [courseCode] Course code, not optional if id is not provided
     * @param {string} [week] Number of week
     * @param {string} [id] uid for a specific resource, not option if courseCode is not provided
     */
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
                reject('Did not provide enough details.');
            }
            axios
                .get(base, { params: params })
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    if (err.response.status == 404) {
                        reject('Could not find the requested resource.');
                    } else if (err.response.status == 400) {
                        reject(
                            'Did not specify enough details. Provide ID or Course Code.'
                        );
                    } else {
                        reject('There was an error.');
                    }
                });
        });
    }
    /**
     *
     * @param {string} id uid for specific resource
     * @param {Object} newResource
     */
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
    /**
     *
     * @param {string} id uid of the resource to delete
     */
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
