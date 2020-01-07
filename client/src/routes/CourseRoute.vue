<template>
    <div>
        <section class="hero is-primary">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        {{ courseCode }}
                    </h1>
                    <h2 class="subtitle">
                        Class Description
                    </h2>
                </div>
            </div>
        </section>

        <section v-if="this.$route.query.week">
            <div class="container">
                <div v-if="filteredResources.length == 0">
                    No resources here : I dont like that this shows up no matter
                    what. Look into possibly adding a delay or loading animation
                    while when filtering the resources.
                </div>
                <div v-else>
                    <ResourceTile
                        v-for="resource in filteredResources"
                        v-bind:key="resource.id"
                        v-bind:data="resource"
                        @clickedResource="launchResourceModal"
                        @clickedUpvote="handleUpvote"
                        @clickedDownvote="handleDownvote"
                        @clickedFav="handleFav"
                    />
                </div>
            </div>
        </section>

        <section v-else>
            <div class="container">
                <div
                    class="tile is-ancestor"
                    v-for="index in 4"
                    v-bind:key="index"
                >
                    <div
                        class="tile is-parent"
                        v-for="week in 4"
                        v-bind:key="week"
                    >
                        <div class="tile is-child box">
                            <router-link
                                :to="{
                                    path: `/${courseCode}?week=${(index - 1) *
                                        4 +
                                        week}`
                                }"
                            >
                                <article>
                                    <p class="title">
                                        Week {{ (index - 1) * 4 + week }}
                                    </p>
                                    <p class="subtitle"></p>
                                </article>
                            </router-link>
                        </div>
                    </div>
                </div>
                <CreateButton v-bind:courseCode="courseCode"/>
            </div>
        </section>
        <section>
            <b-modal
                :active.sync="isModalActive"
                has-modal-card
                full-screen
                :can-cancel="['escape', 'x', 'outside']"
                scroll="keep"
            >
                <ResourceModal
                    v-bind:props="resourceModalProps"
                    @clickedClose="closeModal"
                />
            </b-modal>
        </section>
    </div>
</template>

<script>
/**
 * Gareth's notes
 * Its much better to query for all the resources for a given page than to have each resource item make a request for its own metadata.
 * SOOOOOO this compoennt will mkae teh requests, get all the metadata for the resources, and will just pass it
 * as props to a Resource component. This means we also need to make onChange handlers for upvotes, and comments to keep track of these changes
 *
 */
import CreateButton from '../components/CreateButton';
import ResourceTile from '../components/ResourceTile';
import ResourceModal from '../components/ResourceModal';
import ResourceService from '../services/ResourceService';
import CommentService from '../services/CommentService';
const resourceService = new ResourceService();
const commentService = new CommentService();

export default {
    name: 'CourseRoute',
    components: { ResourceTile, ResourceModal, CreateButton },
    data() {
        return {
            courseCode: '',
            resources: [],
            isModalActive: false,
            resourceModalProps: {}
        };
    },
    methods: {
        toast(message, type, duration) {
            this.$buefy.toast.open({
                message: message,
                duration: duration,
                type: type
            });
        },
        launchResourceModal(resource) {
            console.log(resource);
            this.resourceModalProps['courseCode'] = this.courseCode;
            this.resourceModalProps['resource'] = resource;
            commentService
                .getComments(resource._id, null)
                .then(res => {
                    this.resourceModalProps['comments'] = res.data.comments;
                    this.resourceModalProps['errMsg'] = '';
                    console.log(this.resourceModalProps.comments);
                    this.isModalActive = true;
                })
                .catch(err => {
                    console.log(err);
                    this.resourceModalProps['comments'] = [];
                    this.resourceModalProps['errMsg'] = err;
                });
        },
        closeModal() {
            // close the modal
            this.isModalActive = false;
            // clear resource modal props
            this.resourceModalProps = {};
        },
        handleUpvote() {
            console.log('upvote');
        },
        handleDownvote() {
            console.log('downvote');
        },
        handleFav() {
            console.log('fav');
        }
    },
    created() {
        console.log(this.$route);
        this.courseCode = this.$route.params.courseCode;
    },
    mounted() {
        console.log('mounted');
        // get the resources for the entire course
        resourceService
            .getResources(this.courseCode)
            .then(res => {
                this.resources = res.data.resources;
            })
            .catch(err => {
                console.log('err is', err);
                this.resources = [];
                this.toast(err, 'is-danger', 3000);
            });
    },
    watch: {
        $route(to, from) {
            console.log('Change from: ', from, 'to ', to);
            this.courseCode = to.params.courseCode;
        }
    },
    computed: {
        filteredResources: function() {
            console.log('computed');
            if (this.$route.query.week == null) {
                console.log('WEEK IS NULKL');
                return [];
            }
            return this.resources.filter(resource => {
                if (resource.week == this.$route.query.week) {
                    return resource;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    padding-top: 20px;
}
.is-child {
    &:hover {
        cursor: pointer;
    }
}
</style>
