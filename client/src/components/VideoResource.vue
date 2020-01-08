<template>
    <div class="video-container">
        <youtube
            :video-id="videoId"
            :player-vars="playerVars"
            @playing="playing"
        ></youtube>
    </div>
</template>

<script>
export default {
    name: 'VideoResource',
    props: ['data'],
    data() {
        return {
            playerVars: {
                autoplay: 1
            }
        };
    },
    methods: {
        playing() {
            console.log('Video is playing');
        }
    },
    computed: {
        videoId() {
            let id = this.$youtube.getIdFromUrl(this.data);
            console.log(id);
            return id;
        }
    }
};
</script>

<style lang="scss">
iframe {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    height: 500px !important;
    max-width: 800px; /* Also helpful. Optional. */
}
</style>

<style lang="scss" scoped>
.video-container {
    text-align: center;
}
</style>
