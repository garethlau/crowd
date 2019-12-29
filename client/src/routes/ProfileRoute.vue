<template>
    <h1>
        nice
    </h1>
</template>

<script>
import { store } from '../store';

export default {
    name: 'ProfileRoute',
    data() {
        return {
            storeState: store.state
        }
    },
};
</script>
