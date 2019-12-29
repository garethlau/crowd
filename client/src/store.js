export const store = {
    state: {
        user: null
    },
    setUser(user) {
        this.state.user = user;
    },
    clearUser() {
        this.state.user = null;
    }
}