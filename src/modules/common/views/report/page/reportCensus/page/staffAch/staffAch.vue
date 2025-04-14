<template>
	<main class="staffAch-Main">
		<div class="rep_query">
			<div class="rep_q_bottom">
				<div class="rep_qb_from">
					<div class="rep_qbf_item">
						<div class="rep_qbfi_name">门店：</div>
						<div class="rep_qbfi_label">
							<el-select v-model="queryEntity.ShopIds" placeholder="请选择">
								<el-option v-for="item in storeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div>
					</div>
					<div class="rep_qbf_item">
						<div class="rep_qbfi_name">员工：</div>
						<div class="rep_qbfi_label">
							<el-select v-model="queryEntity.EmployeeId" placeholder="请选择">
								<el-option v-for="item in staffList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div>
					</div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">商品分类：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.PtIdS" placeholder="请选择" @change="handleSearch">
                                <el-option v-for="item in classifyOneData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
                    </div>
				</div>
				<div class="rep_qb_from">
					<div class="rep_qbf_item">
						<div class="rep_qbfi_name">时间：</div>
						<date-time-picker :paramData="dateTime" @change="handleChangeTime"></date-time-picker>
					</div>
					<div class="rep_qbf_item">
						<el-button @click="handleEmpty" class="bottom" type="warning" plain>清空</el-button>
						<el-button @click="handleSearch" class="bottom" type="primary" plain>搜索</el-button>
						<el-button @click="handleDownload" class="bottom" type="success" plain>下载报表</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class="req_table">
			<div class="tableBox SheetTable">
				<gridManager :key="key" :option="gridOption" :callback="callback" ref="gridmanager"></gridManager>
			</div>
		</div>

		<el-dialog title="员工业绩提成" :visible.sync="dialogVisible" width="540px" class="system_dialog">
			<div class="achPopContent" v-if="currentTrial.employeeId">
				<div class="employeeInfo">
					<div class="employeeLogo">
						<template v-if="!$app.isNull(currentTrial.employeePhoto)">
							<el-popover placement="right" width="200">
								<img class="img" :src="imgBase + currentTrial.employeePhoto" width="60" height="60" />
								<img class="img" :src="imgBase + currentTrial.employeePhoto" slot="reference" />
							</el-popover>
						</template>
						<template v-else>
							<img class="img" :src="frontImgBase + '/images/cashier/default_user_logo.png'" />
						</template>
					</div>
					<div class="text">
						<div class="employeeName">{{ currentTrial.employeeName }}</div>
						<div>工号：{{ currentTrial.employeeNo }}</div>
					</div>
				</div>
				<div class="dataInfo">
					<div class="left">
						<div class="totalTitle">合计</div>
						<div class="contentWrap">
							<div class="lineText">
								<div class="key">总业绩</div>
								<div class="value">{{ currentTrial.total.totalSalesPerformance }}</div>
							</div>
							<div class="lineText">
								<div class="key">总提成</div>
								<div class="value">{{ currentTrial.total.totalCommission }}</div>
							</div>
							<div class="lineText">
								<div class="key">总客数</div>
								<div class="value">{{ currentTrial.total.totalOrderCount }}</div>
							</div>
							<div class="lineText">
								<div class="key">客单价</div>
								<div class="value">{{ currentTrial.total.avgOrderPrice }}</div>
							</div>
							<div class="lineText">
								<div class="key">指定客数</div>
								<div class="value">{{ currentTrial.total.totalAssignOrderCount }}</div>
							</div>
							<div class="lineText">
								<div class="key">指定率</div>
								<div class="value">{{ currentTrial.total.assignRate }}%</div>
							</div>
						</div>
					</div>
					<div class="right">
						<div class="infoWrap">
							<div class="infoTitle">服务项目</div>
							<div class="lineText">
								<div class="key">业绩</div>
								<div class="value">{{ currentTrial.serviceProduct.salesPerformance }}</div>
							</div>
							<div class="lineText">
								<div class="key">提成</div>
								<div class="value">{{ currentTrial.serviceProduct.commission }}</div>
							</div>
							<div class="lineText">
								<div class="key">服务个数</div>
								<div class="value">{{ currentTrial.serviceProduct.count }}</div>
							</div>
						</div>
						<div class="infoWrap">
							<div class="infoTitle">商品销售</div>
							<div class="lineText">
								<div class="key">业绩</div>
								<div class="value">{{ currentTrial.product.salesPerformance }}</div>
							</div>
							<div class="lineText">
								<div class="key">提成</div>
								<div class="value">{{ currentTrial.product.commission }}</div>
							</div>
							<div class="lineText">
								<div class="key">商品个数</div>
								<div class="value">{{ currentTrial.product.count }}</div>
							</div>
						</div>
						<div class="infoWrap">
							<div class="infoTitle">充值售卡</div>
							<div class="lineText">
								<div class="key">业绩</div>
								<div class="value">{{ currentTrial.card.salesPerformance }}</div>
							</div>
							<div class="lineText">
								<div class="key">提成</div>
								<div class="value">{{ currentTrial.card.commission }}</div>
							</div>
							<!-- <div class="lineText">
								<div class="key">开卡数</div>
								<div class="value">{{ currentTrial.card.count }}</div>
							</div> -->
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
	</main>
</template>

<style lang="scss" scoped>
@import './staffAch.scss';
</style>
<style lang="scss">
.staffAch-Main {
	[grid-manager] {
		width: auto;
	}
	.table-wrap.gridManagerTable {
		&.disable-line tr td,
		&.disable-line tr th {
			border-right-color: #ebeef5;
		}
		thead {
			tr {
				&:first-child {
					th {
						border-top: none;
					}
				}
				th {
					border-top: var(--gm-border);
					min-width: 100px;
					.th-wrap {
						padding: 6px;
					}
				}
				&:first-child {
					th:nth-child(2) {
						min-width: 110px;
					}
					th:nth-child(1) {
						min-width: 50px;
					}
				}
			}
		}
		.gm-ready {
			thead {
				tr:nth-child(2) {
					th {
						&:nth-child(1),
						&:nth-child(8),
						&:nth-child(12),
						&:nth-child(16) {
							min-width: 130px;
						}
					}
				}
			}
		}
	}
	.table-wrap {
		--gm-remind-icon-color: rgba(var(--main-theme-color), 1);
		.gm-remind-action {
			right: 4px;
			left: initial;
			.ra-icon {
				opacity: 1;
				cursor: pointer;
			}
		}

		tr {
			td {
				padding: 11px 6px;
				&:nth-child(1) {
					min-width: 50px;
				}
			}
		}
	}
}
</style>
<script src="./staffAch.js"></script>
