<template>
    <div>
        <div v-for="course in courses" :key="course">
            <router-link :to="{ path: `/${course}` }">
                {{ course }}
            </router-link>
        </div>
    </div>
</template>

<script>
import AuthService from '../../services/AuthService';
const authService = new AuthService();

export default {
    name: 'ClassList',
    data() {
        return {
            courses: null
        };
    },
    created() {
        authService
            .isAuth()
            .then(user => {
                console.log('user is ', user);
                this.courses = user.classes;
            })
            .catch(err => {
                console.log(err);
                this.courses = null;
            });
    }
};
</script>
