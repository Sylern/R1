import base from "@/api/base.js";
import { stockApi } from "@/api/index.js";
import { mapActions, mapMutations, mapState } from 'vuex';
import popTableList from '../../../../base/popTableList/popTableList.vue';
export default {
	name: 'reservationInfo',
	components: { popTableList },
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		tableInfo: {
			type: Object,
			default: () => {
				return {
					sv_table_id: 0
				}
			}
		},
	},
	data() {
		return {
			notImg: base.frontImgBase + '/images/cashier/hebing@2x.png',
			currentMemberInfo: {                        // 详情会员数据
				member_id: null
			},
			popTableInfo: {},
			bookingId: null,
			popTableListStatus: false,                  // 房台列表弹窗
			popTableData: {
				title: '',
				dataType: 0
			},
			billableTimer: null,
			billabletimeInfo: {                         // 计费数据
				id: null,
				code: '',
				configNameId: '',                       // 匹配计费规则演算id
				configName: '',                         // 计费名称
				startTime: '',                          // 开始时间
				endTime: '',                            // 结束时间
				durationUpdateTime: '',                 // 时长更新时间
				duration: '',                           // 累积时长
				status: -1,                             // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
				statusString: '',                       // 计费状态
				totalMoney: 0,                          // 计费金额
				pauseDuration: null,                    // 有效暂停时长
				pauseTime: null,                        // 可暂停时长
				canPause: false,                        // 是否允许暂停
			},
			bookingInfo: {
				id: null,
			},
		}
	},
	computed: {
		...mapState(['userInfo', 'memberInfo', 'queryUpdateCartting']),
		...mapState('permission', ['CashierManage']),
		dialogVisible: {
			get() { return this.visible; }, set(value) {
				value = value === 'close' ? false : value;
				this.$emit('update:visible', value);
			}
		},
		store_logo() {
			let url = this.$app.isNull(this.userInfo.sv_store_logo) ? (base.frontImgBase + '/images/cashier/default_user_logo.png') : this.userInfo.sv_store_logo
			return this.$app.fmtImg(url)
		},
		// 0:空闲 1:已开台，待点餐 2:正在使用 3:待清桌 4:待接单 5:预结 6:预约 7:占用 8:维护 9:待预结
		hasStartOrder() {
			const stateList = [0];
			return this.$app.isNull(this.tableInfo.sv_table_using_state) ? false : stateList.includes(this.tableInfo.sv_table_using_state)
		},
	},
	watch: {
		dialogVisible: {
			handler(newVal, oldVal) {
				if (newVal) {
					this.popTableInfo = { ...this.tableInfo };
					this.currentMemberInfo = {
						member_id: null
					}
					this.getCateringModel();
					this.$nextTick(() => {
						!!this.$refs.reservationInfo && this.$refs.reservationInfo.focus();
					})
				} else {
					this.clearBillableTimer();
					this.clearMember();
				}
			}
		},
		'memberInfo.member_id': {
			handler(newVal, oldVal) {
				if (this.$app.isNull(this.currentMemberInfo.member_id)) {
					this.currentMemberInfo = JSON.parse(JSON.stringify(this.memberInfo));
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
		clearBillableTimer() {                                      // 清除计时费timer
			console.log('clear');
			clearTimeout(this.billableTimer);
			this.billableTimer = null;
			this.update({
				key: 'billabletimeInfo',
				data: {
					id: null,
					configNameId: '',
					configName: '',                         // 计费名称
					startTime: '',                          // 开始时间
					endTime: '',                            // 结束时间
					duration: '',                           // 累积时长
					status: -1,                             // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
					statusString: '',                       // 计费状态
					totalMoney: 0,                          // 计费金额
				}
			})
			this.billabletimeInfo = {                       // 计费数据
				id: null,
				code: '',
				configNameId: '',
				configName: '',                             // 计费名称
				startTime: '',                              // 开始时间
				endTime: '',                                // 结束时间
				durationUpdateTime: '',                     // 时长更新时间
				duration: '',                               // 累积时长
				status: -1,                                 // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
				statusString: '',                           // 计费状态
				totalMoney: 0,                              // 计费金额
				pauseDuration: null,                        // 有效暂停时长
				pauseTime: null,                            // 可暂停时长
				canPause: false,                            // 是否允许暂停
			}
		},
		pauseBillableTimer() {                                      // 暂停计时费timer
			console.log('pause');
			clearTimeout(this.billableTimer);
			this.billableTimer = null;
			this.billabletimeInfo.status = 2;
		},
		startBillableTimer() {
			if (this.billabletimeInfo.status === 1 || this.billabletimeInfo.status === 2) {
				console.log('billableTimeCycle');
				clearTimeout(this.billableTimer);
				this.billableTimer = null;
				const cycleTime = 60000;
				this.billableTimer = setTimeout(() => { this.getBillabletime() }, cycleTime)
			}
		},
		handleUpdateTable(val) {                                    // 0 换台 1 并台 2 移菜
			if (val.type === 1) {
				// 并台
				stockApi.mergeCateringTable({
					sv_source_type: 100,
					operateTableId: this.checkedItem.sv_table_id,
					mergeCateringTableIds: val.list
				}).then(res => {
					if (res) {
						this.popTableAndStatus = false;
						this.$message.success('操作成功');
						this.takeASingle();
						this.getCashierRegionTableInfo();
					}
				})
				return
			}
			stockApi.operateCateringTable({
				operateTableId: this.checkedItem.sv_table_id,
				changeOrFightCateringTableId: val.id,
				operateType: val.type === 0 ? 3 : 5
			}).then(res => {
				if (res) {
					// let printTableName = this.checkedItem.sv_table_name + '->' + val.name;
					this.popTableInfo.sv_table_id = val.id;
					this.popTableInfo.sv_table_name = val.name;
					this.popTableListStatus = false;
					this.$message.success('操作成功');
					this.getCashierRegionTableInfo();
					// this.takeASingle(() => {
					//     this.getKitchenPrinter(JSON.parse(JSON.stringify(this.orderData.productResults)), val.type === 0 ? 'change' : 'and', printTableName);
					//     this.handelFrontPrint(JSON.parse(JSON.stringify(this.orderData.productResults)), val.type === 0 ? 4 : 5);
					// });
				}
			});
		},
		handleFnItem(type, hasFn = true) {                          // 点击操作按钮
			if (!hasFn) return
			if (type === 'scheduleStatus') {
				// 预约
				this.$emit('submit', { type: 'scheduleStatus' })
				return
			}
			if (type === 'reservationList') {
				// 预约列表
				this.$emit('submit', { type: 'reservationList' })
				return
			}
			if (type === 'occupy') {
				// 占用
				return
			}
			if (type === 'maintenance') {
				// 维护
				return
			}
			if (type === 'changeTable') {
				this.popTableListStatus = true;
				this.popTableData = {
					tableId: this.popTableInfo.sv_table_id,
					tableName: this.popTableInfo.sv_table_name,
					title: '换台 - 选择房台',
					dataType: 0
				}
				return
			}
			if (type === 'mergeTable') {
				this.popTableAndStatus = true;
				this.popTableData = {
					tableId: this.popTableInfo.sv_table_id,
					tableName: this.popTableInfo.sv_table_name,
					title: '并台 - 选择房台',
					dataType: 1
				}
				return
			}
			if (type === 'kaideng') {
				// 开灯
				// if (!this.popTableInfo.sv_electric_id) return this.$message.warning('房台未配置电控开关')
				if (!this.popTableInfo.sv_switch) this.handleLightSwitch(this.tableInfo);
				return
			}
			if (type === 'guandeng') {
				// 关灯
				// if (!this.popTableInfo.sv_electric_id) return this.$message.warning('房台未配置电控开关')
				if (this.popTableInfo.sv_switch) this.handleLightSwitch(this.popTableInfo);
				return
			}
			if (type === 'selectGoods') {
				if (this.popTableInfo.sv_table_using_state === 0) {
					this.handleFnItem('startOrderStatus')
					return
				}
				this.dataJson.code = this.popTableInfo.sv_table_id;
				this.dataJson.sv_table_using_state = this.popTableInfo.sv_table_using_state;
				this.showCashier = true;
				return
			}
			if (type === 'editRemark') {
				this.$prompt('请输入备注内容', '备注', {
					inputPlaceholder: '请输入备注内容，限100个字',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPattern: /^.{0,100}$/,
					inputValue: this.popTableInfo.sv_remark || '',
					inputErrorMessage: '请输入备注内容，限100个字',
				}).then(({ value }) => {
					this.popTableInfo.sv_remark = value;
					this.updateTableInfo();
				}).catch(e => {

				});
				return
			}
			if (type === 'recharge') {
				this.$root.$emit('keyCode', 82);
				return
			}
		},
		updateTableInfo() {                                 // 修改人数和备注
			let query = {
				sv_type: 2,                                 // 1人数 2备注
				sv_table_id: this.tableInfo.sv_table_id,
				sv_person_num: this.tableInfo.sv_person_num,
				user_id: this.userInfo.user_id,
				sv_remark: this.tableInfo.sv_remark,
				sv_order_source: 0
			}
			stockApi.updatePersonNumRemark(query).then(res => {
				if (res) {
					return this.$message.success('备注成功')
				}
			});
		},
		handleUpdateTable(val) {                                    // 0 换台 1 并台 2 移菜
			if (val.type === 1) {
				// 并台
				stockApi.mergeCateringTable({
					sv_source_type: 100,
					operateTableId: this.tableInfo.sv_table_id,
					mergeCateringTableIds: val.list
				}).then(res => {
					if (res) {
						this.popTableAndStatus = false;
						this.$message.success('操作成功');
						this.takeASingle();
						this.getCashierRegionTableInfo();
					}
				})
				return
			}
			stockApi.operateCateringTable({
				operateTableId: this.tableInfo.sv_table_id,
				changeOrFightCateringTableId: val.id,
				operateType: val.type === 0 ? 3 : 5
			}).then(res => {
				if (res) {
					let printTableName = this.tableInfo.sv_table_name + '->' + val.name;
					this.tableInfo.sv_table_id = val.id;
					this.tableInfo.sv_table_name = val.name;
					this.popTableListStatus = false;
					this.$message.success('操作成功');
					this.getCashierRegionTableInfo();
					this.takeASingle(() => {
						this.getKitchenPrinter(JSON.parse(JSON.stringify(this.orderData.productResults)), val.type === 0 ? 'change' : 'and', printTableName);
						this.handelFrontPrint(JSON.parse(JSON.stringify(this.orderData.productResults)), val.type === 0 ? 4 : 5);
					});
				}
			});
		},
		handleClearTable() {
			this.$alert('是否结束服务？', '提示', {
				confirmButtonText: '确定',
				callback: action => {
					if (action === 'confirm') {
						let obj = { operateTableId: this.tableInfo.sv_table_id, operateType: 1, sv_table_using_state: 1 };
						stockApi.OperateCateringTableByOperateType(obj).then(res => {
							if (res || res === null) {
								this.$message.success('清台成功');
								this.closeDialog();
							}
						});
					}
				}
			});
		},
		async getCateringModel() {                                  // 获取房台基础信息
			await stockApi.getCateringModel({ tableId: this.tableInfo.sv_table_id }).then(res => {
				if (res) {
					this.billabletimeInfo.code = res.billabletime_code;
					this.bookingId = res.sv_booking_id;
				}
			});
			this.getBillabletime();
			this.getBookingById();
		},
		getBookingById() {                                          // 获取房台基础信息
			stockApi.getBookingById({ id: this.bookingId }).then(res => {
				if (res) {
					this.bookingInfo = res;
					this.requsetMemberInfo(res.member_id);
				}
			});
		},
		getBillabletime() {
			if (this.$app.isNull(this.billabletimeInfo.code)) return false
			stockApi.getBillabletime({ code: this.billabletimeInfo.code, dateTime: this.billabletimeInfo.sv_table_prekont_date }).then(res => {
				if (res) {
					this.billabletimeInfo = {
						id: res.id,
						code: res.code,
						configNameId: 'Billabletime-' + res.configId,
						configName: res.configName,
						startTime: res.startTime,
						endTime: '',
						duration: res.duration,
						durationString: res.durationString,
						durationUpdateTime: res.durationUpdateTime,
						status: res.status,                 // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
						statusString: res.statusString,
						totalMoney: res.totalMoney,
						pauseDuration: res.pauseDuration,
						pauseTime: res.pauseTime,
						canPause: res.pauseTime > 0
					}
					this.startBillableTimer();
				}
			});
		},
	}
};