<template>
    <div class="container">
        <b-field>
            <b-input
                v-model="text"
                type="textarea"
                minlength="10"
                maxlength="100"
                placeholder="Write your comment here"
            >
            </b-input>
        </b-field>
        <b-button type="is-primary" @click="addComment">
            Comment
        </b-button>
    </div>
</template>

<script>
import notificationMixin from '../mixins/notificationMixin';
import CommentService from '../services/CommentService';
const commentService = new CommentService();

export default {
    name: 'ComposeComment',
    data() {
        return {
            text: ''
        };
    },
    props: ['resourceId'],
    mixins: [notificationMixin],
    methods: {
        addComment() {
            console.log(this.text);
            commentService
                .newComment(this.text, this.resourceId)
                .then(res => {
                    this.text = '';
                    this.toast(res, 'is-success', 2000);
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    min-height: 100px;
    margin-bottom: 20px;
}
</style>
