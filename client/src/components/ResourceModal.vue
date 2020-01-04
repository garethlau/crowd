<template>
    <div class="modal-card">
        <section class="hero">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        {{ props.resource.title }}
                    </h1>
                    <h2 class="subtitle">
                        {{
                            capitalizeFirst(props.resource.author.firstName) +
                                ' ' +
                                capitalizeFirst(props.resource.author.lastName)
                        }}
                    </h2>
                    <div>
                        {{ props.resource.content.data }}
                    </div>
                </div>
            </div>
        </section>
        <section>
            <div class="container">
                <Comment
                    v-for="comment in props.comments"
                    v-bind:key="comment._id"
                    v-bind:comment="comment"
                />
            </div>
        </section>

        <button class="button" type="button" @click="$emit('clickedClose')">
            Close
        </button>
    </div>
</template>

<script>
import stringMixin from '../mixins/stringMixin';
import Comment from './Comment';

export default {
    name: 'ResourceModal',
    props: ['props'],
    mixins: [stringMixin],
    components: { Comment },
    mounted() {
        console.log(this.props);
    }
};
</script>

<style lang="scss" scoped>
.modal {
    background-color: white;
}
</style>
