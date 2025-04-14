import { stockApi } from "@/api/index.js";
import { mapMutations, mapState } from 'vuex';
export default {
    name: 'handover',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            keyWord: '',
            supplementTime: '',                     // 时间
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
                        this.$refs.handover.focus();
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
                    console.log('key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
        },
        getMemberInfo() {
            // stockApi.getMemberInfo().then(res =>{
            //     if(res){
            //         console.log(res);
            //     }
            // });
        },
        handleChangeTime(e) {
            
        },
        handleEnter(){
            this.closeDialog();
        }
    }
};