export default {
    props: {
        checked: { type: Boolean, default: false },
    },
    data() {
        return {
            
        }
    },
    methods: {
        handleChange(e) {
            this.$emit('change', e);
        }
    }
}