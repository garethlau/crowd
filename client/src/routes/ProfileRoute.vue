<template>
    <h1>
        <section>
            <b-tabs v-model="activeTab" position="is-centered">
                <b-tab-item label="Overview"> </b-tab-item>

                <b-tab-item label="Favourites">
                    <FavouritesList />
                </b-tab-item>

                <b-tab-item label="Classes">
                    <ClassList />
                </b-tab-item>

                <b-tab-item label="Comments"> </b-tab-item>
            </b-tabs>
        </section>
    </h1>
</template>

<script>
import FavouritesList from '../components/profile/FavouritesList';
import ClassList from '../components/profile/ClassList';

export default {
    name: 'ProfileRoute',
    components: { FavouritesList, ClassList },
    data() {
        return {
            activeTab: 0
        };
    },

    created() {}
};
</script>
