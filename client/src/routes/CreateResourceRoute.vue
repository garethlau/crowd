<template>
	<div class="container">
		<div class="columns">
			<div class="column">
				<section>
					<b-field label="Title">
						<b-input v-model="title"></b-input>
					</b-field>
					<div class="block">
						<b-field label = "Type">
						</b-field>
							<b-radio v-model="type"
                name="name"
                native-value="Text">
                Text
            </b-radio>
            <b-radio v-model="type"
                name="name"
                native-value="PDF">
               	PDF 
            </b-radio>
            <b-radio v-model="type"
                name="name"
                native-value="Link">
               	Link 
            </b-radio>
					</div>
						<div v-show="type=== 'Text'">
							<b-field label="Text">
								<b-input type="textarea" v-model="textInput"></b-input>
							</b-field>
						</div>
						<div v-show="type=== 'PDF'">
							<b-field class="file">
								<b-upload v-model="pdfFile">
									<a class="button is-primary"	>
										<b-icon icon="upload"></b-icon>
										<span>Click to upload</span>
									</a>
								</b-upload>
								<span class="file-name" v-if="pdfFile">
									{{pdfFile.name}}
								</span>
							</b-field>
						</div>
						<div v-show="type=== 'Link'">
							<b-field label="Link">
								<b-input v-model="linkInput"></b-input>
							</b-field>
						</div>
				</section>
			</div>
		</div>
		<b-button	type="is-primary" v-on:click="submit">Submit</b-button>
	</div>
</template>

<script>
//import AddContent from "../src/services/AddContent";
//const addContent = new AddContent()
import axios from "axios"
export default {
	name: "CreateResourceRoute",
	data(){
		return {
			title: "",
			type: "",
			pdfFile: null,
			textInput: "",
			linkInput: ""
		}
	},
	methods: {
		submit: function(){
			//console.log(this.type);
			const url = "/api/v1/content/create";
			var data;
			if(this.type === "Text"){
				data = {
					title: this.title,
					type: this.type,
					input: this.textInput
				};
			}else if (this.type === "PDF"){

				data = {
					title: this.title,
					type: this.type,
					input: this.pdfFile
				};
			}else if (this.type === "Link"){

				data = {
					title: this.title,
					type: this.type,
					input: this.linkInput
				};
			}else{
				data = {
					"nothing":"nothing"
				}
			}
			axios.post(url, data)
				.then(function(response) {
					console.log(response);
				})
				.catch(function (error){
					console.log(error);
				});
		}
	}
}
</script>
