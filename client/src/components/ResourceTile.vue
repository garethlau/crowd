<template>
    <div class="tile is-child box">
        <article>
            <div class="columns">
                <div class="column is-1 vote-container">
                    <div v-on:click="upvote" class="clickable">
                        <b-icon pack="fas" icon="caret-square-up"> </b-icon>
                    </div>
                    <div>
                        {{ data.upvotes }}
                    </div>
                    <div v-on:click="downvote" class="clickable">
                        <b-icon pack="fas" icon="caret-square-down"> </b-icon>
                    </div>
                </div>
                <div class="column is-8">
                    <div>
                        <p>{{ data.datePosted }} - {{ data.author }}</p>
                    </div>
                    <div>
                        <p class="title">
                            {{ data.title }}
                        </p>
                    </div>
                </div>
                <div class="column is-3">
                    <div v-if="favourite">
                        <b-icon pack="fas" icon="star"> </b-icon>
                    </div>
                    <div v-else>
                        <b-icon pack="far" icon="star"> </b-icon>
                    </div>

                </div>
            </div>
        </article>
    </div>
</template>

<script>
export default {
    name: 'ResourceTile',
    props: ['data'],
    data() {
        return {
            favourite: false
        }
    },
    methods: {
        upvote: function() {
            console.log('Upvote');
        },
        downvote: function() {
            console.log('downvote');
        }
    },
    mounted() {
        console.log(this.data);
    }
};
</script>

<style lang="scss" scoped>
.vote-container {
    text-align: center;
}
.clickable {
    &:hover {
        cursor: pointer;
    }
}
</style>