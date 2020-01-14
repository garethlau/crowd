<template>
    <div class="container">
        <ResourceTile
            v-for="resource in this.favs"
            v-bind:key="resource.id"
            v-bind:data="resource"
            @clickedResource="goToResource"
            @clickedUnfav="unfav"
        />
    </div>
</template>

<script>
import ResourceTile from '../ResourceTile';
import ResourceService from '../../services/ResourceService';
const resourceService = new ResourceService();

/*
const reflect = promise =>
    promise.then(
        v => ({ v, status: 'fulfilled' }),
        e => ({ e, status: 'rejected' })
    );

*/
export default {
    name: 'FavouritesList',
    data() {
        return {
            favs: null // array of resource IDs
        };
    },
    components: { ResourceTile },
    methods: {
        goToResource(resource) {
            // create resource specific url
            let { courseCode, week, _id } = resource;
            this.$router.push(`/${courseCode}?week=${week}&id=${_id}`);
        },
        unfav(resourceId) {
            // remove the unfavourited resources
            this.favs = this.favs.filter(resource => {
                if (resource._id != resourceId) {
                    return resource;
                }
            });
        },
        getFavs() {
            resourceService
                .getFavs()
                .then(resourceIds => {
                    Promise.all(
                        resourceIds.map(resourceId => {
                            return resourceService.getResources(
                                null,
                                null,
                                resourceId
                            );
                        })
                    )
                        .then(values => {
                            console.log(values);
                            this.favs = values.map(res => {
                                return res.data.resource;
                            });
                            console.log(this.favs);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    created() {
        this.getFavs();
    }
};
</script>
