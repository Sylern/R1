export default {
    name: 'pageNesting',
    data() {
        return {
        }
    },
    computed: {
        iframeUrl() {
            return this.$app.isNull(this.$route.query.iframeUrl) ? '' : decodeURIComponent(this.$route.query.iframeUrl);
        }
    }
}