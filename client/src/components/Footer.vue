<template>
    <footer v-if="['Login', 'Signup'].indexOf($route.name) < 0" class="footer">
        <div class="content">
            <div class="columns">
                <div class="column is-four-fifths">
                    <p>
                        Find the project
                        <a href="https://github.com/garethlau/crowd">here</a>
                    </p>
                </div>
                <div class="column">
                    <strong>Built by: </strong>
                    <div
                        v-for="(contributor, index) in contributors"
                        :key="index"
                    >
                        <a :href="contributor.url">{{ contributor.name }}</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return {
            contributors: [
                {
                    name: 'garethlau',
                    url: 'https://github.com/garethlau/'
                },
                {
                    name: 'Cheneth',
                    url: 'https://github.com/Cheneth'
                },
                {
                    name: 'lyihongl',
                    url: 'https://github.com/lyihongl'
                },
                {
                    name: 'wqding',
                    url: 'https://github.com/wqding'
                }
            ]
        };
    }
};
</script>

<style lang="scss" scoped>
.footer {
    padding: 3rem 1.5rem;
    margin-top: 50px;
}
</style>