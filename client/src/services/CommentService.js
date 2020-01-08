import axios from 'axios';
const base = '/api/v1/comment';

const vote = (commentId, isUpvote) => {
    return new Promise((resolve, reject) => {
        // create url
        const url = base + '/voting';
        const data = {
            commentId: commentId,
            vote: isUpvote ? 'up' : 'dn'
        };
        let config = {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        // make post request
        axios
            .post(url, data, config)
            .then(res => {
                if (res.status == 200) {
                    resolve(res);
                }
                // catch all other status codes and reject
                reject('There was an error.');
            })
            .catch(err => {
                if (err.response.status == 400) {
                    // Server didn't get an ID
                    reject('There was an error.');
                } else if (err.response.status == 401) {
                    reject('You must be logged in to upvote.');
                }
                // catch all other status codes and reject
                reject('THere was an error.');
            });
    });
};
export default class CommentService {
    /**
     *
     * @param {string} commentId
     */
    upvote(commentId) {
        return vote(commentId, true);
    }
    /**
     *
     * @param {string} commentId
     */
    downvote(commentId) {
        return vote(commentId, false);
    }

    getVoteCount(commentId) {
        return new Promise((resolve, reject) => {
            let url = base + '/voting';
            let params = {
                commentId: commentId
            };
            axios
                .get(url, { params: params })
                .then(res => {
                    if (res.status == 200) {
                        resolve(res.data.count);
                    }
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
