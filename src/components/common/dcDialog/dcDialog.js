export default {
    name: 'dcDialog',
    props: {
        title: {
            type: String,
            default: ''
        },
        width: {
            type: [Number, String],
            default: 1
        },
        height: {
            type: [Number, String],
            default: 0
        },
        zIndex: {
            type: [Number, String],
            default: 1001
        },
        showClose: {
            type: Boolean,
            default: true
        },
        // 如果back为true，开启了返回按钮，stepLevel记录当前操作步数
        stepLevel: {
            type: Number,
            default: 0
        },
        back: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        }
    },
    computed: {
        contentCss() {
            let unitW = this.width > 30 ? 'px' : 'rem'
            let unitH = this.height > 20 ? 'px' : 'rem'
            return { 'width': this.width + unitW, 'height': this.height + unitH }
        }
    },
    watch: {

    },
    mounted() {
        this.$refs.dcDialog.focus();
    },
    methods: {
        close() {
            this.$emit('close');
        },
        handleEnter() {
            this.$emit('handleEnter');
        },
        eventPrevent() {
            return false
        },
        backHandle() {
            this.$emit('back')
        },
        handleTitleTwice() {
            this.$emit('handleTitle');
        },
    }
};