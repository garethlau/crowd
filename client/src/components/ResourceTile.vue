<template>
    <div class="border">
        <div class="columns is-mobile">
            <div class="column is-1 vote-container">
                <div v-on:click="upvote" class="clickable">
                    <b-icon pack="far" icon="caret-square-up"> </b-icon>
                </div>
                <div>
                    {{ this.count }}
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
                <div v-if="fav" class="clickable" v-on:click="unFav">
                    <b-tooltip
                        label="Remove from favourites"
                        position="is-left"
                    >
                        <b-icon pack="fas" icon="star"> </b-icon>
                    </b-tooltip>
                </div>
                <div v-else class="clickable" v-on:click="makeFav">
                    <b-tooltip label="Add to favourites" position="is-left">
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
import notificationMixin from '../mixins/notificationMixin';
import stringMixin from '../mixins/stringMixin';
import ResourceService from '../services/ResourceService';
const resourceService = new ResourceService();

export default {
    name: 'ResourceTile',
    props: ['data'],
    mixins: [stringMixin, notificationMixin],
    data() {
        return {
            fav: false,
            count: 0
        };
    },
    methods: {
        upvote() {
            console.log('upvote resource', this.data._id);
            resourceService
                .upvote(this.data._id)
                .then(() => {
                    // refresh vote count
                    this.getVoteCount();
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
                });
        },
        downvote() {
            console.log('downvote resource', this.data._id);
            resourceService
                .downvote(this.data._id)
                .then(() => {
                    // refresh vote count
                    this.getVoteCount();
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
                });
        },
        launchResourceModal() {
            // console.log('launch resource modal');
            this.$emit('clickedResource', this.data);
        },
        getVoteCount() {
            resourceService.getVotes(this.data._id).then(count => {
                console.log('getting vote count', count);
                this.count = count;
            });
        },
        checkFav() {
            console.log('checking VOTE');
            resourceService
                .getFavs()
                .then(favs => {
                    console.log('favs', favs);
                    if (favs.indexOf(this.data._id) != -1) {
                        this.fav = true;
                    } else this.fav = false;
                })
                .catch(err => {
                    console.log('err fav', err);
                });
        },
        unFav() {
            resourceService
                .removeFav(this.data._id)
                .then(() => {
                    this.fav = false;
                    // refresh status
                    this.checkFav();
                })
                .catch(err => {
                    this.toast(err, 'is-danger');
                    // refresh status
                    this.checkFav();
                });
        },
        makeFav() {
            resourceService
                .makeFav(this.data._id)
                .then(() => {
                    console.log('made fav');
                    this.fav = true; // should be true
                    // refresh fav status just to make sure
                    this.checkFav();
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
                    // check the status of fav
                    this.checkFav();
                });
        }
    },
    mounted() {
        console.log(this.data);
    },
    created() {
        this.getVoteCount();
        this.checkFav();
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
