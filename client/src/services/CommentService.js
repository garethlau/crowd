import axios from 'axios';
const base = '/api/v1/comment';

export default class CommentService {
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
}
