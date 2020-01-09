<template>
    <div>
        <div>
            <div v-if="resources.length == 0">
                No resources here : I dont like that this shows up no matter
                what. Look into possibly adding a delay or loading animation
                while when filtering the resources.
            </div>
            <div v-else>
                <ResourceTile
                    v-for="resource in resources"
                    v-bind:key="resource.id"
                    v-bind:data="resource"
                    @clickedResource="launchResourceModal"
                />
            </div>
            <b-loading :is-full-page="false" :active="!loaded"> </b-loading>
        </div>

        <section>
            <b-modal
                :active.sync="isModalActive"
                has-modal-card
                can-cancel="[]"
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
import ResourceTile from './ResourceTile';
import ResourceModal from './ResourceModal';
import ResourceService from '../services/ResourceService';
const resourceService = new ResourceService();

export default {
    name: 'WeekLayout',
    props: ['weekNumber', 'courseCode'],
    components: { ResourceModal, ResourceTile },
    data() {
        return {
            isModalActive: false,
            resourceModalProps: {},
            resources: null,
            loaded: false
        };
    },
    methods: {
        launchResourceModal(resource) {
            this.resourceModalProps['courseCode'] = this.courseCode;
            this.resourceModalProps['resource'] = resource;
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
    mounted() {
        // get the resources for the week
        resourceService
            .getResources(this.courseCode, this.weekNumber)
            .then(res => {
                this.resources = res.data.resources;
                this.loaded = true;
            })
            .catch(err => {
                console.log('err is', err);
                this.resources = [];
                this.toast(err, 'is-danger', 3000);
                this.loaded = true;
            });
    },
    created() {
        // add event listener for escape key press
        window.addEventListener('keydown', e => {
            if (e.key == 'Escape') {
                console.log('escape pressed, closing');
                this.closeModal();
            }
        });
    }
    // #A8A8A8
};
</script>
<style lang="scss" scoped></style>
