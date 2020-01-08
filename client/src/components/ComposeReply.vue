<template>
    <div>
        <b-field>
            <b-input
                v-model="text"
                type="textarea"
                minlength="10"
                maxlength="100"
                placeholder="Write your reply here"
            >
            </b-input>
        </b-field>
        <b-button type="is-primary" @click="submitReply">
            Reply
        </b-button>
    </div>
</template>

<script>
import notificationMixin from '../mixins/notificationMixin';
import CommentService from '../services/CommentService';
const commentService = new CommentService();

export default {
    name: 'ComposeReply',
    data() {
        return {
            text: ''
        };
    },
    props: ['parentId', 'resourceId'],
    mixins: [notificationMixin],
    methods: {
        submitReply() {
            console.log(this.text);
            console.log("resource", this.resourceId, "parent", this.parentId);
            commentService
                .newComment(this.text, this.resourceId, this.parentId)
                .then(res => {
                    this.text = '';
                    this.toast(res, 'is-success', 2000);
                    this.$emit('replyCreated');
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
                });
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
