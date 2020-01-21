<template>
    <div>
        <div class="columns is-mobile">
            <div class="column is-1 center-text">
                {{ formatDate(createdAt) }}
            </div>
            <div class="column is-1 center-text">
                {{ week }}
            </div>
            <div class="column is-1 center-text">
                {{ type }}
            </div>
            <div class="column" v-on:click="launchModal(id)">
                {{ title }}
            </div>
            <div class="column is-2 center-text">
                {{ firstName }} {{ lastName }}
            </div>
            <div class="column is-2 center-text">
                <div class="block">
                    <b-icon
                        pack="far"
                        class="clickable fade-color fade"
                        icon="thumbs-up"
                    >
                    </b-icon>
                    0
                    <b-icon
                        pack="far"
                        class="clickable fade-color fade"
                        icon="thumbs-down"
                    >
                    </b-icon>

                    <b-icon
                        pack="far"
                        class="clickable fade-color fade"
                        icon="star"
                    >
                    </b-icon>
                </div>
            </div>
        </div>
        <div class="hr"></div>
    </div>
</template>

<script>
export default {
    name: 'ResourceCard',
    props: [
        'title',
        'week',
        'firstName',
        'lastName',
        'type',
        'createdAt',
        'id',
        'data'
    ],
    methods: {
        formatDate(d) {
            let month = new Date(d).getMonth();
            let year = new Date(d).getFullYear();
            let date = new Date(d).getDate();
            return `${date}/${month}/${year}`;
        },
        launchModal() {
            this.$emit('clickedResource', {
                title: this.title,
                weel: this.week,
                firstName: this.firstName,
                lastName: this.lastName,
                type: this.type,
                createdAt: this.type,
                id: this.id,
                data: this.data
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.main {
    border-width: 0px 0px 2px 0px;
    border-color: grey;
    border-style: solid;
    margin-bottom: 10px;
}
.center-text {
    text-align: center;
}
.hr {
    display: block;
    unicode-bidi: isolate;
    margin-block-start: 0.5em;
    margin-block-end: 0.5em;
    margin-inline-start: auto;
    margin-inline-end: auto;
    overflow: hidden;
    border-style: inset;
    border-width: 1px;
}
</style>
