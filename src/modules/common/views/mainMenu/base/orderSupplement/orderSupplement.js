import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'orderSupplement',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            keyWord: '',
            supplementTime: '',                     // 补单时间
            timeList: [
                {
                    label: '2020-08-09',
                    value: '2020-08-09'
                },
                {
                    label: '2020-08-08',
                    value: '2020-08-08'
                },
                {
                    label: '2020-08-07',
                    value: '2020-08-07'
                },
                {
                    label: '2020-08-06',
                    value: '2020-08-06'
                },
                {
                    label: '2020-08-05',
                    value: '2020-08-05'
                }
            ]
        }
    },
    computed: {
        ...mapState(['memberList']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        this.$refs.orderSupplement.focus();
                    })
                }
            }
        }
    },
    mounted() {
        this.getMemberInfo();
    },
    methods: {
        ...mapMutations(['update']),
        listenKeyup(e) {
            let code = parseInt(e.keyCode);
            switch (code) {
                case 13:                                      // Enter
                    this.handleEnter();
                    return;
                case 27:                                      // Esc
                    this.closeDialog();
                    return;
                default:
                    console.log('orderSupplement key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
            this.$root.$emit('keyCode', 'orderSupplement');
        },
        getMemberInfo() {
            // stockApi.getMemberInfo().then(res =>{
            //     if(res){
            //         console.log(res);
            //     }
            // });
        },
        handleEnter() {
            this.closeDialog();
        },
    }
};