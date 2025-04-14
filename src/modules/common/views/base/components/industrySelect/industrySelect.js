import { stockApi } from '@/api/index';
import { mapMutations, mapState } from 'vuex';
export default {
    props: {
        visible: { type: Boolean, default: () => { return false } },
    },
    data() {
        return {
            isSubmitting: false,
            initduration1: false,
            initduration2: false,
            initduration3: false,
            showList: false,
            listOpacity: false,
            selectedId: '',
            isAgent: false,
            dataList: []
        }
    },
    computed: {
        ...mapState(['userInfo']),
        isShow: {
            get() {
                return this.visible;
            },
            set(e) {
                this.$emit('updata', e, 'industrySelect')
            }
        }
    },
    watch: {
        isShow: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.isAgent = this.$app.getLocalStorage('distributor_id') !== 1
                    this.getIndustryType();
                    setTimeout(() => {
                        this.initduration1 = true;
                        setTimeout(() => {
                            this.initduration2 = true;
                            setTimeout(() => {
                                this.initduration3 = true;
                                setTimeout(() => {
                                    this.showList = true;
                                    setTimeout(() => {
                                        this.listOpacity = true;
                                    }, 500)
                                }, 1000)
                            }, 700)
                        }, 700)
                    }, 300)
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapMutations(['decodeJurisdiction']),
        handleSelected(item) {
            this.selectedId = item.sv_us_industrytype;
        },
        getIndustryType() {
            basicApi.getIndustryType().then(res => {
                if (res) {
                    this.dataList = res.sort((a, b) => { return a.sv_show_sort - b.sv_show_sort }).filter(e => e.sv_is_show);
                }
            });
        },
        updateStoreInfo() {
            if (this.isSubmitting) return;
            if (this.$app.isNull(this.selectedId)) return this.$message.warning('请选择行业');
            this.isSubmitting = true;
            let query = {
                user_id: this.userInfo.user_id,
                sv_ul_name: this.userInfo.sv_ul_name,
                sv_us_shortname: this.userInfo.sv_us_shortname,
                sv_us_name: this.userInfo.sv_us_name,
                sv_us_industrytype: this.selectedId
            }
            basicApi.updateStoreInfo(query).then(res => {
                this.$message.success('保存成功');
                stockApi.getUserInfo().then(data => {
                    this.isSubmitting = false;
                    if (data) {
                        this.$app.setLocalStorage('user_Info', JSON.stringify(data));           // 用户信息
                        this.decodeJurisdiction();
                        this.$emit('submit', data)
                    }
                })
            });
        },
    },
}