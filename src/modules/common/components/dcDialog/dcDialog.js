export default {
    name: 'dcDialog',
    props: {
        title: {
            type: String,
            default: ''
        },
        width: {
            type: [Number,String],
            default: 1
        },
        height: {
            type: [Number,String],
            default: 0
        },
    },
    data() {
        return {
            
        }
    },
    computed: {
        contentCss(){
            return {'width': this.width +'rem', 'height': this.height +'rem'}
        }
    },
    watch: {

    },
    mounted() {
        
    },
    methods: {
        close(){
            this.$emit('close');
        },
        eventPrevent(){
            return false
        },
    }
};