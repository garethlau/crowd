<template>
    <b-navbar>
        <template slot="brand">
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <a class="button is-primary">
                    <strong>
                        {{ this.theme.abreviation }}
                    </strong>
                </a>
            </b-navbar-item>
        </template>
        <template slot="start">
            <b-navbar-item href="#">
                Home
            </b-navbar-item>
            <b-navbar-item href="#">
                Documentation
            </b-navbar-item>
            <b-navbar-dropdown label="Info">
                <b-navbar-item href="#">
                    About
                </b-navbar-item>
                <b-navbar-item href="#">
                    Contact
                </b-navbar-item>
            </b-navbar-dropdown>
        </template>

        <template slot="end">
            <b-navbar-item tag="div">
                <div class="buttons">
                    <router-link :to="{ path: '/signup' }">
                        <a class="button is-primary">
                            <strong>Sign up</strong>
                        </a>
                    </router-link>

                    <router-link :to="{ path: '/login' }">
                        <a class="button is-light">
                            Log in
                        </a>
                    </router-link>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>
export default {
    name: 'Navbar',
    props: ['theme']
};
</script>
