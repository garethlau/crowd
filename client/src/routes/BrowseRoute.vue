<template>
    <div>
        <section
            class="hero is-default is-primary is-bold"
            v-bind:class="{ 'is-bigger': isFullheight }"
        >
            <div class="hero-body">
                <div class="container has-text-centered">
                    <h1 class="title">
                        Blue Caravel
                    </h1>
                    <h2 class="subtitle">
                        Discover helpful resources for any class.
                    </h2>
                    <div class="search-container ">
                        <div class="control">
                            <b-input
                                v-model="query"
                                @input="search"
                                placeholder="Find a course"
                            ></b-input>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <div class="course-list">
                <div v-for="course in filteredCourses" :key="course.courseCode">
                    {{ course.courseCode }}
                </div>
            </div>
        </section>
    </div>
</template>

<script>

/*
Line break 
<div class="hr"></div>

*/
export default {
    name: 'BrowseRoute',
    data() {
        return {
            query: '',
            isFullheight: true,
            courses: [
                {
                    courseCode: 'AM1413',
                    description: 'Intro to Calculus'
                },
                {
                    courseCode: 'ES1036',
                    description: 'Intro to programming'
                }
            ]
        };
    },
    methods: {
        search() {
            if (this.query.length != 0) {
                this.isFullheight = false;
            } else {
                this.isFullheight = true;
            }
            console.log(this.query);
        }
    },
    computed: {
        filteredCourses: function() {
            return this.courses.filter(course => {
                if (
                    course.courseCode.includes(this.query.toUpperCase()) ||
                    course.description.toLowerCase().includes(this.query.toLowerCase())
                ) {
                    return course;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../styles/global';
.course-list {
}
.search-container {
    width: 300px;
    margin: auto;
}
.search-button {
    color: white;
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
.is-default {
    transition: height 0.25s, ease-out;
    height: 300px;
    transition-property: height;
}

.is-bigger {
    transition: height 0.25s, ease-out;
    height: 100vh;
    transition-property: height;
}
.hero-body {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
