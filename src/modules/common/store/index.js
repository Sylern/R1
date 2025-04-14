import Vue from 'vue'
import Vuex from 'vuex'

import utils from '@/utils/utils';
import base from '@/api/base';

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

import permission from './modules/permission'

Vue.use(Vuex)

const state = {
    base: base,
    isOffline: false,                                       // 是否离线
    isOnAndroid: false,                                     // 安卓云后台
    showHelp: false,                                        // 展示帮助中心
    kfData: {
        headImg: '',
        name: '',
        mobile: '',
        kfWehcatImg: ''
    },
    pageNestingUrl: '',                                     // iframe 地址
    storeCenterUrl: '',                                     // iframe 门店地址
    isCefClient: false,                                     // 是否是cef客户端
    isReturnModel: false,                                   // 是否退货模式
    isUserArtNo: false,                                     // 是否使用货号代替barcode
    menuJson: [],
    userInfo: {                                         // 登录用户信息
        sv_update_spec_unitprice: 0,                        // 新增商品 规格 同步门店表头区分
        IsCargoFlow: false,                                 // 是否单店，暂时通过是否货流判断，false为单店
        sv_store_logo: '',                                  // 店铺logo
        sv_us_name: '',                                     // 店铺名称
        sv_us_shortname: '',                                // 店铺简称
        sv_us_address: '',                                  // 店铺地址
        sv_us_phone: '',                                    // 店铺电话
        sv_ul_mobile: '',                                   // 联系电话
        user_id: '',                                        // 用户Id
        dailyBill_QueryAll: false,
        headQuartersid: '',                                 // 总店Id
        sp_grouping_id: 0,                                  // 岗位id
        sv_d_phone: '',                                     // 代理商电话
        sv_d_mobile: '',                                    // 代理商手机
        distributor_id: '',                                 // 1-徳客商户 其他都不是徳客的商户
        sv_d_name: '',                                      // 登录人员-操作员
        sv_ul_name: '',                                     // 操作员
        sp_salesclerkid: 0,                                 // 0 - 店主  !=0 - 操作员
        sv_menupermissions: [],                             // 代理商全选 - 是否有充值短信权限
        sv_uit_name: '',                                    // 行业名称
        isStore: false,                                     // 是否分店
        Switch_Stores: false,                               // 不展示门店列表切换门店
        sv_cashmoney_state: false,                          // 展示备用金
        storeNumber: 0,                                     // 分店数量
        sv_uit_cache_name: '',                              // 行业类型code
        sv_us_industrytype: '',                             // 行业类型id
        goodsCode_charact: '商品条码',                       // 服装行业：商品条码显示款号
        goodsNumber_charact: '货号',                         // 服装行业：货号显示商品条码
        sv_branchrelation: -1,                              // 会员共享开关值
        dec_payment_method: null,                           // 支付方式配置
        dec_payment_config: {},                             // 支付配置
        versionId: '',                                      // 版本id
        versionexpiration: 0,                               // 到期时间
        sv_expire_days: 0,                                  // 剩余到期天数
        sv_versionname: '',                                 // 版本名称
        sv_business_model: 0,                               // 营业模式
    },
    settlementOrder: {                                      // 当天上一笔订单
        order_id: ''
    },
    feedbackCount: 0,
    cashierJurisdiction: {                              // 收银权限
        cashierModel: '-1',                                 // 收银模式
        freeZeroSwitch: false,                              // 是否开启抹零
        freeZero: null,                                     // 抹零设置
        SelectCommissionRequired: false,                    // 结账时是否必选导购员
        RechargeSelectCommissionRequired: false,            // 次卡购买、充值时是否必选导购员
        ZeroInventorySales: true,                           // 负库存销售
        succession: true,                                   // 交接班开关
        showCode: false,                                    // 是否显示条码
        Cashier_Number_Cumulation_enable: true,             // 加入购物车是否叠加
        printEnable: true,                                  // 小票机开关
        printSum: 1,                                        // 打印份数
        printName: '',                                      // 打印机配置名称
        cloundPrintId: 0,                                   // 云打印机id 非云打印为0
        printCloudType: 0,                                  // 云打印机类型1 非云打印为0
        opencashbox: true,                                  // 结算后开钱箱
        isComplexFont: false,                               // 是否繁体字
        PrintSet_guestorderprint: true,                     // 宾客单打印

        CashierVoiceEnable: true,                           // 前台收款语音
        OnlineOrderVoiceEnable: true,                       // 线上来单语音
    },
    printTotalList: [],                                     // 开启总单打印机数据
    takeASingleCale3: {                                     // 房台结算预结数据
        sv_isbeforehand: false,                                 // 是否预结
        tableId: null,
        member_id: '',
        sv_integral: 0,
        sv_coupon_record_ids: [],
        sv_employee_ids: '',
        sv_order_receivable: 0,
        sv_order_actual_money: 0
    },
    selectedInfo: {                                         // 购物车到结算保存的信息
        sv_order_list_id: null,
        sv_without_list_id: null,
        sv_table_id: null,
        sv_table_name: '',
        sv_person_num: '',
        preOrderMoney: 0,
        sv_table_using_state: null,
        sv_service_fee_json: [],
        sv_remark: '',
        wt_datetime: ''
    },
    billabletimeInfo: {
        id: null,
        configName: '',                                     // 计费名称
        startTime: '',                                      // 开始时间
        duration: '',                                       // 累积时长
        status: -1,                                         // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
        statusString: '',                                   // 计费状态
        totalMoney: 0,                                      // 计费金额
    },
    memberSetting: {                                        // 设置-会员设置
        isRechargeInitial: false,                           // 是否允许跨店充值
        isChangeIntegralInitial: false,                     // 是否允许跨店积分变更
        autoCardInitial: false,                             // 是否自动生成会员卡号
        keyCardInitial: false,                              // 是否允许手动输入会员卡卡号
        isMemberEdit: false,                                // 跨店编辑
        isMemberConsume: false,                             // 跨店消费
    },
    customerDisplayData: {                                  // 客显数据
        enable: false,
        port: '',
        baud: ''
    },
    JurisdictionObj: {                                      // 系统内的权限  默认为true  true-有 false-无
        AddCommodity: true,                                 // 新增商品权限       yes
        ImportCommodity: true,                              // 导入权限           yes
        ExportCommodity: true,                              // 导出权限           yes
        UpdateCommodity: true,                              // 修改权限           yes
        DeleteCommodity: true,                              // 删除权限           yes
        CommodityShelf: true,                               // 下架权限           yes
        BatchAdd: true,                                     // 批量新增权限       no
        CommodityTotalCostQuery: true,                      // 查询商品总成本权限  yes
        GrossProfit_Rate: false,                            // 商品毛利 毛利率

        AddCategory: true,                                  // 新增分类权限       yes
        UpdateCategory: true,                               // 修改分类权限       yes
        DeleteCategory: true,                               // 删除分类权限       yes

        Sv_p_unitprice: true,                               // 零售价                新增 和列表控制了  详情还未做
        Sv_distributionprice: true,                         // 配送价                新增 和列表控制了  详情还未做
        Sv_purchaseprice: true,                             // 进货价                新增 和列表控制了  详情还未做

        //#region前台收银
        Cashlebtn: true,                                // 结算

        settleFunctionAll: true,                        // 通用行业-收银功能总开关
        key_change_price: true,                         // 通用行业-改价
        key_discount: true,                             // 通用行业-折扣

        settleFunctionAll_catering: true,               // 餐饮行业-收银功能总开关
        key_change_price_catering: true,                // 餐饮行业-改价
        key_discount_catering: true,                    // 餐饮行业-折扣
        //#endregion

        //#region 店铺概况
        Consolidated_Income: true,                      // 综合收入
        Individual_Consume: true,                       // 散客消费
        Member_Consume: true,                           // 会员消费
        OrderTransaction_Number: true,                  // 成交笔数
        Preferential_Amount: true,                      // 优惠金额
        Refund_Money: true,                             // 退款
        Sales_Analysis: true,                           // 销售分析
        Store_Performance: true,                        // 店铺业绩
        Payment_Method_Sales: true,                     // 支付方式
        Staff_Sales_Ranking: true,                      // 员工销售排行
        Expenditure_Analysis: true,                     // 支出分析
        Member_Analysis: true,                          // 会员构成
        Member_Consume_Ranking: true,                   // 会员消费排行榜
        Product_Sales_Ranking: true,                    // 热销商品排行榜
        Sales_Trend: true,                              // 30天趋势
        //#endregion

        //#region 更多服务          // 这些已采用接口返回的数据
        // SpecialPrice_List: true,                        // 特价
        // SpecialPrice_List: true,                        // 拼团
        // Reduction_List: true,                           // 满减
        // Discount_List: true,                            // 折扣
        // Give_List: true,                                // 秒杀
        // Give_List: true,                                // 满送
        // Preferential_Amount: true,                      // 邀请有礼
        //#endregion

        //#region 常用功能
        AddMember: true,                                    // 新增会员
        CouponAdd: true,                                    // 创建优惠券
        SalesReport: true,                                  // 毛利汇总报表
        Sales_Profit_Summary: true,                         // 销售流水表
        DailyBill: true,                                    // 每日对账单                              
        PrintTheBill: true,                                 // 每日对账单 - 打印对账单
        Query_DailyBill: true,                              // 每日对账单 - 是否允许查看整店数据
        BusinessStatement: true,                            // 营业报表
        SMSMarketing: true,                                 // 短信营销
        Reservationlist: true,                              // 查询预约服务
        CommodityPurchase: true,                            // 采购进货
        //#endregion

        //#region 商品权限
        AddCommodity: true,                                 // 新增商品权限       yes
        CommodityList: true,                                // 商品列表权限       yes
        CommodityCategory: true,                            // 商品分类权限       yes
        Commodity_Specification_management: true,           // 规格管理权限
        Commodity_Unit_Management: true,                    // 单位管理权限
        Commodity_Brand_Management: true,                   // 品牌管理权限
        Commodity_Package_Combination: true,                // 包装组合（商品捆绑）权限
        Commodity_Label_printing: true,                     // 标签打印权限
        CommodityDetails: true,                             // 商品详情权限       yes
        WholesalePrice: true,                               // 商品详情批发价     yes
        ImportCommodity: true,                              // 导入权限           yes
        ExportCommodity: true,                              // 导出权限           yes
        UpdateCommodity: true,                              // 修改权限           yes
        DeleteCommodity: true,                              // 删除权限           yes
        CommodityShelf: true,                               // 下架权限           yes
        BatchAdd: true,                                     // 批量新增权限       no
        CommodityTotalCostQuery: true,                      // 查询商品总成本权限  yes
        GrossProfit_Rate: true,                             // 商品毛利 毛利率    

        AddCategory: true,                                  // 新增分类权限       yes
        UpdateCategory: true,                               // 修改分类权限       yes
        DeleteCategory: true,                               // 删除分类权限       yes

        Sv_p_unitprice: true,                               // 零售价                新增 和列表控制了  详情还未做
        Sv_distributionprice: true,                         // 配送价                新增 和列表控制了  详情还未做
        Sv_purchaseprice: true,                             // 进货价                新增 和列表控制了  详情还未做
        //#endregion 商品权限

        //#region 采购进货权限
        PurchaseManage: true,                             // 采购进货页面查看权限
        CommodityPurchase: true,                          // 商品采购权限
        AddPurchase: true,                                // 新增入货权限
        PurchaseExport: true,                             // 导出权限
        PurchasePrint: true,                              // 打印权限
        PurchaseDetails: true,                            // 查看详情权限
        CopyAdd: true,                                    // 再次采购权限
        procurementPriceTotal: true,                      // 查看采购单价与合计权限
        ProcurementPriceEdit: true,                       // 修改采购单价权限
        ReplenishmentReminder: true,                      // 补货提醒
        RepaymentSettlement: true,                        // 结算/还款记录
        ReconciliationManag: true,                        // 对账管理
        ReconciliationManag_statement: true,              // 对账管理-采购结算单
        SupplyRecord: true,                               // 供应记录
        Procurement_Price_Total: true,                    // 查看单价与合计权限
        Purchase_Addexamine: true,                        // 保存并审核
        //#endregion

        //#region 采购退货权限
        ReturnGoods: true,                                // 查看采购退货页面权限
        ReturnGoodsAdd: true,                             // 新增权限
        ReturnGoodsExamine: true,                         // 审核权限
        ReturnGoodsExport: true,                          // 导出权限
        ReturnGoodsPrint: true,                           // 打印权限
        ReturnGoodsDetails: true,                         // 查看详情权限
        ReturnGoods_Price: true,                          // 修改单价权限
        ReturnGoods_Price_Total: true,                    // 查看单价与合计权限
        //#endregion

        //#region 补货提醒权限
        Replenishment_Reminder: true,                     // 补货提醒权限
        Replenishment_Reminder_cancel: true,              // 作废
        Replenishment_Reminder_export: true,              // 导出
        Replenishment_Reminder_replenishment: true,       // 补货
        Replenishment_Price: true,                        // 查看单价
        //#endregion

        //#region 仓库调拨权限
        StockAllocationList: true,                        // 查看仓库调拨页面权限
        StockAllocation: true,                            // 新增调拨权限
        StockAllocationAuditing: true,                    // 审核权限
        StockAllocationPrint: true,                       // 打印权限
        StockAllocationExport: true,                      // 导出权限
        StockAllocationDetailedExport: true,              // 导出明细权限
        StockAllocationRecord: true,                      // 调拨记录权限
        StockAllocation_Price_Total: true,                // 查看单价合计权限
        //#endregion

        //#region 盘点批号权限
        BatchnumberN3: true,                              // 总开关
        BatchnumberAdd: true,                             // 新增
        BatchnumberExamine: true,                         // 审核权限
        BatchNumberPriceTotal: true,                      // 查看单价/合计
        BatchnumberZeroExamine: true,                     // -审核时未盘商品是否清零
        Number_Examine: true,                             // -单次盘点审核
        //#endregion

        //#region 库存盘点权限
        InventorylistN3: true,                            // 总开关
        InventorylistAdd: true,                           // 新增
        InventoryCheckPriceTotal: true,                   // 查看单价/合计
        //#endregion

        //#region 盘点差异权限
        differencelistN3: true,                           // 总开关
        DifferenceExport: true,                           // 导出明细
        DifferencePriceTotal: true,                       // 查看单价/合计
        //#endregion

        //#region 库存盘点权限
        Inventory: true,                                  // 总开关
        InventoryExport: true,                            // 导出
        QuantityConfirm: true,                            // 数量确认
        QuantityAdjusted: true,                           // 数量调整
        InventoryRecord: true,                            // 盘点记录
        //#endregion

        //#region 库存调整权限
        ProductModifyStock_Detailed: true,                // 总开关
        AddProductModifyStock: true,                      // 新增
        UpdateProductModifyStock: true,                   // 修改
        ProductModifyStock_Auditing: true,                // 审核
        ProductModifyStock_Detele: true,                  // 删除
        ProductModifyStock_Printing: true,                // 导出打印
        ProductModifyStock_Export: true,                  // 导出EXCEL
        //#endregion

        //#region 库存查询
        Inventory_Query_List: true,                       // 库存查询
        Inventory_Cost: true,                             // 成本单价
        //#endregion

        //#region 商品调价
        ProductModifyPrice_Detailed: true,                // 总开关
        AddProductModifyPrice: true,                      // 新增
        UpdateProductModifyPrice: true,                   // 修改
        ProductModifyPrice_Auditing: true,                // 审核
        ProductModifyPrice_Detele: true,                  // 删除
        ProductModifyPrice_Printing: true,                // 导出打印
        ProductModifyPrice_Export: true,                  // 导出EXCEL
        //#endregion

        //#region 成本调整
        ProductCostPrice_Detailed: true,                  // 总开关
        AddProductCostPrice: true,                        // 新增
        UpdateProductCosPrice: true,                      // 修改
        ProductCosPrice_Auditing: true,                   // 审核
        ProductCosPrice_Detele: true,                     // 删除
        ProductCosPrice_Printing: true,                   // 导出打印
        ProductCosPrice_Export: true,                     // 导出EXCEL
        //#endregion

        //#region 库存变动
        Inventory_change_List: true,                      // 总开关

        //#region 供应商管理
        SupplierManage: true,                             // 总开关
        SupplierAdd: true,                                // 新增
        SupplierUpdate: true,                             // 修改
        SupplierDelete: true,                             // 删除
        //#endregion

        //#region 仓库管理
        WarehouseManage: true,                            // 总开关
        WarehouseAdd: true,                               // 编辑
        WarehouseEnable: true,                            // 启用/暂停
        WarehouseDelete: true,                            // 删除
        ViewInventory: true,                              // 查看库存
        //#endregion

        //#region 要货单权限
        RequireList: true,                                // 要货单列表权限
        RequireAdd: true,                                 // 新增
        RequireAuditing: true,                            // 审核
        RequireApproval: true,                            // 审批
        RequirePrinting: true,                            // 导出/打印
        RequireTermination: true,                         // 终止
        RequireUpdate: true,                              // 修改
        Require_Price: true,                              // 修改单价
        Require_Price_Total: true,                        // 查看单价/合计
        Require_Store: true,                              // 是否允许切换发货门店
        //#endregion

        //#region 直调单权限
        DirectList: true,                                 // 要货单列表权限
        DirectAdd: true,                                  // 新增
        DirectAuditing: true,                             // 审核
        DirectApproval: true,                             // 审批
        DirectPrinting: true,                             // 导出/打印
        DirectTermination: true,                          // 终止
        DirectUpdate: true,                               // 修改
        Direct_Price: true,                               // 修改单价
        Direct_Price_Total: true,                         // 查看单价/合计
        Direct_Store: true,                               // 是否允许切换调入门店
        Direct_Out_Store: true,                          // 是否允许切换调出门店
        //#endregion

        //#region 差异单权限
        Discrepancy_List: true,                           // 要货单列表权限
        DiscrepancyHasAuditing: true,                     // 审核
        DiscrepancyApproval: true,                        // 审批
        DiscrepancyExport_Pdf: true,                      // 导出/打印
        DiscrepancyRefuse: true,                          // 终止
        DiscrepancyRefuse_Price_Total: true,              // 查看单价/合计
        //#endregion

        //#region 货流入库权限
        Direct_Require_EnterList: true,                   // 入库列表权限
        Direct_Require_EnterAdd: true,                    // 新增
        EnterAuditing: true,                              // 审核
        EnterApproval: true,                              // 审批
        Direct_Require_EnterPrinting: true,               // 导出/打印
        Direct_Require_EnterTermination: true,            // 终止
        Direct_Require_EnterUpdate: true,                 // 修改
        Direct_Require_EnterPrice_Total: true,            // 查看单价/合计
        //#endregion

        OutStock: true,                                   // 出库权限
        InStock: true,                                    // 入库权限
        AddStock: true,                                   // 新增入库权限
        UpdateNumber: true,                               // 修改入库数量
        DeleteProduct: true,                              // 删除商品

        //#region 货流出库权限
        Direct_Require_OutList: true,                     // 出库列表权限
        Direct_Require_OutAdd: true,                      // 新增
        OutAuditing: true,                                // 审核
        OutApproval: true,                                // 审批
        Direct_Require_OutPrinting: true,                 // 导出/打印
        Direct_Require_OutTermination: true,              // 终止
        Direct_Require_OutUpdate: true,                   // 修改
        Direct_Require_OutPrice: true,                    // 修改单价
        Direct_Require_OutPrice_Total: true,              // 查看单价/合计
        //#endregion

        //#region 仓库调拨
        StockIntoOutInto: true,                           // 拨入
        StockIntoOutDialOut: true,                        // 拨出
        StockIntoOutPrint: true,                          // 打印
        StockIntoOut_Price_Total: true,                   // 查看单价/合计
        //#endregion

        Sv_p_unitprice: true,                               // 零售价                新增 和列表控制了  详情还未做
        //#endregion 库存权限

        //#region 新增会员权限
        Member_Data: true,                              // 会员数据
        AddMember: true,                                // 新增权限
        UpdateMember: true,                             // 修改会员信息权限
        Member_Details: true,                           // 查看会员权限
        SalesReport: true,                              // 消费数据
        Recharge_Data: true,                            // 充值数据
        //#endregion

        //#region 会员列表权限
        ImportMember: true,                             // 导入权限
        ExportMember: true,                             // 导出权限
        DeleteMember: true,                             // 删除会员权限
        Member_Statistics_module: true,                 // 会员统计模块
        MobilePacket: true,                             // 分组权限
        LabelMember: true,                              // 打标签权限
        MemberReport: true,                             // 挂失权限
        CancelMemberReport: true,                       // 取消挂失权限
        ChangingTheCard: true,                          // 补卡权限
        SetPassword: true,                              // 修改密码权限
        ResetPassword: true,                            // 重置密码权限
        SendMessage: true,                              // 发短信权限
        MemberNameShow: true,                           // 显示完整会员名称权限
        MobilePhoneShow: true,                          // 显示完整手机号权限
        MbilePhoneMhow_Switch: false,                   // 打印显示完整手机号权限
        Repayment: true,                                // 还款权限
        settleFunctionAll_common: true,                 // 前台收银
        //#region 

        //#region 会员充值权限
        MemberRecharge: true,                           // 充值权限
        UpdateRechargeGiveMoney: true,                  // 修改充值金额
        UpdateGiveMoney: true,                          // 修改赠送金额
        DeductMoney: true,                              // 扣费权限
        ReturnAmount: true,                             // 退还权限
        //#endregion

        //#region 会员充次权限
        MembershipCard: true,                           // 充次权限
        //#endregion


        //#region 次卡管理权限
        MembershipSetMealCard_Add: true,                // 新增次卡权限
        MembershipSetMealCard_Update: true,             // 修改次卡权限
        Card_LowerShelf: true,                          // 下架次卡权限
        MoveEndDeduction: true,                         // 移动端扣次权限
        DelayedRechargeTime: true,                      // 次卡项目延期权限
        //#endregion

        //#region 积分管理权限
        AmountChange: true,                             // 积分
        IntegralZero: true,                             // 积分清零权限
        AddIntegra: true,                               // 添加积分权限
        DeteleIntegra: true,                            // 扣除积分权限
        GiftList: true,                                 // 礼品列表权限
        AddGift: true,                                  // 添加礼品权限
        UpdateGift: true,                               // 修改礼品权限
        DeleteGift: true,                               // 删除礼品权限
        ExchangeGift: true,                             // 兑换礼品权限
        Record: true,                                   // 兑换记录权限
        //#endregion

        //#region 营销平台
        RecommendGrant: true,                           // 发放优惠券
        //#endregion 会员权限

        //#region 支出录入
        ExpAdd: true,                                   // 支出录入
        ExpInfo: true,                                  // 支出明细
        ExpExport: true,                                // 支出明细 导出
        ExpUpdate: true,                                // 支出明细 修改
        ExpDelete: true,                                // 支出明细 删除
        ExpAnalysis: true,                              // 支出分析
        AddExpCategory: true,                           // 支出分析 新增大类
        //#endregion

        //#region 系统设置

        ShopManage: true,                               // 分店管理
        StaffManage: true,                              // 员工管理
        Switch_Stores: false,                           // 是否有门店权限
        ProjectPercentageList: true,                    // 项目提成

        //#endregion
    },
    customerForm: {                                         // 自定义项数据缓存起来
        memberOptions: [],                                  // 会员列表
        employeeOption: [],                                 // 员工列表
        groupOptions: [],                                   // 会员分组
        lvOptions: [],                                      // 会员等级
        cwOptions: [],                                      // 会员称谓

        supplierlist: [],                                     // 供应商数据
        unitlist: [],                                         // 单位数据
        brandlist: [],                                        // 品牌数据
        FabricList: [],                                       // 面料数据
        GenderList: [],                                       // 性别数据
        StyleList: [],                                        // 款号数据
        StandardList: [],                                     // 安全类别数据
        SeasonlList: [],                                      // 季节数据
        YearList: [],                                         // 年份数据
        BranchStorelist: [],                                  // 门店数据
        ExecutivestandardList: [],                            // 执行标准数据
    },
    pricingScaleData: {                             // 电子秤数据
        tare: '0.00',                                   // 皮重
        weight: '0.00',                                 // 净重
        unit_price: '',                                 // 单价
        total_price: '',                                // 总价
        isStabilize: false,                             // 是否稳定
    },
    user_local_data: {                              // 本地存储数据
        isPackageType: true,                            // 次卡模块，菜单类型 true 默认次卡套餐
        showStorage: true,                              // 展示商品库存
        goodsListShowType: '0',                         // 商品列表图片模式，0 小图 1 大图 2无图
        scaleSwitch: false,                             // 电子秤启用开关
        iconCheckList: [],                              // 勾选的功能按钮
        printQR: false,                                 // 打印QRcode
    },
    svWithoutListId: null,                          // 挂单id
    isLightMealModel: false,                        // 商户门店配置为轻餐
    isLightMeal: false,                             // 是否轻餐
    carttingCurrentPage: 1,                         // 当前商品页码
    carttingSelectedPos: -1,                        // 当前选中的商品
    carttingSearchCursor: false,                    // 触发购物车搜索光标
	isInCartting: false,							// 是否在购物车 及 已下单购物车状态
    carttingData: {                                 // 展示的下单数据
        buyNumber: 0,
        couponMoney: null,
        orderChangeMoney: null,
        lastOrderCouponMoney: null,
        dealMoney: 0,
        dealNumber: 0,
        orderPromotions: [],
        givePromotions: [],
        orderCoupons: [],
        productResults: []
    },
    carttingGiveData: [],                            // 购物满送 加价购数据
    cateringReturn: [],                              // 结算前保存的已退菜信息
    queryUpdateCartting: {                           // 待修改的购物车数据
        couponRecordIds: null,
        point: null
    },
    caleStep: 1,                                     // 当前演算步骤 1 购物车 2 满送 加价购 3 结算窗口
    isInShowCheckin: false,                          // 是否是在结算窗口 
    hasGoodsActivity: false,                         // 是否有满减加价购
    storeEmployeeList: [],                           // 美业岗位员工列表
    selectedEmployee: {},                            // 美业已选开单人
    memberList: [],
    memberInfo: {
        member_id: null,
        sv_wallet_id: '',
        couponCountNumber: '',                       // 优惠券数量
        couponCountList: [],                         // 优惠券列表
        cardPackageList: [],                         // 次卡列表
    },
    userPoint: {                                     // 会员积分配置
        switch: false,                                  // 是否开启
        proportion: 0,                                  // 比例
        maxValue: '',                                   // 可输入最大积分
        inputValue: ''
    },
    discountList: [                                  // 折扣列表
        {
            id: '01',
            label: ' 折扣1',
            value: 9.5
        },
        {
            id: '02',
            label: ' 折扣2',
            value: 9
        },
        {
            id: '03',
            label: ' 折扣3',
            value: 8.5
        },
        {
            id: '04',
            label: ' 折扣4',
            value: 8
        }
    ],

    printTemplate: {                                 // 打印模版
        changeData: {                                   // 换货小票
            templateId: '',
            industryIds: [],
            width: 58,
            ticketItemGroups: {},
            ticketItemGroups210: {}
        },
        salesData: {                                    // 销售小票
            templateId: '',
            industryIds: [],
            width: 58,
            ticketItemGroups: {},
            ticketItemGroups210: {}
        },
        returnsData: {                                  // 退货小票
            templateId: '',
            industryIds: [],
            width: 58,
            ticketItemGroups: {},
            ticketItemGroups210: {}
        }
    },

    colorData: [                                     // 商品规格颜色
        '白色', '灰色', '黑色', '红色', '黄色', '绿色', '蓝色', '紫色', '棕色', '花色', '透明色', '橙色', '金色', '银色', '肤色', '青绿色',
        '草绿色', '墨绿色', '藏青色', '大红色', '桃红色', '粉红色', '豆沙粉', '香芋紫', '玫红色', '淡黄色', '柠檬黄'
    ],
    ProductType: '',                                 // 显示的商品模块  ptOne - 服装 ptTwo - 零售 洗洁行业 烟酒茶行
    queryProductList: {
        name: '',                             // 模糊查询 支持编码/名称/货号查询
        shopId: '',                           // 店铺ID -1全部
        state: 0,                             // 商品状态
        classifyOne: [-1],                    // 一级分类
        classifyTow: [-1],                    // 二级分类
        stock: -2,                            // 库存
        min: '',
        max: '',
        dateTimeType: 0,                      // 入库时间
        startEndTime: [],
        start: '',
        end: '',
        year: '',                             // 年份
        season_ids: [-1],                     // 季节
        sv_suids: [-1],                       // 供应商
        brandId: [-1],                        // 品牌Id
        componentId: [-1],                    // 面料成分Id
        sv_recommend_type: -1,                // 是否推荐 -1 全部 0 推荐 1 未推荐
        product_type: -1,                     // 商品类型 -1 全部 0 标准 1 多规格 2 多单位 3 服务商品 4 包装组合 5 计重 6 计时
        sv_fixed_price_type: -1,              // 是否固价 -1 全部 0 非固价 1 固价
        page: 1,                              // 页码
        pagesize: 10,                         // 页数
        price_Sort: 0,                        // 零售价排序
        stock_Sort: 0,                        // 库存数排序
        startOverdueDate: '',                 // 过期开始时间
        endOverdueDate: '',                   // 过期结束时间
        sv_notice_type: '',                   // 库存预警
    },
    labelData: [],                                   // 商品列表选中后 跳转到标签打印页面的商品数据
    ProductQueryEntity: {},                          // 商品筛选条件
    memberListSendCoupon: [],                        // 发放优惠券选择的会员
    refreshRoom: false,                              // 是否刷新房台
    refreshReservation: null,                        // 用于页面监听-刷新预约列表
    masterSignalrStatus: false,                      // 是否是主机
    maskEntity: {                                    // 账号显示引导页数据
        id: -1,                                             // 主键ID
        count: 0                                            // 次数
    },
    //#region 互动营销
    interactionForm: {                               // 互动营销提交表单
        creater: '',                                    // 创建人
        title: '',                                      // 标题
        start_time: '',                                 // 开始时间
        end_time: '',                                   // 结束时间
        fictional_number: 0,                            // 虚构人数
        descripe: '',                                   // 描述
        // 奖项json
        prize_json: [{ prize_id: utils.uuid(6, 10), name: '', probability: 1, content: '', prize_num: 1, prize_tips: '', prize_content: '', prize_type: 0, prize_detail: '', prize_content_type: 0, prize_start_time: '', prize_end_time: '' }],
        share_images: '',                               // 分享图片
        share_content: '',                              // 分享内容
        display_participant_number: 1,                  // 是否显示人数 0不显示 1显示
        winning_times: 1,                               // 中奖次数
        participate_count: 1,                           // 参与次数
        information_mode: 1,                            // 填写联系信息 0 关闭 1参加前填写 2 参与后填写
        title_url: '',                                  // 标语图片url
        content_url: '',                                // 内容图片url
        rule_url: '',                                   // 规则图片url
        bg_url: '',                                     // 背景图片url
        type: 0,                                        // 0 转盘 1刮奖 2 摇一摇
        winning_image: '',                              // 中奖图片url
        lose_image: '',                                 // no中奖图片url
        ishavethreshold: 1,                             // 是否需要消费积分 0无门槛  1消耗积分
        partake_cost: 1,                                // 单次消耗积分
        back_ground: 'rgba(226, 36, 61, 1)',            // 大转盘颜色
        qrcode_url: "",                                  // 二维码url
        qrcode: "",                                      // 二维码base64
    },
    //#endregion
    isMvc: window.location.href.indexOf('vueview') >= 0,   // 是否包含vueView
}

const store = new Vuex.Store({
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    modules: {
        permission
    },
})
export default store
