export default {
    props: {},
    data() {
        return {

        }
    },
    computed: {
        showHelpTitle() {
            // return window.parent.location.href.indexOf('pageNesting') === -1 && !this.$store.state.showHelp
            return !this.$store.state.showHelp
        }
    },
    methods: {
        onShowHelp() {
            this.$store.commit('updateShowHelp', true);
        },
    }
}