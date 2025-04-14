export default {
    components: {},
    props: {
        template: {
            type: String,
            default: ''
        }
    },
    data() {
        return {

        }
    },
    render(h) {
        if (this.template) {
            const parent = this.parent || this.$parent.$parent.$parent.$parent
            const {
                $data: parentData = {},
                $props: parentProps = {},
                $options: parentOptions = {}
            } = parent;
            const {
                components: parentComponents = {},
                computed: parentComputed = {},
                methods: parentMethods = {}
            } = parentOptions;
            const {
                $data = {},
                $props = {},
                $options: { methods = {}, computed = {}, components = {} } = {}
            } = this;
            const passthrough = {
                $data: {},
                $props: {},
                $options: {},
                components: {},
                computed: {},
                methods: {}
            };
            Object.keys(parentData).forEach(e => {
                if (typeof $data[e] === "undefined")
                    passthrough.$data[e] = parentData[e];
            });
            Object.keys(parentProps).forEach(e => {
                if (typeof $props[e] === "undefined")
                    passthrough.$props[e] = parentProps[e];
            });
            Object.keys(parentMethods).forEach(e => {
                if (typeof methods[e] === "undefined")
                    passthrough.methods[e] = parentMethods[e];
            });
            Object.keys(parentComputed).forEach(e => {
                if (typeof computed[e] === "undefined")
                    passthrough.computed[e] = parentComputed[e];
            });
            Object.keys(parentMethods).forEach(e => {
                if (typeof methods[e] === "undefined")
                    passthrough.methods[e] = parentMethods[e];
            });
            const dynamic = Vue.extend({
                template: this.template || "<div></div>"
            });
            return h(dynamic, {});
        }
    },
    computed: {

    },
    mounted() {

    },
    methods: {

    }
}