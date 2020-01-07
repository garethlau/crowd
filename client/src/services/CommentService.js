import axios from 'axios';
const base = '/api/v1/comment';

export default class CommentService {
    /**
     *
     * @param {string} resourceId
     * @param {string} [parentId]
     * @returns {Object[]} List of comments for a resourceId (and parentId)
     */
    getComments(resourceId, parentId) {
        return new Promise((resolve, reject) => {
            let params = {};
            params['id'] = resourceId;
            if (parentId) {
                params['parentId'] = parentId;
            }
            axios
                .get(base, { params: params })
                .then(res => {
                    if (res.status == 200) {
                        resolve(res);
                    }
                    reject('There was an error.');
                })
                .catch(() => {
                    reject('There was an error.');
                });
        });
    }
    /**
     * @param {string} content - Comment to be added
     * @param {string} resourceId - the uid for the resource
     * @param {string} [parentId] - the id for the parent comment
     */
    newComment(content, resourceId, parentId) {
        return new Promise((resolve, reject) => {
            let config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'applicaton/json'
                }
            };
            let params = {};
            params['id'] = resourceId;
            if (parentId) {
                params[parentId] = parentId;
            }
            let data = {
                content: content
            };
            axios
                .post(base, data, {
                    params: params,
                    config
                })
                .then(res => {
                    if (res.status == 200) {
                        resolve('Comment added.');
                    }
                    // catch other statuses
                    reject('There was an error.');
                })
                .catch(err => {
                    if (err.response.status == 400) {
                        // Missing resource id
                        reject('There was an error');
                    } else if (err.response.status == 401) {
                        reject('You must be logged in to comment.');
                    } else if (err.response.status == 500) {
                        reject('There was an error.');
                    }
                    reject('There was an error.');
                });
        });
    }
}
