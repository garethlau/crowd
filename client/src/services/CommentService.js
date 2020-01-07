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
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
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
                    console.log(res);
                    if (res.data.message == "You must be logged in to comment.") {
                        reject(res.data.message);
                    }
                    resolve(res);
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    }
}
