<template>
    <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
            <p class="modal-card-title">Week {{ weekNumber }}</p>
        </header>
        <section class="modal-card-body">
            
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">
                Close
            </button>
            <button class="button is-primary">Login</button>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'WeekModal',
    props: ['weekNumber'],
    data() {
        return {
            courseCode: '',
            resources: []
        };
    },
    beforeMount() {
        const courseCode = this.$route.params.code;
        this.courseCode = courseCode;
        this.resources = [
            {
                week: '1',
                title: 'Test 1',
                datePosted: '',
                upvotes: '',
                downvotes: '',
                comments: '',
                contentType: '',
                content: '', // this might be youtube url, file url, or link
                author: '',
                id: '1'
            },
            {
                week: '1',
                title: 'Test 2',
                datePosted: '',
                upvotes: '',
                downvotes: '',
                comments: '',
                contentType: '',
                content: '', // this might be youtube url, file url, or link
                author: '',
                id: '2'
            },
            {
                week: '2',
                title: 'Test 2',
                datePosted: '',
                upvotes: '',
                downvotes: '',
                comments: '',
                contentType: '',
                content: '', // this might be youtube url, file url, or link
                author: '',
                id: '3'
            }
        ];
    }
};
</script>
