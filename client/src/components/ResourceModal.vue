<template>
    <div class="modal-card scrollable">
        <section class="hero is-primary">
            <div class="hero-body">
                <div class="container">
                    <h1>
                        {{ props.courseCode }}
                    </h1>
                </div>
            </div>
        </section>
        <section class="hero">
            <div class="hero-body">
                <div class="container">
                    <h2 class="subtitle">
                        Posted by
                        {{
                            capitalizeFirst(props.resource.author.firstName) +
                                ' ' +
                                capitalizeFirst(props.resource.author.lastName)
                        }}
                    </h2>
                    <h1 class="title">
                        {{ props.resource.title }}
                    </h1>
                </div>
            </div>
        </section>
        <section>
            <div class="container" :style="resourceContainer">
                <div v-if="props.resource.content.type == 'video'">
                    <VideoResource :data="props.resource.content.data" />
                </div>
                <div v-else-if="props.resource.content.type == 'link'">
                    Link
                    {{ props.resource.content.data }}
                </div>
                <div v-else-if="props.resource.content.type == 'text'">
                    Text
                    {{ props.resource.content.data }}
                </div>
                <div v-else class="subtitle">
                    No format???
                    {{ props.resource.content.data }}
                </div>
            </div>
        </section>
        <section>
            <div class="container">
                <ComposeComment
                    :resourceId="props.resource._id"
                    @commentAdded="refreshComments"
                />
            </div>
        </section>

        <section>
            <div class="container" v-if="showComments">
                <div>
                    <CommentTree
                        v-for="comment in this.comments"
                        :key="comment._id"
                        :comment="comment"
                        :resourceId="comment.resourceId"
                        :offset="0"
                        ref="commentTree"
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<script>
/**

        <button class="button" type="button" @click="$emit('clickedClose')">
            Close
        </button>
 */

/*
TO close all comments

          <div class="container">
                <b-button
                    v-if="showComments"
                    @click="toggleComments"
                    type="is-primary"
                    icon-left="minus-circle"
                >
                    Hide Comments
                </b-button>
                <b-button
                    v-else
                    @click="toggleComments"
                    type="is-primary"
                    icon-left="plus-circle"
                >
                    Show Comments
                </b-button>
            </div>
*/
/*
each comment has a resourceId
nested comments dont have parentIds

in each Comment.vue file, call getComments to get the children of this current comment
*/
import stringMixin from '../mixins/stringMixin';
import CommentTree from './CommentTree';
import ComposeComment from './ComposeComment';
import CommentService from '../services/CommentService';
import VideoResource from './VideoResource';
const commentService = new CommentService();

export default {
    name: 'ResourceModal',
    props: ['props'],
    mixins: [stringMixin],
    components: { CommentTree, ComposeComment, VideoResource },
    data() {
        return {
            showComments: true,
            comments: []
        };
    },
    methods: {
        toggleComments() {
            this.showComments = !this.showComments;
        },
        refreshComments() {
            console.log('REFRESH COMMENTS');
            this.setComments();
        },
        setComments() {
            commentService
                .getComments(this.props.resource._id, null)
                .then(res => {
                    this.comments = res.data.comments;
                })
                .catch(err => {
                    console.log(err);
                    this.comments = [];
                });
        }
    },
    mounted() {
        console.log(this.props);
        this.setComments();
    },
    computed: {
        resourceContainer() {
            if (this.props.resource.content.type == 'video') {
                return 'min-height: 500px';
            }
            return 'min-height: 200px';
        }
    }
};
</script>

<style lang="scss" scoped>
.modal {
    background-color: white;
}
.scrollable {
    overflow-y: scroll;
}
</style>
