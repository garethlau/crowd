<template>
    <div :style="indent" class="container">
        <div>
            <div class="uploaded_by">
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

                    {{ comment.updated_at }}
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

export default {
    name: 'CommentCard',
    props: ['comment', 'offset', 'hasComments'],
    mixins: [stringMixin],
    data() {
        return {
            showNested: false
        };
    },
    methods: {
        toggleNested() {
            this.showNested = !this.showNested;
            this.$emit('toggleNested');
        }
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../styles/themes/western.scss';

.uploaded_by {
    display: inline;
}
.container {
    border-left-style: solid;
    border-color: $primary;
    margin-top: 20px;
    margin-bottom: 20px;
    padding-left: 10px;
}
.replyIcon {
    margin-right: 5px;
}
</style>
