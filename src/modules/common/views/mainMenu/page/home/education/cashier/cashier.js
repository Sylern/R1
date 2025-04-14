import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from "vuex";
import cartting from '../../../../base/cartting/cartting.vue';
import memberList from '../../../../base/memberList/memberList.vue';
import memberAdd from '../../../../base/memberAdd/memberAdd.vue';
import memberRecharge from '../../../../base/memberRecharge/memberRecharge.vue';
import categoryFirstAdd from '../../../../base/categoryFirstAdd/categoryFirstAdd.vue';
import numberChange from '../../../../base/numberChange/numberChange.vue';
import priceChange from '../../../../base/priceChange/priceChange.vue';
import checkCourse from '../../../../base/checkCourse/checkCourse.vue';
import courseList from './courseList/courseList.vue';
import packageList from './packageList/packageList.vue';
import goodsList from '../../../../base/goodsList/goodsList.vue';
export default {
    components: { cartting, memberList, memberAdd, memberRecharge, categoryFirstAdd, numberChange, priceChange, checkCourse, courseList, packageList, goodsList },
    name: 'edu-cashier',
    data() {
        return {
            orderTime: new Date(),
            orderIntegral: 0,                                   // 赠送积分
            numberChangeStatus: false,
            priceChangeStatus: false,
            willShowCheckin: false,                             // 未选择会员，点击确认报名后，选择会员成功直接弹出结算
            isSubmitting: false,                                // 是否在提交挂单
            postPopStatus: false,                               // 挂单弹窗
            postPopText: '',                                    // 挂单输入
            searchKeywords: '',                                 // 搜索关键字输入框绑定
            handlePos: -1,
            courseData: [],                                     // 购物车数据
            memberListStatus: false,                            // 选择会员弹窗
            memberAddImport: null,
            memberAddStatus: false,                             // 新增会员弹窗
            memberRechargeStatus: false,                        // 会员充值弹窗

            menuType: 1,                                        // 1-课程 2-课程包 3-商品

            ballAnimation: '',
            tipsNum: 0,                                         // 消息提示数量
            firstSelected: 0,                                   // 一级菜单选中
            firstSelectedItem: {                                // 一级菜单选中item
                id: -1,
                label: ''
            },
            secondSelected: 0,                                  // 二级菜单选中
            secondSelectedItem: {                               // 二级菜单选中item
                id: -1,
                label: ''
            },
            remark: '',                                         // 备注
            checkCourseStatus: false,                           // 报名结算
        }
    },
    computed: {
        ...mapState(['isCefClient', 'carttingSearchCursor', 'carttingData', 'userInfo', 'memberInfo', 'couponCountNumber', 'selectedInfo', 'user_local_data', 'customerDisplayData']),
        ...mapState('permission', ['CashierManage']),
        memberSelected() {
            return !this.$app.isNull(this.memberInfo.member_id)
        },
        carttingDataLength() {
            return this.$app.isNull(this.carttingData.productResults) ? 0 : this.carttingData.productResults.length
        },
        imgBase() {
            return stockApi.imgBase()
        },
        isOrderTake() {                                        // 展示挂单状态
            return this.courseData.length > 0
        },
        improtMoney() {
            return this.handlePos > -1 ? this.courseData[this.handlePos].priceTotal : 0
        },
        totalInfo() {
            let courseMoney = 0, give = 0;
            this.courseData.forEach(e => {
                give = this.$app.addNumber(give, e.timedetail[e.salePos].sv_give_class_hour);
                courseMoney = this.$app.addNumber(courseMoney, e.priceTotal);
            })
            let totalMoney = this.$app.addNumber(courseMoney, this.carttingData.dealMoney);
            return {
                num: this.courseData.length,
                give,
                remark: this.remark,
                givePoint: this.orderIntegral,
                orderTime: this.orderTime ? this.$app.currentTime(this.orderTime, 'yyyy-MM-dd HH:mm:ss') : '',
                courseMoney: this.$app.moneyFixed(courseMoney, 2),
                money: this.$app.moneyFixed(totalMoney, 2)
            }
        },
    },
    watch: {
        carttingSearchCursor: {                                         // 监听购物车商品加入结束
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        !!this.$refs.searchInput && this.$refs.searchInput.focus();
                    })
                }
            }
        },
        'courseData': {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.orderIntegral = 0;
                    this.courseData.forEach(e => {
                        this.orderIntegral += e.sv_product_integral;
                    })
                    this.$nextTick(() => {
                        !!this.$refs.scrollList && this.$refs.scrollList.update();
                    });
                }
            }
        }
    },
    mounted() {
        if (this.customerDisplayData.enable) {
            this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 0, '');
        }
        this.$refs.searchInput.focus();
        this.$root.$on('handleInputFocus', () => {
            this.$nextTick(() => {
                !!this.$refs.searchInput && this.$refs.searchInput.focus();
            })
        });
        this.$root.$on('showMemberAdd', (dataObj) => {
            this.memberAddImport = dataObj;
            this.showMemberAdd(dataObj);
        });
        this.getCateringRegionPageList()                            // 获取消息提示数
    },
    methods: {
        ...mapMutations(['update', 'updateUserLocalData', 'clearCartting', 'clearMember', 'clearSelectedInfo', 'touchCarttingCursor']),
        handleHexiao() {                                            // 点击核销图标
            this.$root.$emit('keyCode', 1001);
        },
        handleMessage() {                                           // 点击消息图标
            this.$router.push({
                path: '/messageManagemen/priceChange'
            })
        },
        courseCashierNotNull() {
            return this.courseData.length > 0 || this.carttingData.productResults.length > 0
        },
        //#endregion
        handleCloseMember() {
            this.memberListStatus = false;
            if (this.willShowCheckin) {
                this.willShowCheckin = false;
                this.$nextTick(() => {
                    this.checkCourseStatus = true;
                })
            }
        },
        handleSearch() {
            if (this.menuType === 1) {
                this.firstSelected = -1;
                this.$refs.courseList.handleSearch(this.searchKeywords);
            } else if (this.menuType === 2) {
                this.$refs.packageList.handleSearch(this.searchKeywords);
            } else {
                this.$refs.goodsList.searchGoodsList(this.searchKeywords);
            }
            this.$nextTick(() => {
                this.searchKeywords = '';
            });
        },
        handleSearchCheckIn() {                                     // 搜索栏按空格键直接弹结算
            let permissionItem = this.CashierManage.Collection || { enabled: true };
            if (!permissionItem.enabled) return
            this.$refs.searchInput.blur();
            this.showCheckin();
        },
        showMemberList() {                                          // 显示会员选择列表
            this.memberListStatus = true;
        },
        showMemberAdd(dataObj) {                                    // 显示新增会员弹窗
            this.memberAddStatus = true;
            if (this.$app.isNull(dataObj)) {
                this.memberAddImport = {
                    newType: 'phone',
                    val: ''
                };
            }
        },
        handleClearMember() {                                       // 清除选中会员
            this.clearMember();
        },
        showMemberRecharge() {                                      // 显示会员充值弹窗
            this.memberRechargeStatus = true;
        },
        handlePriceChangeBack(val) {                                // 修改价格回调
            let item = this.courseData[this.handlePos];
            item.priceTotal = this.$app.moneyFixed(parseFloat(val));
            this.$nextTick(() => {
                this.handlePos = -1;
            })
        },
        handleOrderRemark() {                                       // 填写整单备注
            this.$prompt('请输入备注内容', '备注', {
                inputPlaceholder: '请输入备注内容，限100个字',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^.{0,100}$/,
                inputValue: this.remark || '',
                inputErrorMessage: '请输入备注内容，限100个字'
            }).then(({ value }) => {
                this.remark = value;
            }).catch(e => {

            });
            return
        },
        showCategoryFirst() {                                       // 显示新增一级分类
            this.categoryFirstStatus = true;
        },
        updateGoodsNumber(type) {                                   // 修改选中商品数量
            if (type == 'add') {
                this.$root.$emit('keyCode', 107);
            } else if (type == 'subtract') {
                this.$root.$emit('keyCode', 109);
            }
        },
        handleOrderTake() {                                         // 挂单-取单
            if (this.isOrderTake) {
                // 挂单
                this.postPopText = this.selectedInfo.sv_remark;
                this.postPopStatus = true;
                return
            }
            this.$root.$emit('keyCode', 81);
        },
        handlePostPop() {                                           // 提交挂单

        },
        showCheckin() {                                             // 显示订单结算弹窗 Enter
            if (this.memberSelected || this.courseData.length === 0) {
                return this.checkCourseStatus = true
            }
            this.willShowCheckin = true;
            this.showMemberList();
        },

        handleSubtract(item, index) {                               // 数量 减1
            if (item.number <= 1) return this.handleDel(index);
            item.number = this.$app.subtractNumber(item.number, 1);
            item.priceTotal = this.calcPriceTotal(item.timedetail[item.salePos].sv_p_unitprice, item.number);
        },
        handleAdd(item) {                                           // 数量 加1
            item.number = this.$app.addNumber(item.number, 1);
            item.priceTotal = this.calcPriceTotal(item.timedetail[item.salePos].sv_p_unitprice, item.number);
        },
        calcPriceTotal(price, number) {
            return this.$app.moneyFixed(this.$app.multiplyNumber(price, number))
        },
        handlePriceChange(index) {                                  // 改价弹窗
            this.handlePos = index;
            this.priceChangeStatus = true;
        },
        handleNumberChange(number) {                                // 确定修改积分
            this.orderIntegral = number;
        },
        handleDel(dataPos) {                                        // 删除
            this.courseData.removeByIndex(dataPos);
        },
        handleChangeMenu(menuType) {
            this.menuType = menuType;
            if (this.menuType === 3) {
                !!this.$refs.goodsList && this.$refs.goodsList.searchGoodsList();
            }
        },
        addCart({ event, courseItem }) {                            // 课程添加购物车
            if (this.courseData.findIndex(e => e.sv_product_id === courseItem.sv_product_id) > -1) return this.$message.warning('已添加相同课程')
            this.handleCourseToCart(courseItem);
            if (this.$app.isNull(event)) return;
            this.animation(event, courseItem.img);
        },
        addPackageCart({ event, packageItem }) {                    // 套餐添加购物车
            const hasItem = packageItem.course_list.some((item, index, array) => {
                let courseItem = this.courseData.find(e => e.sv_product_id === item.sv_product_id);
                if (courseItem) {
                    this.$message.warning('套餐包含课程：' + courseItem.sv_p_name + '，已添加')
                    return courseItem
                }
            })
            if (hasItem) return
            this.handlPackageToCart(packageItem.product_id, packageItem.course_list);
            if (this.$app.isNull(event)) return;
            this.animation(event, packageItem.img);
        },
        animation(event, img) {
            // 加入购物车动画
            clearTimeout(this.s);
            let self = this,
                speed = 1000, //速度
                //点击的起点
                startY = event.clientY - 50,
                startX = event.clientX,
                //购物车坐标
                endX = 400,
                endY = this.memberSelected ? 300 : 100;
            // 获取当前点击的商品图片
            self.animationImg = img;
            //计算不同位置的动画执行时间
            let m = Math.sqrt((Math.abs(startX - endX) ** 2) + (Math.abs(startY - endY) ** 2));
            let animationTime = (m * speed) / 4000;
            //给小球起点位置
            self.ballAnimation = `top:${startY}px;left:${startX}px;transition:all 0s;display:block;transform: scale(1);`
            setTimeout(() => {
                self.ballAnimation = `top:${endY}px;left:${endX}px;transition:all ${animationTime}ms ease-in,left ${animationTime}ms linear;display:block;transform: scale(0.4);`;
                //给小球终点坐标，并执行动画
                this.s = setTimeout(() => {
                    //动画完成之后，重置
                    self.animationImg = '';
                    self.ballAnimation = `left:0;right:0;transition:all 0s;display:none;transform: scale(1);`;
                    clearTimeout(this.s);
                }, animationTime);
            }, 50)
        },
        handleCourseToCart(courseItem) {
            let sv_effective_time = courseItem.timedetail[0].sv_ective_date;
            const item = {
                ...courseItem,
                salePos: 0,
                sv_product_class_hourid: courseItem.timedetail[0].sv_product_class_hourid,
                number: courseItem.timedetail[0].sv_p_storage,
                sv_product_integral: courseItem.timedetail[0].sv_product_integral,
                sv_effective_time,
                unitprice: this.$app.moneyFixed(courseItem.timedetail[0].sv_p_unitprice),
                priceTotal: this.calcPriceTotal(courseItem.timedetail[0].sv_p_unitprice, courseItem.timedetail[0].sv_p_storage),
                list: courseItem.timedetail.map((e, index) => {
                    return {
                        value: index,
                        label: e.sv_p_name
                    }
                })
            }
            this.courseData.push(item);
        },
        handlPackageToCart(packageId, courseList) {
            const courseItemList = [];
            courseList.forEach(courseItem => {
                let saleItemIndex = courseItem.timedetail.findIndex(e => e.sv_product_class_hourid === courseItem.son_product_id);
                let salePos = saleItemIndex > -1 ? saleItemIndex : 0;
                let sv_course_packageid = saleItemIndex > -1 ? packageId : 0;
                let sv_effective_time = courseItem.timedetail[salePos].sv_ective_date;
                const item = {
                    ...courseItem,
                    salePos,
                    sv_course_packageid,
                    sv_product_class_hourid: courseItem.timedetail[salePos].sv_product_class_hourid,
                    number: courseItem.timedetail[salePos].sv_p_storage,
                    sv_product_integral: courseItem.timedetail[salePos].sv_product_integral,
                    sv_effective_time,
                    unitprice: this.$app.moneyFixed(courseItem.timedetail[salePos].sv_p_unitprice),
                    priceTotal: this.calcPriceTotal(courseItem.timedetail[salePos].sv_p_unitprice, courseItem.timedetail[salePos].sv_p_storage),
                    list: courseItem.timedetail.map((e, index) => {
                        return {
                            value: index,
                            label: e.sv_p_name
                        }
                    })
                }
                courseItemList.push(item);
            })
            this.courseData = courseItemList.concat(this.courseData);
        },
        handleSalePos(row) {
            row.sv_product_class_hourid = row.timedetail[row.salePos].sv_product_class_hourid;
            row.number = row.timedetail[row.salePos].sv_p_storage;
            row.number = row.timedetail[row.salePos].sv_p_storage;
            row.sv_product_integral = row.timedetail[row.salePos].sv_product_integral;
            row.sv_effective_time = row.timedetail[row.salePos].sv_ective_date;
            row.unitprice = this.$app.moneyFixed(row.timedetail[row.salePos].sv_p_unitprice);
            row.priceTotal = this.calcPriceTotal(row.timedetail[row.salePos].sv_p_unitprice, row.timedetail[row.salePos].sv_p_storage);
        },

        handleSuccess() {
            this.handlePos = -1;
            this.courseData = [];
            this.orderTime = new Date();
            this.orderIntegral = 0;
            this.remark = '';
            this.$root.$emit('keyCode', 112);
            this.clearMember();
        },
        //#region 
        getCateringRegionPageList() {                               // 获取消息数 totalCount
            stockApi.getCateringRegionPageList().then(res => {
                if (!this.$app.isNull(res)) {
                    this.tipsNum = res.totalCount;
                }
            });
        },
    }
};