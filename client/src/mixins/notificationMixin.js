export default {
    methods: {
        toast(message, type, duration) {
            this.$buefy.toast.open({
                message: message,
                duration: duration,
                type: type
            });
        }
    }
}