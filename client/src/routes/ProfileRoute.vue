<template>
    <h1>
        <section>
            <b-tabs v-model="activeTab">
                <b-tab-item label="Overview">
                    
                </b-tab-item>

                <b-tab-item label="Favourites">
                    
                </b-tab-item>

                <b-tab-item :visible="showBooks" label="Classes">

                </b-tab-item>

                <b-tab-item label="Comments">
    
                </b-tab-item>
            </b-tabs>
        </section>
    </h1>
</template>

<script>
import { store } from '../store';

export default {
    name: 'ProfileRoute',
    data() {
        return {
            storeState: store.state,
            activeTab: 0
        };
    },
    methods: {},
    beforeMount() {
        console.log(this.storeState.user);
    }
};
</script>
