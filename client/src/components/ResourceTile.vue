<template>
    <div class="is-child box">
        <article>
            <div class="columns">
                <div class="column is-1 vote-container">
                    <div v-on:click="upvote" class="clickable">
                        <b-icon pack="far" icon="caret-square-up"> </b-icon>
                    </div>
                    <div>
                        0
                    </div>
                    <div v-on:click="downvote" class="clickable">
                        <b-icon pack="far" icon="caret-square-down"> </b-icon>
                    </div>
                </div>
                <div class="column is-8" v-on:click="launchResourceModal">
                    <div>
                        <p>
                            Posted by
                            {{
                                capitalizeFirst(data.author.firstName) +
                                    ' ' +
                                    capitalizeFirst(data.author.lastName)
                            }}
                            <span v-if="uploadedDate == modifiedDate">
                                {{ uploadedDate }}
                            </span>
                            <span v-else>
                                {{ modifiedDate }}
                            </span>
                        </p>
                    </div>
                    <div>
                        <p class="title">
                            {{ data.title }}
                        </p>
                    </div>
                </div>
                <div class="column is-3" v-on:click="fav">
                    <div v-if="favourite">
                        <b-icon pack="fas" icon="star"> </b-icon>
                    </div>
                    <div v-else>
                        <b-icon pack="far" icon="star"> </b-icon>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
import stringMixin from '../mixins/stringMixin';
export default {
    name: 'ResourceTile',
    props: ['data'],
    mixins: [stringMixin],
    data() {
        return {
            favourite: false
        };
    },
    methods: {
        upvote: function() {
            console.log(this.data);
            // console.log('Upvote');
            this.$emit('clickedDownvote');
        },
        downvote: function() {
            // console.log('downvote');
            this.$emit('clickedDownvote');
        },
        launchResourceModal: function() {
            // console.log('launch resource modal');
            this.$emit('clickedResource', this.data);
        },
        fav: function() {
            // console.log('FAVV');
            this.$emit('clickedFav');
        }
    },
    mounted() {
        console.log(this.data);
    },
    computed: {
        uploadedDate() {
            let date = new Date(this.data.created_at);
            return date.toLocaleString();
        },
        modifiedDate() {
            let date = new Date(this.data.updated_at);
            return date.toLocaleString();
        }
    }
};
</script>

<style lang="scss" scoped>
.vote-container {
    text-align: center;
}
.clickable {
    &:hover {
        cursor: pointer;
    }
}
.is-1 {
    width: 25px;
    padding: 0px;
    padding-top: 10px;
}
.tile {
    margin-top: 15px;
    margin-bottom: 15px;
}
</style>
