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

                    <div class="subtitle">
                        {{ props.resource.content.data }}
                    </div>
                </div>
            </div>
        </section>
        <section>
            <div class="container">
                <ComposeComment 
                    :resourceId="props.resource._id"
                />
            </div>
        </section>

        <section>
            <div class="container" v-if="showComments">
                <div>
                    <CommentTree
                        v-for="comment in props.comments"
                        :key="comment._id"
                        :comment="comment"
                        :resourceId="comment.resourceId"
                        :offset="0"
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

export default {
    name: 'ResourceModal',
    props: ['props'],
    mixins: [stringMixin],
    components: { CommentTree, ComposeComment },
    data() {
        return {
            showComments: true
        };
    },
    methods: {
        toggleComments() {
            this.showComments = !this.showComments;
        }
    },
    mounted() {
        console.log(this.props);
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
