<template>
    <div class="main">
        <div class="columns is-mobile">
            <div
                class="column is-1 center-text clickable"
                v-on:click="launchModal(id)"
            >
                {{ formatDate(createdAt) }}
            </div>
            <div
                class="column is-1 center-text clickable"
                v-on:click="launchModal(id)"
            >
                {{ week }}
            </div>
            <div
                class="column is-1 center-text clickable"
                v-on:click="launchModal(id)"
            >
                {{ type }}
            </div>
            <div class="column clickable" v-on:click="launchModal(id)">
                {{ title }}
            </div>
            <div
                class="column is-2 center-text clickable"
                v-on:click="launchModal(id)"
            >
                {{ firstName }} {{ lastName }}
            </div>
            <div class="column is-2 center-text">
                <div class="block">
                    <b-icon
                        v-if="isUpvote"
                        pack="fas"
                        class=" fade-color fade"
                        icon="thumbs-up"
                        @click.native="upvote(id)"
                    >
                    </b-icon>
                    <b-icon
                        v-else
                        pack="far"
                        class=" fade-color fade"
                        icon="thumbs-up"
                        @click.native="upvote(id)"
                    >
                    </b-icon>
                    {{ voteCount }}
                    <b-icon
                        v-if="isDowvote"
                        pack="fas"
                        class=" fade-color fade"
                        icon="thumbs-down"
                        @click.native="downvote(id)"
                    >
                    </b-icon>
                    <b-icon
                        v-else
                        pack="far"
                        class=" fade-color fade"
                        icon="thumbs-down"
                        @click.native="downvote(id)"
                    >
                    </b-icon>

                    <b-icon
                        v-if="isFav"
                        @click.native="unFavourite(id)"
                        pack="fas"
                        icon="star"
                    >
                    </b-icon>
                    <b-icon
                        v-else
                        pack="far"
                        class=" fade-color fade"
                        icon="star"
                        @click.native="makeFavourite(id)"
                    >
                    </b-icon>
                </div>
            </div>
        </div>
        <div class="hr"></div>
    </div>
</template>

<script>
import ResourceService from '../services/ResourceService';
import notificationMixin from '../mixins/notificationMixin';
const resourceService = new ResourceService();

export default {
    name: 'ResourceCard',
    data() {
        return {
            isFav: false,
            isUpvote: false,
            isDowvote: false,
            voteCount: 0
        };
    },
    props: [
        'title',
        'week',
        'firstName',
        'lastName',
        'type',
        'createdAt',
        'id',
        'data'
    ],
    mixins: [notificationMixin],
    created() {
        this.checkFav();
        this.getVoteCount();
    },
    methods: {
        upvote(id) {
            resourceService
                .upvote(id)
                .then(res => {
                    // refresh vote count
                    this.getVoteCount();
                    if (res.data.message == 'Vote switched.') {
                        this.isUpvote = !this.isUpvote;
                        this.isDowvote = !this.isDowvote;
                    }
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
                });
        },
        downvote(id) {
            resourceService
                .downvote(id)
                .then(res => {
                    // refresh vote count
                    this.getVoteCount();
                    if (res.data.message == 'Vote switched.') {
                        this.isUpvote = !this.isUpvote;
                        this.isDowvote = !this.isDowvote;
                    }
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
                });
        },
        getVoteCount() {
            resourceService
                .getVotes(this.id)
                .then(res => {
                    this.voteCount = res.count;
                    if (res.upvoted) {
                        this.isUpvote = true;
                    } else if (res.downvoted) {
                        this.isDowvote = true;
                    } else {
                        this.isUpvote = false;
                        this.isDowvote = false;
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        },
        unFavourite(id) {
            resourceService
                .removeFav(id)
                .then(() => {
                    this.isFav = false;
                    // refresh status
                    this.checkFav();

                    // this event is used in the profile page
                    this.$emit('clickedUnfav', id);
                })
                .catch(err => {
                    this.toast(err, 'is-danger');
                    // refresh status
                    this.checkFav();
                });
        },
        makeFavourite(id) {
            console.log(id);
            resourceService
                .makeFav(id)
                .then(() => {
                    this.isFav = true; // should be true
                    // refresh fav status just to make sure
                    this.checkFav();
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
                    // check the status of fav
                    this.checkFav();
                });
        },
        checkFav() {
            resourceService
                .getFavs()
                .then(favs => {
                    console.log('favs', favs);
                    if (favs.indexOf(this.id) != -1) {
                        this.isFav = true;
                    } else this.isFav = false;
                })
                .catch(() => {
                    // if theres an error, by default, mark it as not favourited
                    this.isFav = false;
                });
        },
        formatDate(d) {
            let month = new Date(d).getMonth();
            let year = new Date(d).getFullYear();
            let date = new Date(d).getDate();
            return `${date}/${month}/${year}`;
        },
        launchModal() {
            console.log('this.data is', this.data);
            this.$emit('clickedResource', {
                title: this.title,
                weel: this.week,
                firstName: this.firstName,
                lastName: this.lastName,
                type: this.type,
                createdAt: this.type,
                id: this.id,
                data: this.data
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../styles/global';

.main {
}
.center-text {
    text-align: center;
}
.fade-color {
    &:hover {
        color: $kimberly;
    }
    -o-transition: color 0.2s ease-out, background 1s ease-in;
    -ms-transition: color 0.2s ease-out, background 1s ease-in;
    -moz-transition: color 0.2s ease-out, background 1s ease-in;
    -webkit-transition: color 0.2s ease-out, background 1s ease-in;
    /* ...and now override with proper CSS property */
    transition: color 0.2s ease-out, background 1s ease-in;
}
.hr {
    display: block;
    unicode-bidi: isolate;
    margin-block-start: 0.5em;
    margin-block-end: 0.5em;
    margin-inline-start: auto;
    margin-inline-end: auto;
    overflow: hidden;
    border-style: inset;
    border-width: 1px;
}
</style>
