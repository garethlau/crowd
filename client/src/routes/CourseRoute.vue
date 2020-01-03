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
                    No resources here :
                    I dont like that this shows up no matter what. Look into possibly adding a delay or loading animation while when filtering the resources.
                </div>
                <div v-else>
                    <ResourceTile
                        v-for="resource in filteredResources"
                        v-bind:key="resource.id"
                        v-bind:data="resource"
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
            </div>
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
import ResourceTile from '../components/ResourceTile';
import ResourceService from '../services/ResourceService';
const resourceService = new ResourceService();

export default {
    name: 'CourseRoute',
    components: { ResourceTile },
    data() {
        return {
            courseCode: '',
            resources: []
        };
    },
    methods: {
        toast(message, type, duration) {
            this.$buefy.toast.open({
                message: message,
                duration: duration,
                type: type
            });
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
                console.log('res is', res);
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
