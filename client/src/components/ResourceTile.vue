<template>
    <div class="border">
        <div class="columns is-mobile">
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
            <div class="column content-container">
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
                <div v-on:click="launchResourceModal" class="clickable">
                    <p class="title">
                        {{ data.title }}
                    </p>
                </div>
            </div>
            <div class="column is-1 actions-container">
                <div v-if="favourite" class="clickable" v-on:click="fav">
                    <b-tooltip label="Add to favourites" position="is-left">
                        <b-icon pack="fas" icon="star"> </b-icon>
                    </b-tooltip>
                </div>
                <div v-else>
                    <b-tooltip
                        label="Remove from favourites"
                        position="is-left"
                    >
                        <b-icon
                            pack="far"
                            class="clickable fade-color fade"
                            icon="star"
                        >
                        </b-icon>
                    </b-tooltip>
                </div>
                <div>
                    <b-tooltip label="Report this resource" position="is-left">
                        <b-icon
                            pack="fas"
                            class="clickable fade-color"
                            icon="exclamation"
                        >
                        </b-icon>
                    </b-tooltip>
                </div>
                <div>
                    <b-tooltip label="Share this resource" position="is-left">
                        <b-icon
                            pack="fas"
                            class="clickable fade-color"
                            icon="share-alt"
                        >
                        </b-icon>
                    </b-tooltip>
                </div>
            </div>
        </div>
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
            console.log('upvote resource', this.data._id);
            // console.log('Upvote');
        },
        downvote: function() {
            console.log('downvote resource', this.data._id);
        },
        launchResourceModal: function() {
            // console.log('launch resource modal');
            this.$emit('clickedResource', this.data);
        },
        fav: function() {
            console.log('fav resource', this.data._id);
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
@import '../styles/global.scss';
.vote-container {
    text-align: center;
    width: 50px;
    padding: 0px;
    padding-top: 5px;
    background-color: #cecece;
    border-radius: 7px 0px 0px 7px;
}
.actions-container {
    padding-top: 2px;
    padding-bottom: 0px;
    text-align: right;
}
.content-container {
    padding-left: 20px;
}
.fade-color {
    &:hover {
        color: $primary;
    }
    -o-transition: color 0.2s ease-out, background 1s ease-in;
    -ms-transition: color 0.2s ease-out, background 1s ease-in;
    -moz-transition: color 0.2s ease-out, background 1s ease-in;
    -webkit-transition: color 0.2s ease-out, background 1s ease-in;
    /* ...and now override with proper CSS property */
    transition: color 0.2s ease-out, background 1s ease-in;
}

.tile {
    margin-top: 15px;
    margin-bottom: 15px;
}
.columns {
    border-style: solid;
    border-width: 1px;
    margin-bottom: 40px;
    border-radius: 7px;
}
</style>
