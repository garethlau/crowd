import axios from "axios"

export default class AddContent{
	addContent(data){
		return new Promise((resolve, reject) => {
			let config = {
				withCredentials: true,
				headers: {
					'Content-Type': 'applicaton/json'
				}
			}
			const url = '/api/v1/content/create'
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
