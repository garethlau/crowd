<template>
    <div class="modal-card scrollable">
        <div class="exit-button clickable" @click="$emit('clickedClose')">
            <b-icon pack="far" icon="times-circle" type="is-white"> </b-icon>
        </div>
        <section class="hero is-primary">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                        {{ this.courseCode }}
                    </h1>
                </div>
            </div>
        </section>
        <section class="hero">
            <div class="hero-body">
                <div class="container">
                    <h2 class="subtitle">
                        Posted by
                        {{
                            capitalizeFirst(props.resource.author.firstName) +
                                ' ' +
                                capitalizeFirst(props.resource.author.lastName)
                        }}
                    </h2>
                    <h1 class="title">
                        {{ props.resource.title }}
                    </h1>
                </div>
            </div>
        </section>
        <section>
            <div class="container" :style="resourceContainer">
                <div v-if="props.resource.content.type == 'YOUTUBE'">
                    <VideoResource :data="props.resource.content.data" />
                </div>
                <div v-else-if="props.resource.content.type == 'LINK'">
                    Link
                    {{ props.resource.content.data }}
                </div>
                <div v-else-if="props.resource.content.type == 'TEXT'">
                    Text
                    {{ props.resource.content.data }}
                </div>
                <div v-else-if="props.resource.content.type == 'FILE'">
                    FIEL
                    <div
                        v-for="data in props.resource.content.data"
                        :key="data.id"
                        @click="downloadFile(data.filename, data.id)"
                    >
                        {{ data.filename }}
                    </div>
                </div>
                <div v-else class="subtitle">
                    No format???
                    {{ props.resource.content.data }}
                </div>
            </div>
        </section>
        <section>
            <div class="container">
                <ComposeComment
                    :resourceId="props.resource._id"
                    @commentAdded="refreshComments"
                />
            </div>
        </section>

        <section>
            <div class="container comments" v-if="showComments">
                <div>
                    <CommentTree
                        v-for="comment in this.comments"
                        :key="comment._id"
                        :comment="comment"
                        :resourceId="comment.resourceId"
                        :offset="0"
                        ref="commentTree"
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<script>
/**

        <button class="button" type="button" @click="$emit('clickedClose')">
            Close
        </button>
 */

/*
TO close all comments

          <div class="container">
                <b-button
                    v-if="showComments"
                    @click="toggleComments"
                    type="is-primary"
                    icon-left="minus-circle"
                >
                    Hide Comments
                </b-button>
                <b-button
                    v-else
                    @click="toggleComments"
                    type="is-primary"
                    icon-left="plus-circle"
                >
                    Show Comments
                </b-button>
            </div>
*/
/*
each comment has a resourceId
nested comments dont have parentIds

in each Comment.vue file, call getComments to get the children of this current comment
*/
import stringMixin from '../mixins/stringMixin';
import CommentTree from './CommentTree';
import ComposeComment from './ComposeComment';
import CommentService from '../services/CommentService';
import VideoResource from './VideoResource';
import ResourceService from '../services/ResourceService';
const commentService = new CommentService();
const resourceService = new ResourceService();

export default {
    name: 'ResourceModal',
    props: ['props'],
    mixins: [stringMixin],
    components: { CommentTree, ComposeComment, VideoResource },
    data() {
        return {
            courseCode: '',
            showComments: true,
            comments: []
        };
    },
    methods: {
        getMobileOperatingSystem() {
            let userAgent =
                navigator.userAgent || navigator.vendor || window.opera;
            if (/windows phone/i.test(userAgent)) return 'Windows Phone';
            if (/android/i.test(userAgent)) return 'Android';
            if (/ipad|iPhone|iPod/.test(userAgent) && !window.MSStream)
                return 'iOS';
            return 'Unknown';
        },
        saveFile(data, filename, filetype) {
            let blobData = [data];
            let blob = new Blob(blobData, { type: filetype });
            let os = this.getMobileOperatingSystem();
            if (os === 'iOS') {
                let reader = new FileReader();
                reader.onload = e => {
                    console.log(e);
                    window.location.href = reader.result;
                };
                reader.readAsDataURL(blob);
            } else {
                let blobURL = window.URL.createObjectURL(blob);
                let tempLink = document.createElement('a');
                tempLink.style.display = 'none';
                tempLink.href = blobURL;
                tempLink.setAttribute('download', filename);
                if (typeof tempLink.download === 'undefined') {
                    tempLink.setAttribute('target', '_blank');
                }

                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(blobURL);
            }
        },
        downloadFile(filename, fileId) {
            console.log('donwloading file with id', fileId);
            resourceService
                .downloadFile(fileId)
                .then(res => {
                    console.log(res);
                    this.saveFile(res.data, filename, res.data.type);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        toggleComments() {
            this.showComments = !this.showComments;
        },
        refreshComments() {
            console.log('REFRESH COMMENTS');
            this.setComments();
        },
        setComments() {
            commentService
                .getComments(this.props.resource._id, null)
                .then(res => {
                    this.comments = res.data.comments;
                })
                .catch(err => {
                    console.log(err);
                    this.comments = [];
                });
        }
    },
    mounted() {
        this.courseCode = this.$route.params.courseCode;
        this.setComments();
    },
    computed: {
        resourceContainer() {
            if (this.props.resource.content.type == 'video') {
                return 'min-height: 500px';
            }
            return 'min-height: 200px';
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../styles/mixins';
@import '../styles/global';
.modal {
    background-color: white;
}
.scrollable {
    overflow-y: scroll;
}
.comments {
    @include sm {
        padding-left: 15px;
    }
    @include md {
        padding-left: 20px;
    }
}
.exit-button {
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>
