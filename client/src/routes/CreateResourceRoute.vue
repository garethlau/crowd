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
							link
						</div>
				</section>
			</div>
		</div>
		<b-button	type="is-primary" onclick="">Submit</b-button>
	</div>
</template>

<script>
//import AddContent from "../src/services/AddContent";
//const addContent = new AddContent()
export default {
	name: "CreateResourceRoute",
	data(){
		return {
			type: "",
			pdfFile: null
		}
	}
}
</script>
