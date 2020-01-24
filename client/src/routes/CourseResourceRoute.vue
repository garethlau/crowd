<template>
    <div>
        <div v-if="this.$route.query.id">
            <b-loading :is-full-page="false" :active="true"> </b-loading>
        </div>
        <div v-else>
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

            <section>
                <div class="container search-container">
                    <div class="field has-addons">
                        <p class="control">
                            <b-dropdown aria-role="list">
                                <button
                                    class="button is-primary"
                                    slot="trigger"
                                >
                                    <b-icon
                                        pack="fas"
                                        class="clickable"
                                        icon="filter"
                                        size="is-small"
                                    >
                                    </b-icon>
                                    <span>Sort</span>
                                    <b-icon
                                        pack="fas"
                                        class="clickable"
                                        icon="caret-down"
                                        size="is-small"
                                    >
                                    </b-icon>
                                </button>

                                <b-dropdown-item
                                    aria-role="listitem"
                                    @click="sortBy('week-low-to-high')"
                                    >Week (Low to High)</b-dropdown-item
                                >
                                <b-dropdown-item
                                    aria-role="listitem"
                                    @click="sortBy('week-high-to-low')"
                                    >Week (High to Low)</b-dropdown-item
                                >
                                <b-dropdown-item
                                    aria-role="listitem"
                                    @click="sortBy('recent')"
                                    >Recent</b-dropdown-item
                                >
                            </b-dropdown>
                        </p>
                        <b-field>
                            <b-input
                                placeholder="Search..."
                                type="search"
                                icon-pack="fas"
                                icon="search"
                                v-model="query"
                                @input="search"
                            >
                            </b-input>
                        </b-field>
                    </div>
                </div>
            </section>

            <section>
                <div class="container">
                    <b-field grouped group-multiline>
                        <div v-for="(filter, index) in filters" :key="index">
                            <b-tag
                                type="is-primary"
                                attached
                                aria-close-label="Close tag"
                                closable
                                @close="removeFilter(filter)"
                            >
                                {{ filter }}
                            </b-tag>
                        </div>
                    </b-field>
                </div>
            </section>

            <section>
                <div class="container">
                    <div class="columns">
                        <div class="column is-1 center-text">
                            Created
                        </div>
                        <div class="column is-1 center-text">
                            Week
                        </div>
                        <div class="column is-1 center-text">
                            Type
                        </div>
                        <div class="column">
                            Title
                        </div>
                        <div class="column is-2 center-text">
                            Author
                        </div>
                        <div class="column is-2 center-text">
                            Stuff
                        </div>
                    </div>
                    <div v-for="resource in this.resources" :key="resource._id">
                        <ResourceCard
                            :title="resource.title"
                            :week="resource.week"
                            :firstName="resource.author.firstName"
                            :lastName="resource.author.lastName"
                            :type="resource.content.type"
                            :createdAt="resource.created_at"
                            :id="resource._id"
                            :data="resource.content.data"
                            @clickedResource="launchModal"
                        />
                    </div>
                </div>
            </section>
        </div>
        <section>
            <b-modal
                :active.sync="isModalActive"
                has-modal-card
                :can-cancel="false"
                full-screen
                scroll="keep"
            >
                <ResourceModal
                    :title="resourceModalProps.title"
                    :week="resourceModalProps.week"
                    :firstName="resourceModalProps.firstName"
                    :lastName="resourceModalProps.lastName"
                    :type="resourceModalProps.type"
                    :createdAt="resourceModalProps.createdAt"
                    :id="resourceModalProps.id"
                    :data="resourceModalProps.data"
                    @clickedClose="closeModal"
                />
            </b-modal>
        </section>
    </div>
</template>

<script>
import ResourceModal from '../components/ResourceModal';
import ResourceCard from '../components/ResourceCard';
import ResourceService from '../services/ResourceService';

const resourceService = new ResourceService();

export default {
    name: 'CourseResourceRoute',
    data() {
        return {
            groundTruthResources: [],
            resources: [],
            resourceModalProps: {},
            isModalActive: false,
            courseCode: '',
            filters: ['Week', 'video'],
            query: ''
        };
    },
    components: { ResourceModal, ResourceCard },
    methods: {
        search() {
            let filtered = this.groundTruthResources.filter(resource => {
                if (
                    resource.title
                        .toUpperCase()
                        .includes(this.query.toUpperCase()) ||
                    resource.content.data
                        .toString()
                        .toUpperCase()
                        .includes(this.query.toUpperCase()) ||
                    resource.week
                        .toUpperCase()
                        .includes(this.query.toUpperCase()) ||
                    resource.content.type
                        .toUpperCase()
                        .includes(this.query.toUpperCase())
                ) {
                    return resource;
                }
            });
            if (this.query == '') {
                this.resources = this.groundTruthResources;
            } else {
                this.resources = filtered;
            }
        },
        removeFilter(filter) {
            const index = this.filters.indexOf(filter);
            if (index > -1) {
                this.filters.splice(index, 1);
            }
        },
        sortBy(sortMethod) {
            if (sortMethod == 'week-high-to-low') {
                let sorted = this.groundTruthResources.sort((a, b) => {
                    return Number(a.week) < Number(b.week) ? 1 : -1;
                });
                this.resources = sorted;
            } else if (sortMethod == 'week-low-to-high') {
                let sorted = this.groundTruthResources.sort((a, b) =>
                    Number(a.week) > Number(b.week) ? 1 : -1
                );
                this.resources = sorted;
            } else if (sortMethod == 'recent') {
                let sorted = this.groundTruthResources.sort((a, b) => {
                    return a.created_at < b.created_at ? 1 : -1;
                });
                this.resources = sorted;
            }
        },
        launchModal(resourceData) {
            this.resourceModalProps['courseCode'] = this.courseCode;
            this.resourceModalProps = {
                title: resourceData.title,
                week: resourceData.week,
                firstName: resourceData.firstName,
                lastName: resourceData.lastName,
                type: resourceData.type,
                createdAt: resourceData.type,
                id: resourceData.id,
                data: resourceData.data
            };
            this.isModalActive = true;
        },
        closeModal() {
            // close the modal
            this.isModalActive = false;
            // clear resource modal props
            this.resourceModalProps = {};
            // clear query pararmters if any
            this.$router.push(this.$route.path);
        }
    },
    created() {
        this.courseCode = this.$route.params.courseCode.toUpperCase();

        // check if the user is requesting a sepcific resource by id
        if (this.$route.query.id) {
            resourceService
                .getResources(null, null, this.$route.query.id)
                .then(res => {
                    this.resourceModalProps['resource'] = res.data.resource;
                    this.isModalActive = true;
                })
                .catch(err => {
                    console.log('err is', err);
                    this.resourceModalProps['resource'] = null;
                    this.toast(err, 'is-danger', 3000);
                });
        }
        // get all the resources for this course
        else {
            resourceService
                .getResources(this.courseCode)
                .then(res => {
                    this.groundTruthResources = res.data.resources;
                    this.resources = res.data.resources;
                    this.sortBy('week-low-to-high');
                })
                .catch(err => {
                    this.toast(err, 'is-danger', 3000);
                });
        }

        // add event listener for escape key press
        window.addEventListener('keydown', e => {
            if (e.key == 'Escape') {
                this.closeModal();
            }
        });
    }
};
</script>

<style lang="scss" scoped>
.center-text {
    text-align: center;
}
.search-container {
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
