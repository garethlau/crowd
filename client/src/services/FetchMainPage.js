import axios from "axios";

export default class FetchMainPage{
	fetchData() {
		/*
		 * javascript frontend is fucking dog
		 */
		//console.log("working")
		var response
		axios
			.get("localhost:5000/api/v1/content")
			.then(r => (response = r))
		console.log(response)
		//return response
	}
}
