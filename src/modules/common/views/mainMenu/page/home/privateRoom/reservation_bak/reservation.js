import base from "@/api/base.js";
import { stockApi } from "@/api/index.js";
import { mapState, mapMutations, mapActions } from 'vuex';
import numberChange from '../../../../base/numberChange/numberChange.vue';
import discount from '../../../../base/discount/discount.vue';
import priceChange from '../../../../base/priceChange/priceChange.vue';
import payTypeList from '@/components/vocational/payTypeList/payTypeList.vue';
export default {
	name: 'reservation',
	components: { numberChange, discount, priceChange, payTypeList },
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		editReservation: {
			type: Object,
			default: () => {
				return {
					date: ''
				}
			}
		},
		tableInfo: {
			type: Object,
			default: () => {
				return {
					sv_table_id: 0
				}
			}
		},
		guiderList: {
			typeof: Array,
			default: () => []
		},
	},
	data() {
		const bookSelect = {}
		for (let index = 0; index < 24; index++) {
			bookSelect[index] = { isSet: false }
		}
		return {
			Forbid: '',                                         // 结算接口时间戳
			isSuccess: false,                                   // 结算成功
			hasGetEditMember: false,                            // 再支付，请求会员
			isSubmitting: false,                                // 正在结算
			sv_employee_id: null,                               // 员工Id
			sv_billable_id: null,                               // 计费规则
			receivableMoney: 0,                                 // 应收金额
			billabletimeList: [],
			queryBooking: {
				sv_source_type: -1,
				sv_table_id: 0,
				state: 4,                                       // 状态：-1全部，1.已预订；2.已开单；3.已取消；4.未取消预订单（已预订+已开单）
				pageIndex: 1,
				pageSize: 999
			},
			setStartTime: '',
			bookSelect: bookSelect,
			bookingList: [],
			currentDate: '',
			endDate: '',
			isToday: true,
			startTime: '',
			endTime: '',
			pickerStart: '',
			reservationData: {
				productResults: []
			},
			sv_remark: '',
			memberPointStatus: false,
			usePointCheck: false,                               // 勾选使用积分
			userPoint: {                                        // 会员积分配置
				switch: false,                                  // 是否开启
				proportion: 0,                                  // 比例
				maxValue: '',                                   // 可输入最大积分
				inputValue: ''
			},
			discountBase: 0,                                    // 可折扣优惠金额
			couponRecordIds: [],
			discountStatus: false,                              // 优惠券弹窗状态

			limitedTimer: null,
			inputMemberKeyword: '',                             // 会员搜索输入框
			showDownPayment: false,                             // 弹窗使用订金
			showDownPaymentContent: false,                      // 订金消费详情弹窗
			downPaymentSetted: false,                           // 已设置使用订金
			downPaymentMoney: 0,                                // 使用订金金额
			hasDownPayment: false,
			isMultiPayType: false,                              // 是否选择组合支付
			receviableBase: '',                                 // 基础应收
			payChangeMoney: '',
			payChangeMoneyType: 1,
			priceChangeStatus: false,
			payMoney: 0,                                        // 收款金额
			exchangeMoney: 0,                                   // 找零金额
			orderChangeMoney: null,                             // 整单改价金额
			multiPayMoney: {
				dealMoney1: '',
				dealMoney2: '',
			},
			downPaymentInfo: {                                  // 订金使用内容
				no: '',
				isShowInCheckIn: false
			},
			bookingInfo: {                                      // 预约再支付 取编辑信息
				id: null,
			},
		}
	},
	computed: {
		...mapState(['userInfo', 'JurisdictionObj', 'cashierJurisdiction', 'memberInfo', 'memberSetting', 'queryUpdateCartting', 'customerDisplayData']),
		...mapState('permission', ['CashierManage']),
		dialogVisible: {
			get() { return this.visible; }, set(value) {
				value = value === 'close' ? false : value;
				this.$emit('update:visible', value);
			}
		},
		freeZeroMoney() {                           // 展示抹零金额
			return this.reservationData.freeZeroMoney || 0
		},
		hasPointWrap() {
			return this.userPoint.switch && parseFloat(this.pointData.point) > 0
		},
		pointData() {                              // 积分抵扣金额
			let orderPromotionPoint = !this.$app.isNull(this.reservationData.orderPromotions) ? this.reservationData.orderPromotions.find(e => e.type === 11) : '';
			return {
				money: this.$app.isNull(orderPromotionPoint) ? '' : orderPromotionPoint.couponMoney,
				point: this.$app.isNull(orderPromotionPoint) ? this.userPoint.inputValue : orderPromotionPoint.data
			}
		},
		hasOrderCouponMoney() {                     // 有可以折扣的金额
			return this.reservationData.lastOrderCouponMoney > 0
		},
		couponSelected() {                          // 已选择优惠券
			let orderPromotionCoupon = !this.$app.isNull(this.reservationData.orderPromotions) ? this.reservationData.orderPromotions.filter(e => e.type === 10) : '';
			return this.$app.isNull(orderPromotionCoupon) ? false : orderPromotionCoupon.map(e => e.data)
		},
		memberChangeNeedReget() {
			return !this.isSuccess && this.dialogVisible
		},
	},
	watch: {
		dialogVisible: {
			async handler(newVal, oldVal) {
				if (newVal) {
                    if (this.customerDisplayData.enable) {
                        this.$app.showCustomerDisplay(this.customerDisplayData.port, this.customerDisplayData.baud, 0, '');
                    }
					this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
					this.isSuccess = false;
					this.isSubmitting = false;
					this.sv_employee_id = null;
					this.sv_billable_id = null;
					this.orderChangeMoney = null;
					this.usePointCheck = false;
					this.userPoint = {                                  // 会员积分配置
						switch: false,                                  // 是否开启
						proportion: 0,                                  // 比例
						maxValue: '',                                   // 可输入最大积分
						inputValue: ''
					}
					this.discountStatus = false;
					this.couponRecordIds = [];
					this.reservationData = {
						productResults: []
					}

					this.setStartTime = '';
					if (this.editReservation.isEdit) {
						await this.getBookingById(this.editReservation.id);
					} else {
						this.queryBooking.sv_table_id = this.tableInfo.sv_table_id;
						this.currentDate = !this.$app.isNull(this.editReservation.date) ? this.editReservation.date : this.$app.currentTime(new Date(), 'yyyy-MM-dd');
						this.isToday = this.currentDate === this.$app.currentTime(new Date(), 'yyyy-MM-dd');
						this.startTime = '';
						this.endTime = '';
						if (this.isToday) {
							const now = new Date()
							const now_minutes = now.getMinutes();
							now.setMinutes(Math.ceil(now_minutes / 5) * 5);
							this.pickerStart = this.$app.currentTime(now, 'HH:mm')
						} else {
							this.pickerStart = '00:00'
						}
					}
					await this.getBillabletimeConfig();
					await this.getTableBookingList();
					await this.calcMoney();
					this.caleBillabletimeMoney();

					// let menuJson = this.$app.getLocalStorage('menuJson') || [];
					// const downPaymentItem = menuJson.find(e => e.menu_code === '/downPayment_classifyEntry');
					// if (downPaymentItem) {
					//     // 开启订金未隐藏
					//     if (downPaymentItem.sv_enabled && !downPaymentItem.sv_is_hide) {
					//         this.hasDownPayment = true;
					//     }
					// }

					this.$nextTick(() => {
						!!this.$refs.reservation && this.$refs.reservation.focus();
					})
				} else {
					this.clearMember();
				}
			}
		},
		'memberInfo.member_id': {
			handler(newVal) {
				this.receviableBase = '';
				if (this.$app.isNull(newVal)) {
					this.userPoint = {                                  // 会员积分配置
						switch: false,                                  // 是否开启
						proportion: 0,                                  // 比例
						maxValue: '',                                   // 可输入最大积分
						inputValue: ''
					}
				}
				if (this.memberChangeNeedReget) {
					this.caleBillabletimeMoney();
				}
			}
		},
		'memberInfo.sv_wallet_id': {
			handler(newVal) {
				if (this.memberChangeNeedReget) {
					this.caleBillabletimeMoney();
				}
			}
		},
		isMultiPayType: {
			handler(newVal) {
				if (newVal) {
					this.multiPayMoney.dealMoney1 = this.reservationData.dealMoney
				}
			}
		},
	},
	mounted() {

	},
	methods: {
		...mapMutations(['update', 'clearMember']),
		...mapActions(['requsetMemberInfo']),
		closeDialog() {
			this.dialogVisible = 'close';
		},
		getMemeberFilters() {                               // 获取会员配置相关信息
			if (this.$app.isNull(this.reservationData.lastOrderCouponMoney) || this.$app.isNull(this.memberInfo.member_id)) return
			if (this.userPoint.switch) {
				let value = this.memberInfo.sv_mw_availablepoint > 0 ? this.memberInfo.sv_mw_availablepoint : 0;
				let pointToMoney = parseInt(value / this.userPoint.proportion);
				let maxValue = parseInt(this.reservationData.lastOrderCouponMoney) * this.userPoint.proportion;
				this.userPoint.inputValue = value < maxValue ? pointToMoney * this.userPoint.proportion : maxValue;
				return
			}
			stockApi.getMemeberFilters().then(res => {
				if (res) {
					let jsonData = JSON.parse(res.values.sv_uc_dixian);
					this.userPoint.switch = jsonData.whether;
					this.userPoint.proportion = jsonData.auto;
					let value = this.memberInfo.sv_mw_availablepoint > 0 ? this.memberInfo.sv_mw_availablepoint : 0;
					let pointToMoney = parseInt(value / this.userPoint.proportion);
					let maxValue = parseInt(this.reservationData.lastOrderCouponMoney) * this.userPoint.proportion;
					this.userPoint.inputValue = value < maxValue ? pointToMoney * this.userPoint.proportion : maxValue;
					this.userPoint.maxValue = this.userPoint.inputValue;
				}
			})
		},
		async getBookingById(bookingId) {                   // 获取房台基础信息
			return stockApi.getBookingById({ id: bookingId }).then(res => {
				if (res) {
					this.bookingInfo = res;
					this.queryBooking.sv_table_id = this.bookingInfo.sv_table_id;
					this.currentDate = this.bookingInfo.sv_arrival_date.substring(0, 10);
					this.isToday = this.currentDate === this.$app.currentTime(new Date(), 'yyyy-MM-dd');
					this.startTime = this.bookingInfo.sv_arrival_date.substring(11, 21);
					this.endTime = this.bookingInfo.sv_arrival_end_date.substring(11, 21);
					this.sv_billable_id = this.bookingInfo.sv_billable_id;
					this.sv_employee_id = this.bookingInfo.sv_employee_id || null;
					this.requsetMemberInfo(res.member_id);
				}
			});
		},
		async handleChangeDate(type) {
			if (type === 'last' && this.isToday) return
			const date = new Date(this.currentDate + ' 00:00:00')
			if (type === 'last') {
				date.setDate(date.getDate() - 1)
			} else {
				date.setDate(date.getDate() + 1)
			}
			this.currentDate = this.$app.currentTime(date, 'yyyy-MM-dd');
			this.isToday = this.currentDate === this.$app.currentTime(new Date(), 'yyyy-MM-dd');
			if (this.isToday) {
				const now = new Date()
				const now_minutes = now.getMinutes();
				now.setMinutes(Math.ceil(now_minutes / 5) * 5);
				this.pickerStart = this.$app.currentTime(now, 'HH:mm')
			} else {
				this.pickerStart = '00:00'
			}
			await this.getTableBookingList();
			await this.calcMoney();
			this.caleBillabletimeMoney();
		},
		handleChangeTime(e) {
			this.startTime = e + ':59';
			this.handleChangeBillable();
		},
		timeSelect() {
			this.bookSelect = [];
			this.bookingList.forEach(item => {
				const startHours = new Date(item.sv_arrival_date).getHours();
				const startMinutes = new Date(item.sv_arrival_date).getMinutes();
				const endHours = new Date(item.sv_arrival_end_date).getHours();
				const endMinutes = new Date(item.sv_arrival_end_date).getMinutes();
				const effectHours = endHours > startHours ? endHours - startHours : 0;
				for (let index = 0; index <= effectHours; index++) {
					if (index === 0) {
						this.bookSelect[startHours + index] = {
							isSet: true,
							left: parseFloat(startMinutes / 60) * 14 + 'px',
							width: (index === effectHours && endHours > startHours ? parseFloat((endMinutes - startMinutes) / 60) : 1) * 14 + 'px'
						}
					} else {
						if (endMinutes === 0 && index === effectHours) {

						} else {
							this.bookSelect[startHours + index] = {
								isSet: true,
								left: 0,
								width: (index === effectHours ? parseFloat(endMinutes / 60) : 1) * 14 + 'px'
							}
						}
					}
				}
			});
		},
		async handleChangeBillable() {
			await this.calcMoney();
			this.caleBillabletimeMoney();
		},
		async getTableBookingList() {
			const postData = {
				...this.queryBooking,
				sv_arrival_start_date: this.currentDate + ' 00:00:00',
				// sv_arrival_end_date: this.currentDate + ' 23:59:59',
			}
			return stockApi.getTableBookingList(postData).then(res => {
				if (res) {
					this.bookingList = res.list;
					this.timeSelect();
				}
			});
		},
		async getBillabletimeConfig() {
			return stockApi.getBillabletimeConfig({ tableId: this.queryBooking.sv_table_id }).then(res => {
				if (res) {
					this.billabletimeList = res.map(e => {
						return {
							...e,
							label: e.name,
							value: e.id
						}
					})
					this.sv_billable_id = this.billabletimeList.find(e => e.is_default) ? this.billabletimeList.find(e => e.is_default).id : null;
				}
			});
		},
		async calcMoney() {
			if (this.$app.isNull(this.sv_billable_id)) return
			if (this.$app.isNull(this.currentDate) || this.$app.isNull(this.startTime)) return
			return stockApi.calcMoney({ id: this.sv_billable_id }).then(res => {
				if (res) {
					const time = new Date(this.currentDate + ' ' + this.startTime).getTime() + res.duration * 60 * 1000;
					const endDate = this.$app.currentTime(new Date(time), 'yyyy-MM-dd HH:mm:ss');
					this.endDate = endDate.substring(0, 10);
					this.endTime = endDate.substring(11, 21);
				}
			});
		},
		caleBillabletimeMoney() {
			if (this.$app.isNull(this.sv_billable_id)) return
			if (this.$app.isNull(this.currentDate) || this.$app.isNull(this.startTime) || this.$app.isNull(this.endTime)) return
			const postData = {
				buySteps: [
					{
						index: 1,
						number: 1,
						bookingTableusingId: this.editReservation.isEdit ? this.editReservation.id : null,
						bookingTable: this.editReservation.isEdit ? null : {
							startTime: this.currentDate + ' ' + this.startTime,
							endTime: this.endDate + ' ' + this.endTime,
							tableId: this.tableInfo.sv_table_id,
							billableConfigId: this.sv_billable_id,
						}
					}
				],
				couponRecordIds: this.couponRecordIds,
				currentStep: 3,
				giveSteps: [],
				memberId: this.memberInfo.member_id,
				memberPoint: this.usePointCheck ? this.userPoint.inputValue : null,
				orderChangeMoney: this.orderChangeMoney,
				walletId: this.$app.isNull(this.memberInfo.member_id) ? null : this.memberInfo.sv_wallet_id
			}
			stockApi.getCarttingCale(postData).then(res => {
				if (res) {
					this.reservationData = res;
					this.receivableMoney = this.$app.moneyFixed(this.$app.subtractNumber(this.reservationData.dealMoney, this.freeZeroMoney));
					this.payMoney = this.receivableMoney;
					this.discountBase = this.reservationData.lastOrderCouponMoney;
					if (this.$app.isNull(this.receviableBase)) {
						this.receviableBase = this.receivableMoney;
					}
					this.exchangeMoney = 0;
					if (this.isMultiPayType) {
						this.multiPayMoney.dealMoney1 = this.reservationData.dealMoney;
						this.multiPayMoney.dealMoney2 = this.$app.subtractNumber(this.reservationData.dealMoney, this.multiPayMoney.dealMoney1);
					}
					if (this.memberInfo.member_id) {
						this.getMemeberFilters();
					}
				}
			});
		},
		handlePaymemtChange() {
			this.exchangeMoney = 0;
			this.payMoney = this.receivableMoney;
		},
		handleReceivable() {                                    // 修改应收
			this.priceChangeMenuPos = 0;
			this.priceChangeStatus = true;
			this.payChangeMoneyType = -1;
			const changePriceItem = this.reservationData.orderPromotions.find(e => e.type === 12);
			this.payChangeMoney = this.$app.addNumber(this.reservationData.dealMoney, changePriceItem ? changePriceItem.couponMoney : 0);
		},
		handleExchange() {                                      // 修改找零
			this.priceChangeMenuPos = 0;
			this.priceChangeStatus = true;
			this.payChangeMoneyType = -2;
			this.payChangeMoney = this.receivableMoney;
		},
		submitMoney(val) {                                      // 提交改价改折
			if (this.payChangeMoneyType === -1) {
				// 改应收金额
				this.orderChangeMoney = parseFloat(val);
				this.caleBillabletimeMoney();
				return
			}
			if (this.payChangeMoneyType === -2) {
				// 改应收金额
				this.payMoney = parseFloat(val);
				this.exchangeMoney = this.$app.subtractNumber(this.payMoney, this.receivableMoney);
				return
			}
			if (val > this.reservationData.dealMoney) {
				return this.$message.warning('输入金额超过应收金额')
			}
			this.multiPayMoney['dealMoney' + this.payChangeMoneyType] = parseFloat(val);
			if (this.payChangeMoneyType === 1) {
				this.multiPayMoney.dealMoney2 = this.$app.subtractNumber(this.reservationData.dealMoney, val);
			} else {
				this.multiPayMoney.dealMoney1 = this.$app.subtractNumber(this.reservationData.dealMoney, val);
			}
		},
		handleChangeMoney(item, index) {
			this.priceChangeStatus = true;
			const type = index + 1;
			this.payChangeMoneyType = type
			this.payChangeMoney = this.multiPayMoney['dealMoney' + type];
		},
		handleBooking() {                                   // 确定预约
			const postData = {
				sv_type: 1,
				id: 0,
				sv_billable_id: this.sv_billable_id,
				sv_table_id: this.tableInfo.sv_table_id,
				usingId: this.tableInfo.usingId || 0,
				member_id: this.memberInfo.member_id,
				sv_arrival_date: this.currentDate + ' ' + this.startTime,
				sv_arrival_end_date: this.endDate + ' ' + this.endTime,
				sv_employee_id: this.$app.isNull(this.sv_employee_id) ? 0 : this.sv_employee_id,
				sv_remark: this.sv_remark,
			}
			stockApi.operateCateringTableUsing(postData).then(res => {
				if (res) {
					this.$message.success('挂单成功');
					this.closeDialog();
				}
			});
		},
		handleSubmitOrder() {
			if (this.isSubmitting) return
			let buySteps = this.reservationData.productResults.map((e, i) => {
				let commissions = [];
				if (this.sv_employee_id) {
					commissions.push(
						[{
							employeeId: this.sv_employee_id,
							assign: false,
							percent: 100,
							sex: null
						}]
					)
				}
				return {
					index: i + 1,
					productId: e.productId,
					bookingTableusingId: this.editReservation.isEdit ? this.editReservation.id : null,
					number: e.number,
					bookingTable: this.editReservation.isEdit ? null : {
						startTime: this.currentDate + ' ' + this.startTime,
						endTime: this.endDate + ' ' + this.endTime,
						tableId: this.tableInfo.sv_table_id,
						billableConfigId: this.sv_billable_id,
					},
					tradePrice: e.tradePrice,
					productChangeMoney: e.productChangeMoney,                   // 小计改价
					multCommissions: commissions.length > 0 ? commissions : null
				}
			});
			let paymentList = [];
			if (this.downPaymentSetted && this.downPaymentInfo.isShowInCheckIn) {
				paymentList.push({
					name: '订金',
					money: parseFloat(this.downPaymentMoney),
					data: this.downPaymentInfo.id
				})
			}
			let receipts = 0;
			this.$refs.payTypeList.getPayTypeInfo().forEach((e, i) => {
				let money = 0;
				if (this.isMultiPayType) {
					money = parseFloat(this.multiPayMoney['dealMoney' + (i + 1)])
				} else {
					money = parseFloat(this.payMoney)
				}
				receipts = this.$app.addNumber(receipts, money);
				paymentList.push({
					name: e.name,
					money: money,
					data: e.name === '储值卡' ? this.memberInfo.sv_wallet_id : null
				})
			})
			let filter = this.$refs.payTypeList.getPayTypeInfo().filter(e => e.name === '扫码支付');
			if (filter.length > 0) {
				if (!this.userInfo.dec_payment_config.ConvergePay) return this.$message.warning('您尚未开通扫码支付，请联系客服')
				if (receipts === 0) {
					return this.$message.warning('收款金额为零，支付方式不支持扫码支付')
				}
			}
			if (this.isMultiPayType) {
				// 组合支付过滤金额为零
				paymentList = paymentList.filter(e => e.money !== 0)
			}
			let query = {
				totalMoney: this.reservationData.totalMoney,           // 原总价
				dealMoney: this.reservationData.dealMoney,             // 成交总价 === dealMoney
				exchangeMoney: this.exchangeMoney,                  // 找零金额
				payments: paymentList,
				caleDto: {
					buySteps: buySteps,
					memberId: this.memberInfo.member_id,            // 会员Id
					walletId: this.$app.isNull(this.memberInfo.member_id) ? null : this.memberInfo.sv_wallet_id,
					couponRecordIds: this.couponSelected ? this.couponSelected : null,              // 优惠券Id
					orderChangeMoney: this.reservationData.orderChangeMoney,                        // 整单改价改折
					memberPoint: this.usePointCheck ? parseFloat(this.pointData.point) : null       // 积分抵扣
				},
				remark: this.sv_remark,
				sourceType: 100,
				isSettle: true
			}
			this.isSubmitting = true;
			stockApi.orderSave(query, this.Forbid, this.isFixing).then(res => {
				this.isSubmitting = false;
				if (res !== false && !this.$app.isNull(res)) {
					// this.successInfo.paymentList = paymentList;
					if (this.$refs.payTypeList.isScanPay()) {
						this.payInfo = {
							queryId: res.queryId,
							svOrderListId: res.svOrderListId,
							receivableMoney: this.receivableMoney,
							money: paymentList.find(p => p.name === '扫码支付').money
						}
						this.$refs.payTypeList.handleScan();
					} else {
						this.submitSuccess(res.svOrderListId);
					}
				} else {
					this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
				}
			}).catch(_ => {
				this.isSubmitting = false;
				this.Forbid = this.userInfo.user_id + '' + new Date().getTime();
			});
		},
		submitSuccess(id = this.successInfo.orderNumber) {          // 结算成功回调
			this.$message.success('预约成功')
			this.isSuccess = true;
			this.clearMember();
			this.closeDialog();
			this.$emit('submit', { type: 'success' });
		},
		handleInputLimited() {
			if (this.memberSetting.keyCardInitial) {
				clearTimeout(this.limitedTimer);
				this.limitedTimer = setTimeout(e => {
					this.inputMemberKeyword = ''
				}, 100)
			}
		},
		showMemberList() {                                          // 显示会员弹窗
			let permissionItem = this.CashierManage.Select_Members || { enabled: true };
			if (!permissionItem.enabled) return this.$message.warning(permissionItem.tips || '无权限')
			// this.allStoreStatus = this.memberSetting.isRechargeInitial && this.memberSetting.isMemberConsume;
			this.memberListStatus = true;
			this.$root.$emit('keyCode', 117);
			this.$nextTick(() => {
				this.inputMemberKeyword = '';
			})
		},
		showMemberRecharge() {
			this.$root.$emit('keyCode', 87);
		},
		showDiscount() {                                            // 显示优惠券弹窗
			this.discountStatus = true;
		},
		showStoreCard() {
			this.$root.$emit('keyCode', 80);
		},
		showEquityCard() {
			this.$root.$emit('keyCode', 85);
		},
		handlePrevent(e) {                                          // 会员输入框事件阻止
			let code = parseInt(e.keyCode);
			if (code == 13) {
				this.showMemberList();
			} else {
				return false;
			}
		},
		showNumberChange() {                                        // 显示积分修改弹窗
			this.memberPointStatus = true;
		},
		handlePointSwitch() {                                       // 打开积分开关
			if (this.usePointCheck && this.userPoint.maxValue > 0) {
				return this.memberPointStatus = true;
			}
			this.caleBillabletimeMoney()
		},
		handlePointClose() {                                        // 使用积分弹窗关闭
			this.usePointCheck = false;
		},
		handlePointChange(e) {                                      // 返回使用的积分
			let inputPoint = e - e % this.userPoint.proportion;
			if (inputPoint < this.userPoint.proportion) {
				this.usePointCheck = false;
				return this.$message.warning(this.userPoint.proportion + '抵扣1元，请使用 ' + this.userPoint.proportion + '的倍数')
			}
			this.userPoint.inputValue = inputPoint;
			this.caleBillabletimeMoney();
		},
		getCouponRecordId(list) {                                     // 选中的优惠券id
			this.couponRecordIds = list.map(e => e.sv_record_id);
			this.caleBillabletimeMoney();
		},
		handleDownPaymet() {                                        // 弹出订金搜索
			if (!this.downPaymentSetted) {
				this.showDownPayment = true;
			} else {
				this.$confirm('是否取消使用订金?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.inputNumber = this.receivableMoney;
					this.downPaymentSetted = false;
					this.downPaymentMoney = 0;
					this.downPaymentInfo = {
						no: '',
						isShowInCheckIn: false
					};
				}).catch(() => {

				});
			}
		},
	}
};