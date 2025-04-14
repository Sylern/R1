import { stockApi } from '@/api/index';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            storeList: [],     // 门店数据
            brandList: [],     // 品牌数据
            queryEntity: {     // 查询实体
                u_id: [],      // 店铺id集合
                pc_ids: [],    //一级id
                ps_ids: [],    //二级id
                pt_ids: [],    //三级id
                b_ids: [],     //品牌id
                Page: 1,       // 页码
                PageSize: 10,  // 页数
            },
            total: 0,
            dataList: [], //列表数据
            summaryData: {},//汇总
            pIds: [],
            categorys: [],
            props: {
                lazy: true,
                multiple: true,
                lazyLoad(node, resolve) {
                    const { level, value: cid } = node;
                    if (level > 0) {
                        stockApi.getproductsubcategoryList({ cid }).then(res => {
                            resolve((res.list || []).map(item => { return { label: item.sv_pc_name, value: item.id, leaf: level >= 1 } }))
                        })
                    } else {
                        resolve([])
                    }
                }
            },
        }
    },
    computed: {
        ...mapState(['userInfo']),
    },

    mounted() {
        const userId = +this.userInfo.user_id
        this.queryEntity.u_id = [userId]
        this.getstore_list()// 获取门店信息
        this.brand_lib_select(userId)
        this.getProductcategory(userId)
        this.GetProduct_Stock_Summary()
    },
    methods: {

        //#region   事件
        brandChangeHandle() {
            this.queryEntity.Page = 1;
            this.GetProduct_Stock_Summary();
        },
        categoryChangeHandle() {
            this.queryEntity.Page = 1;
            this.GetProduct_Stock_Summary();
        },
        storeChangeHandle() {
            if (this.queryEntity.u_id.length === 1) {
                this.getProductcategory(this.queryEntity.u_id[0])
                this.brand_lib_select(this.queryEntity.u_id[0])
            } else {
                this.pIds = []
                this.queryEntity.pc_ids = []
                this.queryEntity.ps_ids = []
                this.queryEntity.pt_ids = []
                this.queryEntity.b_ids = []
            }
            this.queryEntity.Page = 1;
            this.GetProduct_Stock_Summary();
        },
        checkAllStoreHandle() {
            const { queryEntity, storeList } = this
            if (queryEntity.u_id.length === storeList.length) {
                this.queryEntity.u_id = []
            } else {
                this.queryEntity.u_id = storeList.map(item => +item.value)
            }
            this.pIds = []
            this.queryEntity.b_ids = []
            this.queryEntity.Page = 1
            this.GetProduct_Stock_Summary()
        },
        checkAllBrandHandle() {
            const { queryEntity, brandList } = this
            if (queryEntity.b_ids.length === brandList.length) {
                this.queryEntity.b_ids = []
            } else {
                this.queryEntity.b_ids = brandList.map(item => +item.id)
            }
            this.queryEntity.Page = 1
            this.GetProduct_Stock_Summary()
        },
        handleCurrentSize(index, type) {                    // 页码 - 页数
            if (type === 'current') this.queryEntity.Page = index;
            if (type === 'size') this.queryEntity.Page = 1, this.queryEntity.PageSize = index;
            this.GetProduct_Stock_Summary();
        },
        handleDownload() {                                  // 导出
            stockApi.Product_Stock_SummaryExcel(this.queryEntity).then(res => {
                if (res) this.$app.downloadUrl(res);
            });
        },
        //#endregion

        //#region   获取数据
        getstore_list() {                                   // 获取所属门店
            stockApi.getstore_list().then(res => {
                this.storeList = this.$app.isNull(res) ? [] : res.map(e => { return { label: e.sv_us_name, value: +e.user_id, uset_type: e.user_tye } });
            });
        },
        brand_lib_select(u_id) { //获取品牌列表
            stockApi.brand_lib_select({ u_id }).then(res => {
                this.brandList = res
            })
        },

        getProductcategory(userid) {
            stockApi.getProductcategory({ userid }).then(res => {
                this.categorys = (res.list || []).map(item => { return { value: item.id, label: item.sv_pc_name, children: [] } })
            })
        },

        GetProduct_Stock_Summary() {
            const { storeList, brandList, queryEntity, categorys, pIds } = this
            const params = { ...queryEntity }
            const { b_ids, u_id } = params
            const pc_ids = []
            const ps_ids = []
            const pt_ids = []
            pIds.forEach(item => {
                item[0] && pc_ids.findIndex(id => id === item[0]) === -1 && pc_ids.push(item[0])
                item[1] && ps_ids.findIndex(id => id === item[1]) === -1 && ps_ids.push(item[1])
                item[2] && pt_ids.findIndex(id => id === item[2]) === -1 && pt_ids.push(item[2])
            })
            //全选传空数组[]
            params.b_ids = b_ids.length === brandList.length ? [] : b_ids
            params.u_id = u_id.length === storeList.length ? [] : u_id
            params.pc_ids = pc_ids.length === categorys.length ? [] : pc_ids
            params.ps_ids = ps_ids
            params.pt_ids = pt_ids
            stockApi.GetProduct_Stock_Summary(params).then(res => {
                const { list, total, values } = res
                this.total = total
                this.dataList = list
                this.summaryData = values
            })
        },
        //#endregion
    }
}
