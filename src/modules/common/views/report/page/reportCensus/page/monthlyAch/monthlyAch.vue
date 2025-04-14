
<template>
    <main class="monthlyAch-Main">
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
                        <div class="rep_qbfi_name">时间：</div>
                        <div class="rep_qbfi_label">
                            <el-date-picker v-model="dateTime" type="year"></el-date-picker>
                        </div>
                    </div>
                    <div class="rep_qbf_item">
                        <div class="rep_qbfi_name">商品分类：</div>
                        <div class="rep_qbfi_label">
                            <el-select v-model="queryEntity.PtIdS" placeholder="请选择">
                                <el-option v-for="item in classifyOneData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </div>
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
                <gridManager :option="gridOption" :callback="callback" ref="gridmanager"></gridManager>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
@import './monthlyAch.scss';
</style>
<style lang="scss" >
.monthlyAch-Main {
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
				min-width: 80px;
				&:nth-child(1) {
					min-width: 50px;
				}
			}
		}
	}
}
</style>
<script src="./monthlyAch.js"></script>
