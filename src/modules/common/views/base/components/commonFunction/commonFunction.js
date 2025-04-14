export default {
    props: {
        visible: { type: Boolean, default: () => { return false } },
    },
    data() {
        return {

        }
    },
    computed: {
        isShow: {
            get() {
                return this.visible;
            },
            set(e) {
                this.$emit('updata', e, 'commonFunction')
            }
        }
    }
}