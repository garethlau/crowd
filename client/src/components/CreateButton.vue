<template>
	<div>
		<b-button type="is-link" onclick="createResource()">New Post</b-button>
	</div>
</template>

<script>
export default{
	data(){
		return{
			courseCode: ""
		}
	},
	methods:{
		createResource(){
			const router = this.$router
			router.push("#/resource/create?courseCode="+this.courseCode);
		}
	}
}
</script>
