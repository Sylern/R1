import { stockApi } from "@/api/index.js";
import { mapMutations, mapState, mapActions } from 'vuex';
export default {
    name: 'discount',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            currentId: ''
        }
    },
    computed: {
        ...mapState(['memberInfo', 'queryUpdateCartting']),
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
                    this.currentId = this.memberInfo.sv_wallet_id;
                }
            }
        }
    },
    mounted() {

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
                    console.log('discount key ' + code + ' is click');
                    return;
            }
        },
        closeDialog() {
            this.dialogVisible = 'close';
        },
        handlePrevent() {                                           // 事件阻止
            return false;
        },
        handleItemClick(item) {
            this.currentId = item.sv_wallet_id;
        },
        handleEnter() {
            this.closeDialog();
            this.update({
                key: 'memberInfo',
                data: {
                    ...this.memberInfo,
                    sv_wallet_id: this.currentId
                }
            });
            this.$root.$emit('setStoreCard');
        }
    }
};