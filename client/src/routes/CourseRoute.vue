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

        <section>
            <div class="container">
                <b-tabs vertical @change="changeWeek" expanded size="is-medium">
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
</template>

<script>
/**
 * Gareth's notes
 * Its much better to query for all the resources for a given page than to have each resource item make a request for its own metadata.
 * SOOOOOO this compoennt will mkae teh requests, get all the metadata for the resources, and will just pass it
 * as props to a Resource component. This means we also need to make onChange handlers for upvotes, and comments to keep track of these changes
 *
 */
import notificationMixin from '../mixins/notificationMixin';
import CreateButton from '../components/CreateButton';
import WeekLayout from '../components/WeekLayout';

export default {
    name: 'CourseRoute',
    components: { CreateButton, WeekLayout },
    data() {
        return {
            courseCode: '',
            weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        };
    },
    mixins: [notificationMixin],
    methods: {
        changeWeek(tabIndex) {
            this.weekNumber = tabIndex + 1;
        }
    },
    created() {
        this.courseCode = this.$route.params.courseCode.toUpperCase();
    },
    watch: {
        $route(to) {
            this.courseCode = to.params.courseCode.toUpperCase();
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
