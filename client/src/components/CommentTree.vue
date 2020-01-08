<template>
    <div>
        <section>
            <CommentCard
                :comment="comment"
                :offset="offset"
                @toggleNested="toggleNested"
                :hasComments="this.nested.length != 0"
            />
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
import CommentService from '../services/CommentService';
const commentService = new CommentService();

export default {
    name: 'CommentTree',
    props: ['comment', 'resourceId', 'offset'],
    mixins: [stringMixin],
    components: { CommentCard },
    data() {
        return {
            nested: [],
            showNested: false
        };
    },
    methods: {
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
