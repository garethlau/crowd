<template>
    <div>
        <section>
            <CommentCard
                :comment="comment"
                :offset="offset"
                @toggleNested="toggleNested"
                @composeReply="composeReply"
                :hasComments="this.nested.length != 0"
            />
            <div v-if="showComposeReply">
                <ComposeReply
                    :parentId="this.comment._id"
                    :resourceId="this.comment.resourceId"
                    @replyCreated="replyCreated"
                />
            </div>
        </section>

        <section>
            <div v-if="nested.length != 0 && showNested">
                <CommentTree
                    v-for="comment in this.nested"
                    :key="comment._id"
                    :comment="comment"
                    :resourceId="comment.resourceId"
                    :offset="offset + 1"
                />
            </div>
        </section>
    </div>
</template>

<script>
import CommentCard from './CommentCard';
import stringMixin from '../mixins/stringMixin';
import ComposeReply from './ComposeReply';
import CommentService from '../services/CommentService';
const commentService = new CommentService();

export default {
    name: 'CommentTree',
    props: ['comment', 'resourceId', 'offset'],
    mixins: [stringMixin],
    components: { CommentCard, ComposeReply },
    data() {
        return {
            nested: [],
            showNested: false,
            showComposeReply: false
        };
    },
    methods: {
        composeReply() {
            this.showComposeReply = !this.showComposeReply;
        },
        replyCreated() {
            // hide reply composer
            this.showComposeReply = false;
            // refresh tree
            this.setComments();
            // show nested to see the newly added reply
            this.showNested = true;
        },
        toggleNested() {
            this.showNested = !this.showNested;
        },
        setComments() {
            commentService
                .getComments(this.$props.resourceId, this.$props.comment._id)
                .then(res => {
                    // console.log('got comments', res.data.comments);
                    if (res.data.comments.length == 0) {
                        // console.log('NO COMMENTS');
                    }
                    this.nested = res.data.comments;
                })
                .catch(err => {
                    // There was an error fetching comments
                    console.log(err);
                });
        }
    },
    created() {
        this.setComments();
    }
};
</script>

<style lang="scss" scoped></style>
