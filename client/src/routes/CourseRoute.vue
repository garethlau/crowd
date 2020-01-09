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
                <div class="container">
                    <b-tabs
                        vertical
                        v-model="currentTab"
                        @change="changeWeek"
                        expanded
                        size="is-medium"
                    >
                        <b-tab-item
                            v-for="number in weeks"
                            :key="number"
                            :label="'Week ' + number"
                        >
                            <WeekLayout
                                :weekNumber="number"
                                :courseCode="courseCode"
                            />
                        </b-tab-item>
                    </b-tabs>
                </div>
            </section>
            <div class="container">
                <CreateButton v-bind:courseCode="courseCode" />
            </div>
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
                    v-bind:props="resourceModalProps"
                    @clickedClose="closeModal"
                />
            </b-modal>
        </section>
    </div>
</template>

<script>
import notificationMixin from '../mixins/notificationMixin';
import CreateButton from '../components/CreateButton';
import WeekLayout from '../components/WeekLayout';
import ResourceModal from '../components/ResourceModal';
import ResourceService from '../services/ResourceService';
const resourceService = new ResourceService();

export default {
    name: 'CourseRoute',
    components: { CreateButton, WeekLayout, ResourceModal },
    data() {
        return {
            courseCode: '',
            weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            currentTab: 3,
            resourceModalProps: {},
            isModalActive: false
        };
    },
    mixins: [notificationMixin],
    methods: {
        changeWeek(tabIndex) {
            this.weekNumber = tabIndex + 1;
        },
        closeModal() {
            // hide the modal
            this.isModalActive = false;
            // clear query parameters
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
        // add event listener for escape key press
        window.addEventListener('keydown', e => {
            if (e.key == 'Escape') {
                this.closeModal();
            }
        });
    },
    watch: {
        $route(to) {
            this.courseCode = to.params.courseCode.toUpperCase();
        }
    },
    mounted() {
        // set the current tab
        this.currentTab = this.$route.query.week - 1 || 0;
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
