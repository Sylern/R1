import runtimeTemplate from '../runtime-template'
export default {
    components: { runtimeTemplate },
    props: {
        prop: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        fixed: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: ''
        },
        center: {
            type: Boolean,
            default: false
        },
        isTitle: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            
        }
    },
    computed: {
        cellCss() {
            const divWidth = this.$app.isNull(this.width) ? { flex: 1 } : { width: this.width + 'px' }
            const align = this.center ? { justifyContent: 'center' } : {}
            const fixed = parseInt(this.fixed) > 0 ? { left: parseInt(this.fixed) + 'px' } : {};
            return { ...divWidth, ...align, ...fixed }
        },
    },
    mounted() {

    },
    methods: {
        
    }
}