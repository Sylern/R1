import { stockApi } from "@/api/index.js";
import { mapState } from "vuex";
export default {
    components: {  },
    name: 'home',
    data() {
        return {
            activeMask: -2,                         // -1 显示前台收银  >-1 显示引导页
            showPrivateRoomTips: false,             // 棋牌预结弹窗提醒
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },

    mounted() {
        
    },
    methods: {
        handleShowPrivateRoomTips() {
            this.showPrivateRoomTips = true;
            this.$refs.refPrivateRoomTips && this.$refs.refPrivateRoomTips.show();
        },
        handleSubmit(number, type) {            // 提交引导显示次数
            this.activeMask = -1;
            let sv_novice_count = type === 'add' ? this.$store.state.maskEntity.count + number : number;
            stockApi.OperateNoviceGuide({ id: this.$store.state.maskEntity.id, sv_novice_count: sv_novice_count }).then(res => {
                this.$store.commit('updateMaskEntity', { id: -1, count: 0 });
            });
        },
    }
};