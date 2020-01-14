<template>
    <div>
        <Navbar v-bind:theme="theme"></Navbar>
        <router-view :key="$route.fullPath"></router-view>
        <Footer></Footer>
    </div>
</template>

<script>
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default {
    name: 'app',
    components: { Navbar, Footer },
    data() {
        return {
            theme: {
                institution: 'Western University',
                abreviation: 'UWO'
            }
        };
    }
};
</script>

<style lang="scss">
// Import Bulma's core
@import '~bulma/sass/utilities/_all';

// Import global styles
@import './styles/global.scss';

// Import Bulma and Buefy styles
@import '~bulma';
@import '~buefy/src/scss/buefy';
</style>
