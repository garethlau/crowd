<template>
    <div :style="indent" class="container columns is-mobile">
        <div class="column is-1 votes-container">
            <div v-on:click="upvote" class="clickable">
                <b-icon pack="far" icon="caret-square-up"> </b-icon>
            </div>
            <div>
                {{ this.voteCount }}
            </div>
            <div v-on:click="downvote" class="clickable">
                <b-icon pack="far" icon="caret-square-down"> </b-icon>
            </div>
        </div>
        <div class="column">
            <div class="uploaded-by">
                <b-icon pack="far" icon="user" size="is-small"> </b-icon>

                {{
                    capitalizeFirst(comment.author.firstName) +
                        ' ' +
                        capitalizeFirst(comment.author.lastName)
                }}
                <span v-if="comment.created_at == comment.updated_at">
                    <b-icon pack="far" icon="clock" size="is-small"> </b-icon>

                    {{ uploadedDate }}
                </span>
                <span v-else>
                    <b-icon pack="far" icon="clock" size="is-small"> </b-icon>

                    {{ modifiedDate }}
                </span>
            </div>
            <div>
                <b-icon pack="far" icon="comment" size="is-small"> </b-icon>
                {{ comment.content }}
            </div>
            <div>
                <div class="buttons">
                    <b-button
                        type="is-primary"
                        v-if="hasComments && showNested"
                        @click="toggleNested"
                        icon-left="angle-double-up"
                        size="is-small"
                    >
                        Hide Comments
                    </b-button>
                    <b-button
                        type="is-primary"
                        @click="toggleNested"
                        icon-left="angle-double-down"
                        v-else-if="hasComments && !showNested"
                        size="is-small"
                    >
                        Show Comments
                    </b-button>
                    <b-button v-else disabled size="is-small">
                        No Comments
                    </b-button>
                    <b-button
                        type="is-primary"
                        outlined
                        icon-left="comment"
                        size="is-small"
                        @click="$emit('composeReply')"
                    >
                        Reply
                    </b-button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import stringMixin from '../mixins/stringMixin';
import notificationMixin from '../mixins/notificationMixin';
import CommentService from '../services/CommentService.js';
const commentService = new CommentService();

export default {
    name: 'CommentCard',
    props: ['comment', 'offset', 'hasComments'],
    mixins: [stringMixin, notificationMixin],
    data() {
        return {
            showNested: false,
            voteCount: 0,
        };
    },
    methods: {
        toggleNested() {
            this.showNested = !this.showNested;
            this.$emit('toggleNested');
        },
        upvote() {
            commentService
                .upvote(this.comment._id)
                .then(res => {
                    if (res.status == 200) {
                        // refresh vote count
                        this.getVoteCount(this.comment._id);
                    } else {
                        this.toast('There was en error.', 'is-danger', 3000);
                    }
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
                });
        },
        downvote() {
            commentService
                .downvote(this.comment._id)
                .then(res => {
                    if (res.status == 200) {
                        // refrsh vote count
                        this.getVoteCount(this.comment._id);
                    } else {
                        this.toast('There was an error.', 'is-danger', 3000);
                    }
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
                });
        },
        getVoteCount(commentId) {
            commentService
                .getVoteCount(commentId)
                .then(count => {
                    this.voteCount = count;
                })
                .catch(() => {
                    this.voteCount = 0;
                });
        }
    },
    created() {
        this.getVoteCount(this.comment._id);
    },
    computed: {
        indent() {
            return {
                transform: `translate(${this.offset * 50}px)`
            };
        },
        uploadedDate() {
            let date = new Date(this.comment.created_at);
            return date.toLocaleString();
        },
        modifiedDate() {
            let date = new Date(this.comment.updated_at);
            return date.toLocaleString();
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../styles/themes/western.scss';
@import '../styles/mixins';

.uploaded-by {
    display: inline;
}
.container {
    border-left-style: solid;
    border-color: $primary;
    margin-top: 20px;
    margin-bottom: 20px;
    @include sm {
        padding-left: 5px;
    }
    @include md {
        padding-left: 10px;
    }

}
.replyIcon {
    margin-right: 5px;
}
.votes-container {
    text-align: center;
    
}
.is-1 {
    padding: 0px;
    padding-top: 12px;
    width: 25px !important;
}
</style>
