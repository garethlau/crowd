export const store = {
    state: {
        user: {
            firstName: 'Gareth',
            lastName: 'Lau',
            classes: ['ES1036', 'AM1413']
        }
    },
    setUser(user) {
        this.state.user = user;
    },
    clearUser() {
        this.state.user = null;
    }
};
