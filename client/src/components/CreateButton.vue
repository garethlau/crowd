<template>
    <div>
        <b-button type="is-link" v-on:click="createResource">New Post</b-button>
    </div>
</template>

<script>
export default {
    props: {
        courseCode: String
    },
    methods: {
        createResource() {
            const router = this.$router;
            //console.log(this.$route);
            console.log('course code: ' + this.courseCode);
            router.push('/resource/create?courseCode=' + this.courseCode);
        }
    }
};
</script>
