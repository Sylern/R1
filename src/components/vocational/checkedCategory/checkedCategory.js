
import { stockApi } from '@/api';
export default {
    components: {},
    props: {
        visible: { type: Boolean, default: true },
        dataJson: { type: Array, default: [] },
    },
    data() {
        return {
            classData: [],                          // 原始分类数据集合
            filterList: [],                         // 实际展示的分类数据
            keywards: '',                           // 商品名称-编码
        }
    },
    computed: {
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
    },
    watch: {
        dialogVisible: {
            handler: function (newVal, oldVal) {
                if (newVal) {
                    this.checkedJson = [...this.dataJson];
                    this.getCategoryList();
                }
            }
        },
    },
    mounted() {
        
    },
    methods: {
        handleClick(item) {
            item.isShowChildren = !item.isShowChildren;
            item.isCheck = !item.isCheck;
        },
        returnFn(){
            return;
        },
        handleChildClick(item){
            item.isCheck = !item.isCheck;
        },
        getCategoryList() {                                      // 获取分类
            if (this.classData.length > 0) return;
            stockApi.getSv_Productcategory_list().then(res => {
                this.classData = res.map(e => {
                    e.children.map(c =>{
                        return{ ...c, isCheck: false}
                    }) 
                    return { ...e, isCheck: this.checkedJson.findIndex(k => k.id === e.id) > -1, isShowChildren: false } 
                });
                this.filterCategoryList();
            });
        },
        filterCategoryList(){
            this.filterList = this.classData.filter(e=> e.label.indexOf(this.keywards) > -1);
        },
        handleSubmit() {                                         // 返回选中的分类
            this.dialogVisible = 'close';
            let list = [];
            this.classData.map(item =>{
                if(item.isCheck){
                    list.push(item)
                }
            })
            this.$emit('callback', list);
        }
    }
}