<template>
    <div class="container main-container">
        <div class="columns">
            <div class="column">
                <section>
                    <b-field label="Title">
                        <b-input v-model="title"></b-input>
                    </b-field>
                    <b-field label="Course">
                        <b-input v-model="courseCode"></b-input>
                    </b-field>

                    <b-field>
                        <b-select
                            @input="updateWeek"
                            placeholder="Week"
                            icon="calendar-alt"
                        >
                            <option
                                v-for="weekNum in weeks"
                                :key="weekNum"
                                :value="weekNum"
                            >
                                Week {{ weekNum }}
                            </option>
                        </b-select>
                    </b-field>

                    <div class="block">
                        <b-field label="Type"> </b-field>
                        <b-radio v-model="type" name="name" native-value="TEXT">
                            Text
                        </b-radio>
                        <b-radio v-model="type" name="name" native-value="FILE">
                            File
                        </b-radio>
                        <b-radio v-model="type" name="name" native-value="LINK">
                            Link
                        </b-radio>
                        <b-radio
                            v-model="type"
                            name="name"
                            native-value="YOUTUBE"
                        >
                            Youtube Video
                        </b-radio>
                    </div>
                    <div v-show="type === 'TEXT'">
                        <b-field label="Text">
                            <b-input
                                type="textarea"
                                v-model="textContent"
                            ></b-input>
                        </b-field>
                    </div>
                    <div v-show="type === 'FILE'">
                        <b-field>
                            <b-upload v-model="dropFiles" multiple drag-drop>
                                <section class="section">
                                    <div class="content has-text-centered">
                                        <p>
                                            <b-icon
                                                icon="upload"
                                                size="is-large"
                                            >
                                            </b-icon>
                                        </p>
                                        <p>
                                            Drop your files here or click to
                                            upload
                                        </p>
                                    </div>
                                </section>
                            </b-upload>
                        </b-field>
                        <div class="tags">
                            <span
                                v-for="(file, index) in dropFiles"
                                :key="index"
                                class="tag is-primary"
                            >
                                {{ file.name }}
                                <button
                                    class="delete is-small"
                                    type="button"
                                    @click="deleteDropFile(index)"
                                ></button>
                            </span>
                        </div>
                    </div>
                    <div v-show="type === 'LINK'">
                        <b-field label="Link">
                            <b-input v-model="textContent"></b-input>
                        </b-field>
                    </div>
                    <div v-show="type === 'YOUTUBE'">
                        <b-field label="Video Link">
                            <b-input v-model="textContent"></b-input>
                        </b-field>
                    </div>
                </section>
            </div>
        </div>
        <b-button type="is-primary" v-on:click="submit">Submit</b-button>
    </div>
</template>

<script>
//import AddContent from "../src/services/AddContent";
//const addContent = new AddContent()
import notificationMixin from '../mixins/notificationMixin';
import ResourceService from '../services/ResourceService';
const resourceService = new ResourceService();

export default {
    name: 'CreateResourceRoute',
    data() {
        return {
            title: '',
            type: 'TEXT',
            textContent: '',
            courseCode: '',
            weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            weekNum: 0,
            dropFiles: []
        };
    },
    mixins: [notificationMixin],
    created() {
        if (this.$route.query.courseCode) {
            this.courseCode = this.$route.query.courseCode;
        }
    },
    methods: {
        updateWeek(input) {
            this.weekNum = input;
        },
        deleteDropFile(index) {
            this.dropFiles.splice(index, 1);
        },
        reset() {
            this.title = '';
            this.textContent = '';
            this.dropFiles = [];
        },
        submit: function() {
            //console.log(this.type);
            const url = '/api/v1/content/create';
            var data;
            if (this.type === 'TEXT' || this.type === 'LINK') {
                resourceService
                    .newResource(
                        this.type,
                        this.title,
                        this.courseCode,
                        this.weekNum,
                        this.textContent
                    )
                    .then(res => {
                        this.toast(res, 'is-success', 2000);
                        this.reset();
                    })
                    .catch(err => {
                        this.toast(err, 'is-danger', 3000);
                    });
            } else if (this.type === 'FILE') {
                console.log('Upload files', this.dropFiles);
                resourceService
                    .newResource(
                        this.type,
                        this.title,
                        this.courseCode,
                        this.weekNum,
                        this.dropFiles
                    )
                    .then(res => {
                        // toast
                        this.toast(res, 'is-success', 2000);
                        this.reset();
                    })
                    .catch(err => {
                        this.toast(err, 'is-danger', 3000);
                    });
            } else if (this.type === 'YOUTUBE') {
                console.log(this.textContent);
                if (
                    !this.textContent.includes('https://www.youtube.com/watch')
                ) {
                    // this is an invalid youtube link
                    this.toast('Invalid URL.', 'is-danger', 3000);
                    return;
                }
                resourceService
                    .newResource(
                        this.type,
                        this.title,
                        this.courseCode,
                        this.weekNum,
                        this.textContent
                    )
                    .then(res => {
                        this.toast(res, 'is-success', 2000);
                        this.reset();
                    })
                    .catch(err => {
                        this.toast(err, 'is-danger', 3000);
                    });
            } else {
                data = {
                    nothing: 'nothing'
                };
            }
            console.log(data, url, this.weekNum);
        }
    }
};
</script>

<style lang="scss" scoped>
.main-container {
    min-height: calc(100vh - 52px);
}
</style>
