import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
import goodsAdd from '../../base/goodsAdd/goodsAdd.vue';
import memberAdd from '../../base/memberAdd/memberAdd.vue';
import numberChange from '../../base/numberChange/numberChange.vue';
import memberRecharge from '../../base/memberRecharge/memberRecharge.vue';
import storeCardDeposit from '../../base/storeCardDeposit/storeCardDeposit.vue';
import storeCardDepositReturn from '../../base/storeCardDepositReturn/storeCardDepositReturn.vue';
import categoryFirstAdd from '../../base/categoryFirstAdd/categoryFirstAdd.vue';
import categorySecondAdd from '../../base/categorySecondAdd/categorySecondAdd.vue';
import goodsItem from '../../base/goodsItem/goodsItem.vue';
import guiderSelect from '../../base/guiderSelect/guiderSelect.vue';
import priceChange from '../../base/priceChange/priceChange.vue';
import memberCardCheck from '../../base/memberCardCheck/memberCardCheck.vue';
import checkStoreCard from '../../base/checkStoreCard/checkStoreCard.vue';
import memberGroup from '../../base/memberGroup/memberGroup.vue';
import checkFitness from '../../base/checkFitness/checkFitness.vue';
import utils from '@/utils/utils';
const { debounce, throttle } = utils;
export default {
	components: { payTypeList, goodsAdd, memberList, memberAdd, goodsItem, numberChange, memberRecharge, storeCardDeposit, storeCardDepositReturn, categoryFirstAdd, categorySecondAdd, guiderSelect, priceChange, memberGroup, checkFitness, memberCardCheck, checkStoreCard },
	name: 'cardRecharge',
	data() {
		return {
			ballAnimation: '',
			afterMemberSelectedStatus: 0,                       // 0默认选择会员后，1点击收款出发选择会员后，2点击结算出发选择会员后
			cardType: '',                                       // 购物车商品类型
			carttingData: {
				totalMoney: 0,
				product_id: 0,                                  // 次卡套餐id
				productResults: []
			},
			remarks: '',
			addCardTips: {
				storeCards: '购物车已添加"储值卡"，点击确定"储值卡"将被替换，是否确定?',
				packages: '购物车已添加"次卡套餐"，点击确定"次卡套餐"将被替换，是否确定?',
				goods: '购物车已添加"任意充次"，点击确定"任意充次"将被替换，是否确定?'
			},
			currentMenuKey: 'storeCards',
			menuList: [
				{
					name: '储值卡',
					key: 'storeCards'
				},
				{
					name: '入场卡',
					key: 'admissionCards'
				},
				{
					name: '次卡套餐',
					key: 'packages'
				},
				{
					name: '任意充次',
					key: 'goods'
				}
			],
			query: {
				category: -1,                                   // 一级分类id
				erjicategory: -1,                               // 二级分类id
				isn: '',
				producttype_id: 1,                              // 获取商品服务分类 -1：默认 0：普通 1：服务 2：计时
				pageSize: 20,
				pageIndex: 1,
				name: '',                                       // 查询条件
				read_morespec: true
			},
			goodsTotal: 0,                                      // 数据页码
			goodsList: [],
			currentGoodsInfo: {                                 // 修改数量弹窗
				type: 'number',
				dataPos: 0,
				title: '购买数量',
				data: {
					number: 1,
					giveNumber: 0
				}
			},

			searchText: '',                                     // 搜索关键字输入框绑定
			searchKeywords: '',                                 // 搜索关键字传组件
			goodsAddStatus: false,                              // 新增商品
			memberListStatus: false,                            // 选择会员
			memberAddStatus: false,                             // 新增会员弹窗
			memberRechargeStatus: false,                        // 会员充值弹窗
			depositReturnStatus: false,                         // 押金退卡弹窗
			storeCardDepositStatus: false,                      // 储值卡押金弹窗
			pointChangeStatus: false,                           // 改积分弹窗
			numberChangeStatus: false,                          // 改数量弹窗

			categoryFirstStatus: false,                         // 新增一级分类弹窗
			categorySecondStatus: false,                        // 新增二级分类弹窗
			firstSelected: 0,                                   // 一级菜单选中
			secondSelected: 0,                                  // 二级菜单选中
			firstCategory: [],
			secondCategory: [],
			storeCardList: [],                                  // 储值卡列表
			admissionList: [],                                  // 入场卡列表
			cardsList: [],                                      // 次卡套餐列表

			checkinStatus: false,                               // 次卡套餐 任意充次 结算弹窗
			checkStoreStatus: false,                            // 储值卡结算弹窗
			guiderSelectStatus: false,                          // 导购弹窗
			guiderSelectList: [],                               // 导购员列表  
			priceChangeStatus: false,                           // 改价弹窗
			priceChangeExtend: {
				type: 'checkin',
				dataPos: -1
			},
			checkPrint: false,                                  // 是否打印
			checkMessage: true,                                 // 是否发短信
			isSubmitting: false,                                // 正在结算
			btnCalculator: [
				{
					key: 'line10',
					value: '7'
				},
				{
					key: 'line11',
					value: '8'
				},
				{
					key: 'line12',
					value: '9'
				},
				{
					key: 'line20',
					value: '4'
				},
				{
					key: 'line21',
					value: '5'
				},
				{
					key: 'line22',
					value: '6'
				},
				{
					key: 'line30',
					value: '1'
				},
				{
					key: 'line31',
					value: '2'
				},
				{
					key: 'line32',
					value: '3'
				},
				{
					key: 'line40',
					value: '.'
				},
				{
					key: 'line41',
					value: '0'
				},
				{
					key: 'line42',
					value: 'C'
				}
			],

			inputPriceTimer: null,
			inputPriceHandler: 0,                               // 输入金额控制，小于 1 时覆盖，否则累加
			payInfo: {
				queryId: '',
				svOrderListId: null,
				receivableMoney: null,                          // 应收金额
				money: null                                     // 扫码支付金额
			},
			queryPay: {
				authCode: '',                                   // 支付码，扫客户付款码
				money: '',                                      // 收款金额
				subject: 'PC端扫码支付',                         // 收款说明
				businessType: 1,                                // 1:WebCheckout,网页收银台;
				queryId: ''                                     // 查询Id
			},

			memberCardCheckStatus: false,                       // 结算前储值卡支付验证弹窗
			sv_uc_isenablepwd: false,                           // 结算前储值卡支付-用户配置是否要验证
			memberCardCheckType: -1,                            // 储值卡结算验证类型

			priceChangeMenuPos: 0,
			checkinData: {
				totalMoney: 0,                                  // 原价
				discountMoney: 0,                               // 优惠金额
				receivableMoney: 0,                             // 应收金额
				membercardRechargeList: [],
				product_id: 0,
			},
			checkStoreInfo: {                                   // 储值卡结算数据
				cardId: '',
				cardName: '',
				num: 1,
				money: 0,
				present: 0,
				remark: '',
			},

			orderTime: new Date(),
			orderIntegral: 0,                                   // 赠送积分
			numberChangeStatus: false,
			courseData: [],                                     // 购物车数据
			extendInfo: {                                       // 课程卡套餐基础数据
				extendId: 0,
				sv_p_name: '',
				courseDataType: 3,
				sv_number_people: 0,
				sv_affiliation_m_id: [],
				sv_product_total: 0,
				sv_effective_time: '',
				sv_effective_time_start: '',
				sv_effective_time_end: '',
				sv_effective_time_num: '',
				sv_effective_unit_type: 100,
				open_card_way: 100,
				sv_open_card_way_list: [],
			},
			remark: '',                                         // 备注
			memberGroupStatus: false,                           // 开卡成员
			checkCourseStatus: false,                           // 报名结算
		}
	},
	computed: {
		...mapGetters(['hasStoreCard', 'hasAdmissionCard']),
		...mapState(['userInfo', 'memberInfo', 'JurisdictionObj', 'user_local_data', 'cashierJurisdiction']),
		...mapState('permission', ['CashierManage']),
		imgBase() {
			return stockApi.imgBase()
		},
		memberSelected() {
			return !this.$app.isNull(this.memberInfo.member_id)
		},
		memberBirthday() {
			return this.memberInfo.sv_mr_birthday ? this.$app.currentTime(new Date(this.memberInfo.sv_mr_birthday), 'MM-dd') : ''
		},
		goodsTotalInfo() {
			let totalMoney = 0, buyNumber = 0;
			this.carttingData.productResults.forEach(e => {
				buyNumber += e.number;
				totalMoney = this.$app.addNumber(totalMoney, e.dealMoney)
			})
			if (this.cardType !== 'goods') {
				totalMoney = this.carttingData.totalMoney
			}
			return { buyNumber, totalMoney: this.carttingData.productResults.length === 0 ? 0 : totalMoney }
		},
		totalInfo() {
			let totalMoney = this.extendInfo.sv_product_total;
			return {
				num: this.courseData.length,
				remark: this.remark,
				givePoint: this.orderIntegral,
				orderTime: this.orderTime ? this.$app.currentTime(this.orderTime, 'yyyy-MM-dd HH:mm:ss') : '',
				courseMoney: this.$app.moneyFixed(totalMoney),
				money: this.$app.moneyFixed(totalMoney)
			}
		},
		improtChangeMoney() {
			return this.priceChangeExtend.type === 'checkin' ? this.checkinData.totalMoney : this.carttingData.productResults[this.priceChangeExtend.dataPos].dealMoney
		},
	},
	watch: {

	},
	beforeMount() {
		this.dataShow = this.user_local_data.isPackageType ? 'packages' : 'goods'
	},
	mounted() {
		this.$refs.searchKeywords.focus();
		this.checkPrint = this.cashierJurisdiction.printEnable;
		this.initMenu();
		this.getFirstCategory();
		this.getGoodsList();
		this.getTimesCard();
		this.getUserConfigInfo();
		this.handleMultAdd();
	},
	beforeDestroy() {
		this.clearMember();
		this.$root.$off('batchAddToCardRecharge');
	},
	methods: {
		...mapMutations(['updateUserLocalData', 'clearMember']),
		...mapActions(['requsetMemberInfo']),
		handleMenuSort() {
			this.$confirm('是否改变默认菜单展示？').then(_ => {
				this.updateUserLocalData({
					...this.user_local_data,
					isPackageType: !this.user_local_data.isPackageType
				});
			}).catch(_ => {

			});
		},
		initMenu() {
			this.hasStoreCard && this.getPrepaidCardSettingList();
			this.hasAdmissionCard && this.getGymCardSellingList();
			const menuArray = [
				{
					name: '储值卡',
					key: 'storeCards',
					isShow: this.hasStoreCard
				},
				{
					name: '入场卡',
					key: 'admissionCards',
					isShow: this.hasAdmissionCard
				},
				{
					name: '次卡套餐',
					key: 'packages',
					isShow: true
				},
				{
					name: '任意充次',
					key: 'goods',
					isShow: !this.userInfo.is_AnyCardShow
				}
			]
			this.menuList = menuArray.filter(e => e.isShow)
			this.currentMenuKey = this.menuList[0].key;
		},
		handleMenuItem(item) {
			if (this.currentMenuKey === item.key) return;
			this.currentMenuKey = item.key;
		},
		handleMemberGroup() {                                           // 选择开卡成员
			this.memberGroupStatus = true;
		},
		handlePointChange(number) {                                     // 确定修改积分
			this.orderIntegral = number;
		},
		handleMemberGroupBack(list) {
			this.memberGroupStatus = false;
			this.extendInfo.sv_affiliation_m_id = [...list];
		},
		handleOrderRemark() {                                           // 填写整单备注
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
		//#region
		getPrepaidCardSettingList() {                               // 获取储值卡列表数据
			stockApi.getPrepaidCardSettingList({
				seachStr: this.$app.isNull(this.searchKeywords) ? '' : this.searchKeywords,
				pageIndex: 1,
				pageSize: 99
			}).then(res => {
				if (res) {
					this.storeCardList = this.$app.isNull(res.list) ? [] : res.list
				}
			})
		},
		getGymCardSellingList() {                                   // 获取入场卡列表
			const query = {
				pageIndex: 1,
				pageSize: 99,
				keywards: this.$app.isNull(this.searchKeywords) ? '' : this.searchKeywords
			}
			cardManageApi.getGymCardSellingList(query).then(res => {
				if (res) {
					this.admissionList = this.$app.isNull(res.list) ? [] : res.list;
				}
			});
		},
		getFirstCategory() {                                        // 获取商品一级分类  服务分类
			stockApi.getFirstCategory({ type: 1, is_cashier: true }).then(res => {
				if (res) {
					this.firstCategory = this.$app.isNull(res) ? [] : res;
				}
			});
		},
		getSecondCategory() {                                       // 获取商品二级分类
			stockApi.getSecondCategory({ cid: this.firstSelectedItem.id }).then(res => {
				if (res.succeed) {
					this.secondCategory = this.$app.isNull(res.values) ? [] : res.values;
				}
			});
		},
		getGoodsList(initSearch) {                                  //  获取商品数据
			if (initSearch) {
				this.query.pageIndex = 1;
				this.query.name = '';
				this.query.isn = '';
			}
			stockApi.getProductCashierList(this.query).then(res => {
				if (res) {
					this.goodsList = this.$app.isNull(res.list) ? [] : res.list;
					this.goodsTotal = res.total;
					if (this.query.name != '' && this.query.pageIndex == 1 && this.goodsList.length == 1) {
						this.$nextTick(() => {
							this.$refs.goodsItem[0].handleGoodsItem()
						})
					}
				}
			});
		},

		getTimesCard() {                                            // 获取次卡列表数据
			const query = {                                             // 获取次卡列表实体
				productSetmealShelvesType: 0,                           // 上下架状态
				is_cashier: true,
				keywards: this.$app.isNull(this.searchKeywords) ? '' : this.searchKeywords,
				pageIndex: 1,                                           // 页码
				pageSize: 99                                            // 页容量
			}
			stockApi.getTimesCard(query).then(res => {
				if (res) {
					this.cardsList = this.$app.isNull(res.dataList) ? [] : res.dataList;
				}
			})
		},
		handleToAddStoreCard() {                                    // 跳转新增储值卡
			this.$router.push({
				path: '/memberCenter/addStoreCard',
				query: {
					type: 'new'
				}
			});
		},
		handleToAddAdmissionCard() {                                // 跳转新增入场卡
			this.$router.push({
				path: '/cardManage/addCard',
				query: {
					type: 'add'
				}
			});
		},
		handleToAddCard() {                                         // 跳转新增次卡
			this.$router.push({
				path: '/memberCenter/card/addCard',
				query: {
					type: 'new'
				}
			});
		},
		handleStoreCardItem(item) {                                 // 点击储值卡项
			if (this.cardType !== 'storeCards' && this.goodsTotalInfo.buyNumber > 0) {
				this.$confirm(this.addCardTips[this.cardType], '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info'
				}).then(() => {
					this.cardType = 'storeCards';
					this.carttingData = {
						productResults: [{
							productId: item.sv_guid,
							productName: item.sv_card_name,
							dealMoney: item.sv_card_money,
							number: 1,
							validity_date: item.sv_card_date,
							giveNumber: item.sv_card_present_money > 0 ? item.sv_card_present_money : item.sv_card_present_money,
							dealMoney: item.sv_card_money
						}],
						product_id: item.sv_guid,
						totalMoney: item.sv_card_money
					}
				})
				return
			}
			this.cardType = 'storeCards';
			this.carttingData = {
				productResults: [{
					productId: item.sv_guid,
					productName: item.sv_card_name,
					dealMoney: item.sv_card_money,
					number: 1,
					validity_date: item.sv_card_date,
					giveNumber: item.sv_card_present_money > 0 ? item.sv_card_present_money : item.sv_card_present_money,
					dealMoney: item.sv_card_money
				}],
				product_id: item.sv_guid,
				totalMoney: item.sv_card_money
			}
		},
		getCardSetmealInfo(item) {                                  // 获取次卡商品数据
			if (this.$app.isNull(item.product_id)) return this.$message.error('找不到次卡id');
			if (item.sv_p_storage < 1) return this.$message.warning('次卡套餐库存不足');
			stockApi.getCardSetmealInfo({
				productId: item.product_id,
				sv_is_cashier: true
			}).then(res => {
				if (res && !this.$app.isNull(res[0])) {
					let productList = this.$app.isNull(res[0].combination_new) ? [] : JSON.parse(res[0].combination_new).map(e => {
						let d = new Date();
						if (e.sv_eff_rangetype == 1) {
							d.setDate(d.getDate() + e.sv_eff_range);
						} else if (e.sv_eff_rangetype == 2) {
							d.setMonth(d.getMonth() + e.sv_eff_range);
						} else {
							d.setFullYear(d.getFullYear() + e.sv_eff_range);
						}
						const goodsNumber = e.product_number;
						const dealPrice = e.sv_unitprice || e.sv_p_unitprice || 0;
						const obj = {
							...e,
							productId: e.product_id,
							barCode: goodsItem.sv_p_barcode,
							productName: e.sv_p_name,
							number: goodsNumber,
							giveNumber: e.sv_give_count,
							unitName: e.sv_p_unit,
							dealPrice,
							rangeShow: true,
							sv_mcr_money: res[0].sv_p_unitprice,
							sv_package_total: res[0].sv_package_total,
							sv_package_type: res[0].sv_package_type,
							validity_date: e.sv_eff_rangetype === 4 ? e.sv_eff_range_enddate : this.$app.currentTime(d, 'yyyy-MM-dd'),
							dealMoney: dealPrice
						}
						return obj
					});
					if (this.cardType !== 'packages') {
						if (this.goodsTotalInfo.buyNumber > 0) {
							this.$confirm(this.addCardTips[this.cardType], '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'info'
							}).then(() => {
								this.clearCarttingList();
								this.cardType = 'packages';
								this.carttingData.sv_package_type = res[0].sv_package_type;
								this.carttingData.sv_package_total = res[0].sv_package_total;
								this.carttingData.product_id = res[0].product_id;
								this.carttingData.totalMoney = res[0].sv_p_unitprice;
								this.carttingData.productResults = productList;
							})
							return
						}
						if (this.goodsTotalInfo.buyNumber > 0) {
							return
						}
					}
					this.cardType = 'packages';
					this.carttingData.sv_package_type = res[0].sv_package_type;
					this.carttingData.sv_package_total = res[0].sv_package_total;
					this.carttingData.product_id = res[0].product_id;
					this.carttingData.totalMoney = res[0].sv_p_unitprice;
					this.carttingData.productResults = productList;
				}
			})
		},
		handleGoodsToCart(goodsItem) {                              // 添加商品数据到购物车
			// sv_product_type 0为普通商品，1为包装，2为套餐
			// producttype_id 产品类型 0为普通商品，1为服务商品，2为计时商品（游乐场之类）
			if (goodsItem.isPackage) return this.$message.warning('套餐商品不支持次卡')
			if (this.cardType !== 'goods') {
				if (this.carttingData.productResults.length > 0) {
					this.$confirm(this.addCardTips[this.cardType], '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'info'
					}).then(() => {
						this.clearCarttingList();
						this.cardType = 'goods';
						let dataFilter = this.carttingData.productResults.filter(e => e.productId === goodsItem.product_id);
						let dataArray = [...this.carttingData.productResults];
						let dealPrice = goodsItem.sv_p_unitprice;
						let goodsNumber = goodsItem.number || 1;
						let giveNumber = goodsItem.giveNumber || 0;
						if (dataFilter.length > 0) {
							dealPrice = dataFilter[0].dealPrice;
							giveNumber = dataFilter[0].giveNumber;
							dataArray = dataArray.filter(e => e.productId !== goodsItem.product_id);
							dataFilter.forEach(item => {
								goodsNumber = this.$app.addNumber(goodsNumber, item.number)
							})
						}
						let addItem = {
							productId: goodsItem.product_id,
							barCode: goodsItem.sv_p_barcode,
							productName: goodsItem.sv_p_name,
							number: goodsNumber || 1,
							giveNumber: giveNumber,
							unitName: goodsItem.sv_p_unit,
							dealPrice,
							rangeShow: true,
							sv_eff_range: 1,
							sv_eff_rangetype: 3,
							rangeShowType: 3,
							dealMoney: this.$app.multiplyNumber(goodsNumber, dealPrice)
						}
						dataArray.unshift(addItem);
						this.carttingData.product_id = 0;
						this.carttingData.productResults = [...dataArray];
					})
					return
				}
			}

			this.cardType = 'goods';
			let dataFilter = this.carttingData.productResults.filter(e => e.productId === goodsItem.product_id);
			let dataArray = [...this.carttingData.productResults];
			let dealPrice = goodsItem.sv_p_unitprice;
			let goodsNumber = goodsItem.number || 1;
			let giveNumber = goodsItem.giveNumber || 0;
			if (dataFilter.length > 0) {
				dealPrice = dataFilter[0].dealPrice;
				giveNumber = dataFilter[0].giveNumber;
				dataArray = dataArray.filter(e => e.productId !== goodsItem.product_id);
				dataFilter.forEach(item => {
					goodsNumber = this.$app.addNumber(goodsNumber, item.number)
				})
			}

			let addItem = {
				productId: goodsItem.product_id,
				barCode: goodsItem.sv_p_barcode,
				productName: goodsItem.sv_p_name,
				number: goodsNumber || 1,
				giveNumber: giveNumber,
				unitName: goodsItem.sv_p_unit,
				dealPrice,
				rangeShow: true,
				sv_eff_range: 1,
				sv_eff_rangetype: 3,
				rangeShowType: 3,
				dealMoney: this.$app.multiplyNumber(goodsNumber, dealPrice)
			}
			dataArray.unshift(addItem);
			this.carttingData.productResults = [...dataArray];
		},
		//#endregion
		handleNumberChange(val) {                                   // 改数量弹窗回调
			let item = this.carttingData.productResults[this.currentGoodsInfo.dataPos];
			if (this.currentGoodsInfo.type === 'number') {
				item.number = val;
				if (this.cardType === 'goods') {
					item.dealMoney = this.$app.multiplyNumber(item.number, item.dealPrice);
				}
			} else {
				item.giveNumber = val;
			}
			this.numberChangeStatus = false;
		},
		handleNumber(dataPos, type) {                               // 改数量弹窗
			if (this.cardType === 'storeCards') return;
			if (this.carttingData.sv_package_type === 1) return this.$message.warning('任意次卡不支持修改删除')
			this.currentGoodsInfo = {
				type: type,
				dataPos: dataPos,
				title: type === 'number' ? '购买数量' : '赠送数量',
				data: {
					number: this.carttingData.productResults[dataPos].number,
					giveNumber: this.carttingData.productResults[dataPos].giveNumber
				}
			};
			this.numberChangeStatus = true;
		},
		handleSubtract(item, index) {                               // 数量 减1
			if (this.carttingData.sv_package_type === 1) return this.$message.warning('任意次卡不支持修改删除')
			if (item.number <= 1) return this.handleDel(index);
			item.number = this.$app.subtractNumber(item.number, 1);
			if (this.cardType === 'goods') {
				item.dealMoney = this.$app.multiplyNumber(item.number, item.dealPrice);
			}
		},
		handleAdd(item) {                                           // 数量 加1
			if (this.carttingData.sv_package_type === 1) return this.$message.warning('任意次卡不支持修改删除')
			item.number = this.$app.addNumber(item.number, 1);
			if (this.cardType === 'goods') {
				item.dealMoney = this.$app.multiplyNumber(item.number, item.dealPrice);
			}
		},
		handleDel(dataPos) {                                        // 删除
			if (this.carttingData.sv_package_type === 1) return this.$message.warning('任意次卡不支持修改删除')
			this.carttingData.productResults.removeByIndex(dataPos);
		},
		handleSubtract_give(item, index) {                          // 赠送数量 减1
			if (this.carttingData.sv_package_type === 1) return this.$message.warning('任意次卡不支持修改删除')
			if (item.giveNumber <= 0) return;
			item.giveNumber = this.$app.subtractNumber(item.giveNumber, 1);
		},
		handleAdd_give(item) {                                      // 赠送数量 加1
			if (this.carttingData.sv_package_type === 1) return this.$message.warning('任意次卡不支持修改删除')
			item.giveNumber = this.$app.addNumber(item.giveNumber, 1);
		},
		handleKeyUp(item) {                                         // 商品有效期限制
			item.sv_eff_range = this.$app.verifyNumber(item.sv_eff_range);
		},
		handleEff(item, index) {                                    // 修改商品有效期
			this.carttingData.productResults[index].sv_eff_range = item.sv_eff_range * 1;
		},
		handleEffType(val, index) {                                 // 修改商品有效期类型
			this.carttingData.productResults[index].rangeShow = false;
			switch (val) {
				case 1:
				case 2:
				case 3:
					this.carttingData.productResults[index].sv_eff_range = 1;
					this.carttingData.productResults[index].rangeShow = true;
					this.carttingData.productResults[index].sv_eff_rangetype = val;
					return
				case 4:
					// 1个月
					this.carttingData.productResults[index].sv_eff_range = 1;
					this.carttingData.productResults[index].sv_eff_rangetype = 2;
					return;
				case 5:
					// 3个月
					this.carttingData.productResults[index].sv_eff_range = 3;
					this.carttingData.productResults[index].sv_eff_rangetype = 2;
					return;
				case 6:
					// 6个月
					this.carttingData.productResults[index].sv_eff_range = 6;
					this.carttingData.productResults[index].sv_eff_rangetype = 2;
					return;
				case 7:
					// 1年
					this.carttingData.productResults[index].sv_eff_range = 1;
					this.carttingData.productResults[index].sv_eff_rangetype = 3;
					return;
				case 8:
					// 长期
					this.carttingData.productResults[index].sv_eff_range = 10;
					this.carttingData.productResults[index].sv_eff_rangetype = 3;
					return;
				default:
					return;
			}
		},
		handleInputNumber({ target }) {           // 只能输入整字
			target.value = this.$app.verifyNumber(target.value);
		},
		handleSearch() {
			if (this.currentMenuKey === 'storeCards') {
				this.getPrepaidCardSettingList();
				return
			}
			if (this.currentMenuKey === 'admissionCards') {
				this.getGymCardSellingList();
				return
			}
			if (this.currentMenuKey === 'packages') {
				this.getTimesCard()
				return
			}
			if (this.currentMenuKey === 'goods') {
				this.firstSelected = 0;                                 // 一级菜单置为全部
				this.query.pageIndex = 1;
				this.query.name = this.searchKeywords;
				if (this.userInfo.sv_us_industrytype === 15 && this.searchKeywords.length === 13 && (parseInt(this.searchKeywords) + '').length === 13) {
					this.query.isn = this.searchKeywords.substring(2, 7)
				} else {
					this.query.isn = this.searchKeywords;
				}
				this.getGoodsList();

				this.$nextTick(() => {
					this.searchKeywords = '';
				});
				return
			}
		},
		selectMember() {
			this.memberListStatus = false;
			if (this.afterMemberSelectedStatus === 1) {
				this.showCheckin();
				return
			}
			if (this.afterMemberSelectedStatus === 2) {
				this.handleSubmit();
				return
			}
		},
		showMemberList() {                                          // 显示会员选择列表
			this.memberListStatus = true;
		},
		showMemberAdd() {                                           // 显示新增会员弹窗
			this.memberAddStatus = true;
		},
		memberAddSuccess(id) {
			this.requsetMemberInfo(id);
		},
		handleClearMember() {                                       // 清除选中会员
			this.clearMember();
		},
		showStoreCardDeposit() {                                    // 显示储值卡押金弹窗
			this.storeCardDepositStatus = true;
		},
		showDepositReturn() {                                       // 显示押金退卡弹窗
			this.depositReturnStatus = true;
		},
		showMemberRecharge() {                                      // 显示会员充值弹窗
			this.memberRechargeStatus = true;
		},
		showCategoryFirst() {                                       // 显示新增一级分类
			this.categoryFirstStatus = true;
		},
		showCategorySecond() {                                      // 显示新增二级分类
			this.categorySecondStatus = true;
		},
		clearCarttingList() {
			this.carttingData.product_id = 0;
			this.carttingData.totalMoney = 0;
			this.carttingData.productResults = [];
		},
		getUserConfigInfo() {                                       // 获取userInfo配置
			stockApi.getUserConfigInfo().then(res => {
				if (res) {
					this.sv_uc_isenablepwd = res.sv_uc_isenablepwd;
					if (!this.$app.isNull(res.sv_uc_isenableohter)) this.memberCardCheckType = res.sv_uc_isenableohter;
				}
			})
		},
		handleCloseMemberDialog() {
			this.afterMemberSelectedStatus = 0;
		},
		showCheckin() {                                             // 显示订单结算弹窗 Enter
			if (this.currentMenuKey === 'admissionCards' && this.courseData.length === 0) return this.$message.warning('还未添加入场卡')
			if (this.currentMenuKey !== 'admissionCards' && this.carttingData.productResults.length < 1) return this.$message.warning('还未添加商品')
			if (!this.memberSelected && this.afterMemberSelectedStatus === 0) {
				this.showMemberList();
				this.afterMemberSelectedStatus = 1;
				return
			}
			if (this.currentMenuKey === 'admissionCards') {
				this.checkCourseStatus = true
				return
			}
			if (this.cardType === 'storeCards') {
				this.afterMemberSelectedStatus = 0;
				const currentStoreCard = this.carttingData.productResults[0];
				this.checkStoreInfo = {
					cardId: currentStoreCard.productId,
					cardName: currentStoreCard.productName,
					num: 1,
					money: currentStoreCard.dealMoney,
					present: currentStoreCard.giveNumber,
					remark: this.remarks,
				}
				this.checkStoreStatus = true;
				return
			}
			this.afterMemberSelectedStatus = 0;
			if (this.carttingData.product_id === 0) {
				const combination_new = this.carttingData.productResults.map(e => {
					return {
						product_list_id: e.productId,
						sv_give_count: e.giveNumber,
						product_number: e.number,
						sv_dis_price: 0,
						sv_per_price: 0,
						sv_price: e.dealMoney,
						sv_eff_range: e.sv_eff_range,
						sv_eff_rangetype: e.sv_eff_rangetype,
						sv_package_total: null,
						sv_package_type: 0
					}
				});
				const postData = {
					user_id: this.userInfo.user_id,
					sv_p_name: '任意充次',
					sv_p_unitprice: this.goodsTotalInfo.totalMoney,
					combination_new: JSON.stringify(combination_new)
				}
				stockApi.quickCardSetmealProduct(postData).then(res => {
					this.checkinStatus = true;
					this.guiderSelectList = [];
					this.checkinData = {
						totalMoney: this.goodsTotalInfo.totalMoney,
						discountMoney: 0,
						product_id: res.product_id,
						receivableMoney: this.goodsTotalInfo.totalMoney,
						membercardRechargeList: res.membercardRechargeList,
						product_id: res.product_id,
					}
				})
			} else {
				this.checkinStatus = true;
				this.guiderSelectList = [];
				this.checkinData = {
					totalMoney: this.goodsTotalInfo.totalMoney,
					discountMoney: 0,
					receivableMoney: this.goodsTotalInfo.totalMoney,
					product_id: this.carttingData.product_id,
					membercardRechargeList: this.carttingData.productResults.map(e => {
						return {
							product_id: e.product_id,
							sv_mcr_productname: e.productName,
							sv_purchase_number: e.number,
							sv_give_number: e.giveNumber,
							sv_mcr_money: e.sv_mcr_money,
							sv_unitprice: e.dealMoney,
							product_list_id: e.product_list_id,
							sv_package_total: e.sv_package_total,
							sv_package_type: e.sv_package_type,
							sv_package_detailed_type: e.sv_package_type,
							validity_date: e.validity_date
						}
					})
				}
			}
		},
		// region 
		handleFirstCategoryAll() {                                  // 一级菜单点击事件-全部
			this.firstSelected = 0;
			this.secondSelected = 0;
			this.query.category = -1;
			this.query.erjicategory = -1;
			this.getGoodsList(true);
		},
		handleFirstCategory(item, index) {                          // 一级菜单点击事件
			if (this.firstSelected == index && this.firstSelected != 0) return;
			this.firstSelected = index;
			this.firstSelectedItem = {
				id: item.productcategory_id,
				label: item.sv_pc_name
			};
			this.secondSelected = 0;
			this.query.category = item.productcategory_id;
			this.query.erjicategory = -1;
			this.getSecondCategory(item.productcategory_id);
			this.getGoodsList(true);
		},
		handleSecondCategoryAll() {                                 // 二级菜单点击事件-全部
			if (this.secondSelected == 0) return;
			this.secondSelected = 0;
			this.query.erjicategory = -1;
			this.getGoodsList(true);
		},
		handleSecondCategory(item, index) {                         // 二级菜单点击事件
			this.searchKeywords = this.searchText;
			if (this.secondSelected == index) return;
			this.secondSelected = index;
			this.query.erjicategory = item.productsubcategory_id;
			this.getGoodsList(true);
		},
		addAdmissionCart(event, admissionItem) {                    // 入场卡添加购物车
			if (this.extendInfo.extendId === admissionItem.product_id && this.extendInfo.courseDataType === 3) return this.$message.warning('已添加相同入场卡')
			if (this.courseData.length > 0) {
				this.$confirm('已添加购买入场卡，是否更换入场卡?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.handlAdmissionToCart(admissionItem, admissionItem.list);
					if (this.$app.isNull(event)) return;
					this.animation(event, admissionItem.img);
				}).catch(() => {

				})
			} else {
				this.handlAdmissionToCart(admissionItem, admissionItem.list);
				if (this.$app.isNull(event)) return;
				this.animation(event, admissionItem.img);
			}
		},
		handlAdmissionToCart(admissionItem, courseList) {
			const courseItemList = [];
			courseList.forEach(courseItem => {
				let saleItemIndex = courseItem.timedetail.findIndex(e => e.sv_product_class_hourid === courseItem.son_product_id);
				let salePos = saleItemIndex > -1 ? saleItemIndex : 0;
				let sv_course_extendId = saleItemIndex > -1 ? admissionItem.product_id : 0;
				let sv_effective_time = courseItem.timedetail[salePos].sv_ective_date;
				const item = {
					...courseItem,
					salePos,
					sv_course_extendId,
					sv_product_class_hourid: courseItem.timedetail[salePos].sv_product_class_hourid,
					number: courseItem.product_number,
					sv_product_integral: 0,
					sv_effective_time,
					unitprice: this.$app.moneyFixed(courseItem.sv_unitprice),
					priceTotal: this.$app.moneyFixed(courseItem.sv_product_total),
					list: courseItem.timedetail.map((e, index) => {
						return {
							value: index,
							label: e.sv_p_name
						}
					})
				}
				courseItemList.push(item);
			})
			const open_card_way_list_text = {
				100: '即时开卡',
				200: '到店开卡',
				300: '指定日期开卡'
			}
			const timeUnit = {
				100: 1,
				200: 30,
				300: 365
			}

			const start = new Date();
			const end = start.getTime() + admissionItem.sv_effective_time_num * timeUnit[admissionItem.sv_effective_unit_type] * 24 * 3600 * 1000
			this.extendInfo = {
				extendId: admissionItem.product_id,
				sv_p_name: admissionItem.sv_p_name,
				courseDataType: 3,
				sv_number_people: admissionItem.sv_number_people,
				sv_affiliation_m_id: [],
				sv_product_total: admissionItem.sv_p_unitprice,
				sv_effective_time: '',
				sv_effective_time_start: this.$app.currentTime(start),
				sv_effective_time_end: this.$app.currentTime(new Date(end)),
				sv_effective_time_num: admissionItem.sv_package_type === 0 ? admissionItem.sv_effective_time_num : this.$app.addNumber(admissionItem.sv_effective_time_num, admissionItem.list[0].sv_give_count),
				sv_effective_unit_type: admissionItem.sv_effective_unit_type,
				open_card_way: this.$app.isNull(admissionItem.sv_open_card_way_list) ? null : admissionItem.sv_open_card_way_list[0].type,
				sv_open_card_way_list: (admissionItem.sv_open_card_way_list || []).map(e => {
					return {
						value: e.type,
						label: open_card_way_list_text[e.type],
						data: e.value
					}
				}),
			}
			this.handleChangeOpenCard();
			this.courseData = courseItemList;
		},
		handleChangeOpenCard() {
			const now = new Date();
			const timeUnit = {
				100: 1,
				200: 30,
				300: 365
			}
			if (this.extendInfo.open_card_way === 100) {
				const end = now.getTime() + this.extendInfo.sv_effective_time_num * timeUnit[this.extendInfo.sv_effective_unit_type] * 24 * 3600 * 1000
				this.extendInfo.sv_effective_time = this.$app.currentTime(new Date()) + ' 至 ' + this.$app.currentTime(new Date(end))
				return
			}
			if (this.extendInfo.open_card_way === 200) {
				const card_way_item = this.extendInfo.sv_open_card_way_list.find(e => e.value === this.extendInfo.open_card_way);
				this.extendInfo.sv_effective_time = card_way_item.data + '天内未开卡，则第' + (card_way_item.data + 1) + '天0：00自动开卡'
				return
			}
			if (this.extendInfo.open_card_way === 300) {
				const start = new Date(this.extendInfo.sv_effective_time_start)
				const end = start.getTime() + this.extendInfo.sv_effective_time_num * timeUnit[this.extendInfo.sv_effective_unit_type] * 24 * 3600 * 1000
				this.extendInfo.sv_effective_time_end = this.$app.currentTime(new Date(end))
				return
			}
		},
		handleSalePos(row) {
			row.sv_product_class_hourid = row.timedetail[row.salePos].sv_product_class_hourid;
			row.number = row.timedetail[row.salePos].sv_p_storage;
			row.number = row.timedetail[row.salePos].sv_p_storage;
			row.sv_product_integral = row.timedetail[row.salePos].sv_product_integral;
			row.sv_effective_time = row.timedetail[row.salePos].sv_ective_date;
			row.unitprice = this.$app.moneyFixed(row.timedetail[row.salePos].sv_p_unitprice);
			row.priceTotal = this.calcPriceTotal(row.timedetail[row.salePos].sv_p_unitprice, row.timedetail[row.salePos].sv_p_storage);

			const open_card_way_list_text = {
				100: '即时开卡',
				200: '到店开卡',
				300: '指定日期开卡'
			}
			const timeUnit = {
				100: 1,
				200: 30,
				300: 365
			}
			const start = new Date();
			const end = start.getTime() + row.timedetail[row.salePos].sv_effective_time_num * timeUnit[row.timedetail[row.salePos].sv_effective_unit_type] * 24 * 3600 * 1000
			this.extendInfo = {
				extendId: row.sv_product_id,
				sv_p_name: row.sv_p_name,
				courseDataType: 1,
				sv_number_people: 0,
				sv_affiliation_m_id: [],
				sv_product_total: this.calcPriceTotal(row.timedetail[row.salePos].sv_p_unitprice, row.timedetail[row.salePos].sv_p_storage),
				sv_effective_time: '',
				sv_effective_time_start: this.$app.currentTime(start),
				sv_effective_time_end: this.$app.currentTime(new Date(end)),
				sv_effective_time_num: row.timedetail[row.salePos].sv_effective_time_num,
				sv_effective_unit_type: row.timedetail[row.salePos].sv_effective_unit_type,
				open_card_way: this.$app.isNull(row.sv_open_card_way_list) ? null : row.sv_open_card_way_list[0].type,
				sv_open_card_way_list: (row.sv_open_card_way_list || []).map(e => {
					return {
						value: e.type,
						label: open_card_way_list_text[e.type],
						data: e.value
					}
				}),
			}
			this.handleChangeOpenCard();
		},
		handleDelPackage() {
			this.courseData = [];
			this.extendInfo = {
				extendId: 0,
				sv_p_name: '',
				courseDataType: 1,
				sv_number_people: 0,
				sv_affiliation_m_id: [],
				sv_product_total: 0,
				sv_effective_time: '',
				sv_effective_time_start: '',
				sv_effective_time_end: '',
				sv_effective_time_num: '',
				sv_effective_unit_type: 100,
				open_card_way: 100,
				sv_open_card_way_list: [],
			}
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
		handleMultAdd() {
			this.$root.$on('batchAddToCardRecharge', (goodsArray) => {
				goodsArray.forEach(item => {
					const goodsItem = {
						...item,
						product_id: item.productId,
						sv_p_name: item.productName,
						sv_p_unitprice: item.dealPrice,
						sv_p_barcode: item.barCode
					}
					this.handleGoodsToCart(goodsItem);
				})
			});
		},
		addCart(e, goodsItem) {                                     // 添加购物车
			if (this.currentMenuKey === 'goods') {
				this.handleGoodsToCart(goodsItem);
			}
			if (this.currentMenuKey === 'storeCards') {
				this.handleStoreCardItem(goodsItem);
			}
			if (this.$app.isNull(e)) return;
			// 加入购物车动画
			clearTimeout(this.s);
			let self = this,
				speed = 1000, //速度
				//点击的起点
				startY = e.clientY - 50,
				startX = e.clientX,
				//购物车坐标
				endX = 400,
				endY = 200;
			// 获取当前点击的商品图片
			self.animationImg = goodsItem.img;
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
		showGoodsAdd() {                                            // 显示新增商品弹窗 F2
			this.goodsAddStatus = true;
		},
		pageLast() {
			if (this.query.pageIndex === 1) return;
			this.query.pageIndex--;
			this.pageChange();
		},
		pageNext() {
			if (this.query.pageIndex === this.goodsTotal) return;
			this.query.pageIndex++;
			this.pageChange();
		},
		pageChange: debounce('getGoodsList', 200),
		firstAddBack() {                                            // 新增一级分类回调
			this.firstSelected++;
			this.getFirstCategory();
		},
		secondAddBack() {                                           // 新增二级分类回调
			this.getSecondCategory();
		},

		//#region 结算
		closeCheckin() {
			this.checkinStatus = false;
		},
		showGuiderSelect() {                                        // 显示销售员弹窗
			this.guiderSelectStatus = true;
		},
		handleBtnPrint() {                                          // 切换打印开关状态
			this.checkPrint = !this.checkPrint;
		},
		getGuiderSelected(array) {
			this.guiderSelectList = array;
		},
		showCashierPriceChange(index) {                             // 购物显示改价改折弹窗
			if (this.cardType === 'storeCards') return;
			if (!this.JurisdictionObj.key_change_price) return this.$message.warning('没有改价权限');
			this.priceChangeExtend = {
				type: this.cardType,
				dataPos: index
			}
			this.priceChangeStatus = true;
		},
		showCheckinPriceChange() {                                  // 结算显示改价改折弹窗
			if (!this.JurisdictionObj.key_change_price) return this.$message.warning('没有改价权限');
			this.checkinData.totalMoney = this.goodsTotalInfo.totalMoney;
			this.priceChangeExtend = {
				type: 'checkin',
				dataPos: -1
			}
			this.priceChangeStatus = true;
		},
		submitMoney(val) {                                          // 提交改价改折
			if (val.type === 'checkin') {
				this.goodsTotalInfo.totalMoney = val.value;
				this.checkinData.receivableMoney = val.value;
				this.checkinData.discountMoney = this.$app.subtractNumber(this.checkinData.totalMoney, val.value);
			} else {
				this.carttingData.productResults[this.priceChangeExtend.dataPos].dealMoney = val.value;
				this.$nextTick(() => {
					this.priceChangeExtend = {
						type: 'checkin',
						dataPos: -1
					}
				})
				// this.carttingData.totalMoney = val.value;
			}
		},
		handleBtnInput(item) {                                      // 计算输入框的值
			let value = item.value;
			if (value === 'C') {
				this.inputPriceHandler = 0;
				this.inputPriceTimer = null;
				clearTimeout(this.inputPriceTimer);
				this.checkinData.receivableMoney = this.checkinData.totalMoney;
				this.checkinData.discountMoney = 0;
				return;
			}
			let inputValue = this.checkinData.receivableMoney + '';
			if (this.inputPriceHandler < 1) {
				inputValue = '';
				this.inputPriceHandler = 5;
			}
			clearTimeout(this.inputPriceTimer);
			this.inputPriceTimer = setTimeout(() => {
				this.inputPriceHandler = 0;
				this.inputPriceTimer = null;
				clearTimeout(this.inputPriceTimer);
			}, 5000);
			if (inputValue.indexOf('.') > -1 && value === '.') return;
			if (value !== '0') {
				if (inputValue === '' && value === '.') inputValue = '0'
			} else {
				if (inputValue === '0') return
			}
			inputValue = inputValue + value;
			inputValue = this.$app.verifyNumberDecimal(inputValue);
			this.checkinData.receivableMoney = inputValue;
			this.checkinData.discountMoney = this.checkinData.totalMoney > this.checkinData.receivableMoney ? this.$app.subtractNumber(this.checkinData.totalMoney, this.checkinData.receivableMoney) : 0;
		},
		handleCloseScan() {
			this.$refs.checkin.focus();
		},
		handleSubmit() {                                            // 提交结算
			this.afterMemberSelectedStatus = 0;
			if (this.cashierJurisdiction.RechargeSelectCommissionRequired && this.guiderSelectList.length < 1) {
				this.$message({ message: '请选择导购员', type: 'warning' });
				this.showGuiderSelect();
				return
			}
			if (this.$refs.payTypeList.getPayTypeInfo().length < 1) return this.$message({ message: '请选择支付方式', type: 'warning' });
			if (!this.memberSelected) {
				this.showMemberList();
				this.afterMemberSelectedStatus = 2;
				return
			}
			if (this.$refs.payTypeList.getPayTypeInfo().find(e => e.name === '储值卡') && this.sv_uc_isenablepwd) {
				// 储值卡验证 (设置储值卡验证为储值卡密码，会员未设置密码时，不验证)
				if (this.memberCardCheckType !== 0) {
					if (this.memberCardCheckType === 1) {
						if (!this.$app.isNull(this.memberInfo.sv_mr_pwd)) return this.memberCardCheckStatus = true;
					} else {
						return this.memberCardCheckStatus = true;
					}
				}
			}
			this.setmealProductCharge();
		},
		memberCardCheckSuccess() {                                  // 会员储值卡消费验证成功回调
			this.setmealProductCharge();
		},
		setmealProductCharge() {                                    // 充卡接口 发送数据
			let p_scanpayCondition = this.userInfo.dec_payment_method !== null && this.userInfo.dec_payment_config.ConvergePay;         // 扫码支付是否开启
			if (this.$refs.payTypeList.isScanPay()) {
				if (!p_scanpayCondition) return this.$message.warning('您尚未开通扫码支付功能，请联系销售')
				return this.$refs.payTypeList.handleScan();
			}
			const submitTime = this.$app.currentTime(new Date());
			const itemPercent = this.guiderSelectList.length === 1 ? 100 : parseInt(100 / this.guiderSelectList.length)
			const commissionemployePercent = this.guiderSelectList.map((e, i) => {
				return {
					employeeId: e.id,
					percent: i !== this.guiderSelectList.length - 1 ? itemPercent : (100 - itemPercent * (this.guiderSelectList.length - 1))
				}
			})
			const postData = {
				userid: this.userInfo.user_id,
				product_id: this.checkinData.product_id,
				menber_name: this.memberInfo.sv_mr_name,
				menber_card: this.memberInfo.sv_mr_cardno,
				member_id: this.memberInfo.member_id,
				sv_remark: this.remarks,
				mcr_payment: this.$refs.payTypeList.getPayTypeInfo()[0].name,
				originalprice: this.checkinData.totalMoney,
				favorableprice: this.$app.moneyFixed(this.checkinData.receivableMoney),
				favorable: this.checkinData.totalMoney ? this.$app.moneyFixed(this.checkinData.receivableMoney / this.checkinData.totalMoney) : 0,
				commissionemployePercent: commissionemployePercent,
				mcr_date: submitTime,
				isSms: this.checkMessage ? 1 : 0,
				sv_is_cashier: true,
				membercardRechargeList: this.checkinData.membercardRechargeList
			}
			stockApi.setmealProductChargeAdd(postData).then(res => {
				if (res) {
					this.$message.success('充次成功!');
					if (this.checkPrint) {
						this.handlePrint(submitTime);
					}
					this.submitSuccess();
				}
			})
		},
		convergePurchase(authcode) {                                // 会员充次  聚合支付
			const submitTime = this.$app.currentTime(new Date());
			const itemPercent = this.guiderSelectList.length === 1 ? 100 : parseInt(100 / this.guiderSelectList.length)
			const commissionemployePercent = this.guiderSelectList.map((e, i) => {
				return {
					employeeId: e.id,
					percent: i !== this.guiderSelectList.length - 1 ? itemPercent : (100 - itemPercent * (this.guiderSelectList.length - 1))
				}
			})
			const postData = {
				userid: this.userInfo.user_id,
				product_id: this.checkinData.product_id,
				menber_name: this.memberInfo.sv_mr_name,
				menber_card: this.memberInfo.sv_mr_cardno,
				member_id: this.memberInfo.member_id,
				sv_remark: this.remarks,
				mcr_payment: this.$refs.payTypeList.getPayTypeInfo()[0].name,
				originalprice: this.checkinData.totalMoney,
				favorableprice: this.$app.moneyFixed(this.checkinData.receivableMoney),
				favorable: this.checkinData.totalMoney ? this.$app.moneyFixed(this.checkinData.receivableMoney / this.checkinData.totalMoney) : 0,
				commissionemployePercent: commissionemployePercent,
				mcr_date: submitTime,
				isSms: this.checkMessage ? 1 : 0,
				authcode,
				sv_is_cashier: true,
				membercardRechargeList: this.checkinData.membercardRechargeList
			}
			stockApi.setmealProductChargeAdd(postData).then(res => {
				if (res && res.serialNumber) {
					return this.$refs.payTypeList.getConvergePayResult(res.serialNumber);
				}
				this.$message.error('充卡失败:' + res.errmsg);
			}).catch(e => {
				this.$message.error(e);
			})
		},
		handleSuccess() {
			this.handlePos = -1;
			this.courseData = [];
			this.handleDelPackage();
			this.orderTime = new Date();
			this.orderIntegral = 0;
			this.remark = '';
			this.$root.$emit('keyCode', 112);
			this.clearMember();
		},
		submitSuccess() {                                           // 结算成功回调
			this.isSubmitting = false;
			this.checkinStatus = false;
			this.checkStoreStatus = false;
			this.$message.success('充次成功!');
			setTimeout(() => {
				this.clearCarttingList();
				this.handleClearMember();
				this.getGoodsList();
				this.getTimesCard();
			}, 300);
		},
		handlePrint(submitTime) {
			const memberCardMoney = this.$app.subtractNumber(this.memberInfo.sv_mw_availableamount, this.$refs.payTypeList.getPayTypeInfo()[0].name === '储值卡' ? this.checkinData.receivableMoney : 0)
			let printDataList = [
				{
					type: 'line',
					text: '次卡购买',
					size: 17,
					lineHeight: 30,
					align: 1
				},
				{
					type: 'line',
					text: this.userInfo.sv_us_name,
					align: 1,
					spaceLine: 1
				},
				{
					type: 'line',
					text: '会员姓名：' + this.memberInfo.sv_mr_name
				},
				{
					type: 'line',
					text: '会员卡号：' + this.memberInfo.sv_mr_cardno
				},
				{
					type: 'line',
					text: '会员电话：' + this.memberInfo.sv_mr_mobile
				},
				{
					type: 'line',
					text: '储值余额：' + memberCardMoney
				},
				{
					type: 'line',
					text: '购买时间：' + submitTime
				}
			]
			const guilderText = this.guiderSelectList.map(e => e.name).join('、');
			if (!this.$app.isNull(guilderText)) {
				printDataList.push({
					type: 'line',
					text: '销售人员：' + guilderText
				})
			}

			let tableData = {
				header: ['项目', '购买次数', '赠送次数'],
				list: [],
				footer: []
			}
			let buyNumber = 0;
			tableData.list = this.carttingData.productResults.map(e => {
				buyNumber += parseInt(e.number) + e.giveNumber;
				return {
					name: e.productName,
					number: e.number + '',
					time: e.giveNumber > 0 ? e.giveNumber + '' : ''
				}
			})
			tableData.footer = ['合计', buyNumber + '', ''];
			let isDriverType = this.$store.state.cashierJurisdiction.printName.indexOf('免驱动') < 0;
			printDataList = printDataList.concat(this.$app.printMemberCardTable(tableData, isDriverType, this.$store.state.printTemplate.salesData.width));

			let moreInfo = [
				{
					type: 'line',
					text: '合计金额：' + this.$app.moneyFixed(this.checkinData.totalMoney)
				},
				{
					type: this.checkinData.discountMoney > 0 ? 'line' : 'error',
					text: '优惠金额：' + this.$app.moneyFixed(this.checkinData.discountMoney)
				},
				{
					type: 'line',
					text: '实收金额：' + this.$app.moneyFixed(this.checkinData.receivableMoney)
				},
				{
					type: 'line',
					text: '付款方式：' + this.$refs.payTypeList.getPayTypeInfo()[0].name,
					bottomLine: true
				},
				{
					type: 'line',
					text: '店铺电话：' + this.userInfo.sv_us_phone
				},
				{
					type: 'line',
					text: '店铺地址：' + this.userInfo.sv_us_address
				},
				{
					type: 'line',
					text: '备注：' + this.remarks,
					spaceLine: 1
				}
			]
			printDataList = printDataList.concat(moreInfo);

			this.$print.sales(printDataList);
			// this.$message.success('打印成功');
		},
	}
};