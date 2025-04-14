import utils from '@/utils/utils';
export default {
    update(state, obj) {                            // 修改state的值
        state[obj.key] = obj.data;
    },
    updateUserInfo(state, data) {                   // 修改登录用户的基本信息
        state.userInfo = data;
    },
    updateCashmoney(state, data) {                  // 修改备用金状态
        state.userInfo.sv_cashmoney_state = data;
    },
    updateMessageno(state, data) {                  // 修改短信剩余数量
        state.userInfo.sv_uc_sysmessageno = data;
        let user_Info = utils.getLocalStorage('user_Info');
        user_Info.userconfig.sv_uc_sysmessageno = data;
        utils.setLocalStorage('user_Info', user_Info);
    },
    updateShowHelp(state, data) {                   // 修改帮助中心
        state.showHelp = data;
        utils.setCookie('showHelp', data);
    },
    updateCustomerForm(state, item) {               // 修改自定义表单内的请求数据
        state.customerForm[item.code] = item.value;
    },
    updateUserLocalData(state, obj) {               // 修改本地维护数据
        obj.user_id = state.userInfo.user_id;
        state.user_local_data = obj;
        utils.setCookie('User-Local-Data', JSON.stringify(state.user_local_data), 30);
    },
    updateOrderChangePrice(state, data) {
        state.carttingData.orderChangeMoney = data;
    },
    touchCarttingCursor(state) {
        state.carttingSearchCursor = false;
        setTimeout(() => {
            state.carttingSearchCursor = true;
        }, 50);
    },
    clearMember(state) {                            // 清除所选会员
        state.memberInfo = {
            member_id: null,
            sv_wallet_id: '',
            couponCountNumber: '',
            couponCountList: [],
            cardPackageList: []
        };
        state.userPoint = {                         // 会员积分配置
            switch: false,
            proportion: 0,
            maxValue: '',
            inputValue: ''
        };
        state.queryUpdateCartting = {
            couponRecordIds: null,
            point: null
        }
        let dataObj = JSON.parse(JSON.stringify(state.carttingData));
        if (dataObj.productResults.length > 0) {
            dataObj.productResults = dataObj.productResults.map((item, index) => {
                return {
                    ...item,
                    multCommissions: dataObj.calcDto ? dataObj.calcDto.buySteps[index].multCommissions : null,
                    productChangePrice: (item.isCurrentPrice || item.productId === 0) ? item.productChangePrice : null,
                    setmealId: null,
                    buyStepPromotion: null
                }
            });
            this.dispatch('updateCartting', dataObj);
        }
    },
    clearBillabletimeInfo(state) {                  // 清除计时费用
        state.billabletimeInfo = {
            id: null,
            configName: '',                                     // 计费名称
            startTime: '',                                      // 开始时间
            duration: '',                                       // 累积时长
            status: -1,                                         // -1:Stop,终止 0:Ready,未开始 1:Running,运行中 2:Pause,暂停
            statusString: '',                                   // 计费状态
            totalMoney: 0,                                      // 计费金额
        }
    },
    updateMemberSetting(state, data) {              // 修改会员设置项
        state.memberSetting = data;
    },
    clearOrderChangePrice(state) {                  // 清除整单改价
        state.carttingData.orderChangeMoney = null;
    },
    changeQueryUpdateCartting(state, data) {        // 修改待更新购物车的请求数据
        state.queryUpdateCartting = data;
    },
    updateCarttingGiveData(state, data) {           // 修改满送、加价购数据
        state.carttingGiveData = JSON.parse(JSON.stringify(data));
    },
    syncCarttingData(state, data) {                 // 同步购物车的值
        state.carttingData = data;
        state.carttingData.productResults = state.carttingData.productResults.map(e => {
            let tradePrice = utils.isNull(e.buyStepPromotion) ? null : (e.buyStepPromotion.type === 16 ? parseInt(e.buyStepPromotion.promotionId) : null);
            return {
                ...e,
                tradePrice: tradePrice,
                // barCode: (state.isUserArtNo && !utils.isNull(e.artNo)) ? e.artNo : e.barCode,
                actualNumber: e.number
            }
        })
        if (state.isOffline) {

        }
    },
    setGoodsMultCommissions(state, data) {          // 设置购物车提成人
        state.carttingData.productResults[data.index].multCommissions = data.list;
    },
    setCateringReturn(state, data) {                // 结算时前保存已退菜
        state.cateringReturn = data;
    },
    clearCartting(state, data = false) {            // 清空购物车，data用于结算成功是否清屏
        if (state.customerDisplayData.enable && !data) {
            utils.showCustomerDisplay(state.customerDisplayData.port, state.customerDisplayData.baud, 0, '');
        }
        state.carttingSelectedPos = -1;
        state.carttingData = {
            buyNumber: 0,
            couponMoney: null,
            dealMoney: 0,
            dealNumber: 0,
            givePromotions: [],
            orderCoupons: [],
            point: '',
            productResults: [],
            dealMoney: 0
        };
        // if (state.userInfo.sv_us_industrytype === 1 && state.selectedInfo.sv_table_id) this.dispatch('requestMemberCard', state.memberInfo.member_id);
    },
    clearSelectedInfo(state) {                       // 清除购物车已选数据
        state.selectedInfo = {
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
        }
    },
    updateJurisdictionObj(state, data) {             // 修改权限
        state.JurisdictionObj = data;
    },
    updateProductType(state, data) {                 // 修改商品模块
        state.ProductType = data;
    },
    updateProductListQuery(state, data) {            // 修改商品列表query实体
        state.queryProductList = data;
    },
    updateDefullProductQuery(state) {
        state.queryProductList = {
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
            product_type: -1,                     // 商品类型  -1全部，0标准，1多规格，2多单位，3服务商品，4包装组合，5计重，6计时
            page: 1,                              // 页码
            pagesize: 10,                         // 页数
            startOverdueDate: '',                 // 过期开始时间
            endOverdueDate: '',                   // 过期结束时间
            sv_notice_type: '',                   // 库存预警
        }
    },
    updateColorData(state, item) {                   // 追加颜色
        state.colorData = item;
    },
    updateLabelData(state, data) {                   // 商品列表选中后 跳转到标签打印页面的商品数据
        utils.setSession('labelData', data);
        state.labelData = data;
    },
    updatePurchaseData(state, data) {                // 商品列表选中后 跳转到新增采购页面，传递商品数据过去
        utils.setSession('PurchaseAddData', data);
    },
    updateStockChange(state, data) {                 // 商品列表选中后 跳转到新增库存调整页面，传递商品数据过去
        utils.setSession('StockChangeAddData', data);
    },
    updateProductQueryEntity(state, data) {          // 保存筛选条件、记录到缓存上
        utils.setSession('ProductQueryEntity', data);
        state.ProductQueryEntity = data;
    },
    decodeJurisdiction(state) {                      // 解析权限
        let userInfo = utils.getLocalStorage('user_Info');
        // 生活服务        cache_name_life_service // 娱乐KTV        cache_name_entertainment_kty // 宠物用品        cache_name_pet_supplies // 汽车服务        cache_name_auto_beauty // 办公文具        cache_name_office_stationery // 教育培训        cache_name_education_training // 棋牌茶楼        cache_name_coffee // 蛋糕烘焙        cache_name_cake_baking // 生鲜水果        cache_name_fresh_fruit // 推拿养生        cache_name_massage_regimen // 丽人美业        cache_name_cosmetology // 会员软件        cache_name_member_soft // 织纺行业        cache_name_textile_industry // 其它行业        cache_name_other_industry // 餐饮美食        cache_name_catering // 烟酒茶行        cache_name_tobacco_tea // 婚纱摄影        cache_name_wedding_photograph // 商家联盟        cache_name_merchant_alliance // 通用行业        cache_name_common // 旅游景区        cache_name_scenic_spot // 服装鞋帽        cache_name_clothing_and_shoes // 洗洁行业        cache_name_detergent_industry // 母婴用品        cache_name_maternal_supplies // 游乐场地        cache_name_pleasure_ground // 医药行业        cache_name_pharmaceutical_indu // 3C数码        cache_name_mobile_digital // 商超零售        cachae_name_supermarket
        let useArtNoList = ['cachae_name_supermarket', 'cache_name_clothing_and_shoes', 'cache_name_maternal_supplies'];
        state.isUserArtNo = userInfo.user_id === '65212326' ? false : useArtNoList.includes(userInfo.sv_uit_cache_name);
        // 解析权限
        let JurisdictionData = state.JurisdictionObj;
        let sp_grouping_id = 0;
        if (!utils.isNull(userInfo.samodel)) {
            let samodel = userInfo.samodel;
            sp_grouping_id = utils.isNull(userInfo.samodel.sp_grouping_id) ? 0 : userInfo.samodel.sp_grouping_id;
            if (!utils.isNull(samodel.sp_grouping_privilege)) {
                let item = JSON.parse(samodel.sp_grouping_privilege);
                let Member = utils.isNull(item.Member) ? {} : item.Member;                              // 会员权限
                let DataPermissions = utils.isNull(item.DataPermissions) ? {} : item.DataPermissions;   // 数据权限

                let FrontManage = utils.isNull(item.FrontManage) ? {} : item.FrontManage;               // 前台收银权限

                let Marketing = utils.isNull(item.Marketing) ? {} : item.Marketing;                     // 营销平台权限
                let CommodityManage = utils.isNull(item.CommodityManage) ? {} : item.CommodityManage;   // 商品权限
                let Analytics = utils.isNull(item.Analytics) ? {} : item.Analytics;                     // 智能分析权限
                let StockManage = utils.isNull(item.StockManage) ? {} : item.StockManage;               // 库存权限
                let DailyExp = utils.isNull(item.DailyExp) ? {} : item.DailyExp;                        // 支出录入权限
                let SystemManage = utils.isNull(item.SystemManage) ? {} : item.SystemManage;            // 系统设置


                /* 店铺概况 数据权限
                    Consolidated_Income - 综合收入  Individual_Consume - 散客消费  Member_Consume - 会员消费 OrderTransaction_Number - 成交笔数
                    Preferential_Amount - 优惠金额  Refund_Money - 退款  Sales_Analysis - 销售分析 Member_Analysis - 会员构成
                    Member_Consume_Ranking - 会员消费排行榜  Product_Sales_Ranking - 热销商品排行榜  Store_Performance - 店铺业绩 Staff_Sales_Ranking - 员工销售排行
                    Payment_Method_Sales - 支付方式  Expenditure_Analysis - 支出分析 Sales_Trend - 30天趋势
                */
                //#region 
                JurisdictionData.Consolidated_Income = utils.isNull(DataPermissions.Consolidated_Income) ? true : DataPermissions.Consolidated_Income;
                JurisdictionData.Individual_Consume = utils.isNull(DataPermissions.Individual_Consume) ? true : DataPermissions.Individual_Consume;
                JurisdictionData.Member_Consume = utils.isNull(DataPermissions.Member_Consume) ? true : DataPermissions.Member_Consume;
                JurisdictionData.OrderTransaction_Number = utils.isNull(DataPermissions.OrderTransaction_Number) ? true : DataPermissions.OrderTransaction_Number;
                JurisdictionData.Preferential_Amount = utils.isNull(DataPermissions.Preferential_Amount) ? true : DataPermissions.Preferential_Amount;
                JurisdictionData.Refund_Money = utils.isNull(DataPermissions.Refund_Money) ? true : DataPermissions.Refund_Money;
                JurisdictionData.Sales_Analysis = utils.isNull(DataPermissions.Sales_Analysis) ? true : DataPermissions.Sales_Analysis;
                JurisdictionData.Member_Analysis = utils.isNull(DataPermissions.Member_Analysis) ? true : DataPermissions.Member_Analysis;
                JurisdictionData.Member_Consume_Ranking = utils.isNull(DataPermissions.Member_Consume_Ranking) ? true : DataPermissions.Member_Consume_Ranking;
                JurisdictionData.Product_Sales_Ranking = utils.isNull(DataPermissions.Product_Sales_Ranking) ? true : DataPermissions.Product_Sales_Ranking;
                JurisdictionData.Sales_Trend = utils.isNull(DataPermissions.Sales_Trend) ? true : DataPermissions.Sales_Trend;
                JurisdictionData.Store_Performance = utils.isNull(DataPermissions.Store_Performance) ? true : DataPermissions.Store_Performance;
                JurisdictionData.Staff_Sales_Ranking = utils.isNull(DataPermissions.Staff_Sales_Ranking) ? true : DataPermissions.Staff_Sales_Ranking;
                JurisdictionData.Payment_Method_Sales = utils.isNull(DataPermissions.Payment_Method_Sales) ? true : DataPermissions.Payment_Method_Sales;
                JurisdictionData.Expenditure_Analysis = utils.isNull(DataPermissions.Expenditure_Analysis) ? true : DataPermissions.Expenditure_Analysis;
                //#endregion

                /* 店铺概况 数据权限
                    Cashlebtn - 结算  settleFunctionAll - 通用行业-收银功能总开关  key_change_price - 通用行业-改价 key_discount - 通用行业-折扣
                    settleFunctionAll_catering - 餐饮行业-收银功能总开关  key_change_price_catering - 餐饮行业-改价  key_discount_catering - 餐饮行业-折扣
                */
                //#region前台收银
                JurisdictionData.Cashlebtn = utils.isNull(FrontManage.Cashlebtn) ? true : FrontManage.Cashlebtn;

                JurisdictionData.settleFunctionAll = utils.isNull(FrontManage.settleFunctionAll) ? true : FrontManage.settleFunctionAll;
                JurisdictionData.key_change_price = utils.isNull(FrontManage.key_change_price) ? true : FrontManage.key_change_price;
                JurisdictionData.key_discount = utils.isNull(FrontManage.key_discount) ? true : FrontManage.key_discount;

                JurisdictionData.settleFunctionAll_catering = utils.isNull(FrontManage.settleFunctionAll_catering) ? true : FrontManage.settleFunctionAll_catering;
                JurisdictionData.key_change_price_catering = utils.isNull(FrontManage.key_change_price_catering) ? true : FrontManage.key_change_price_catering;
                JurisdictionData.key_discount_catering = utils.isNull(FrontManage.key_discount_catering) ? true : FrontManage.key_discount_catering;
                //#endregion

                /* 店铺概况 会员权限
                    AddMember - 新增会员  AddCommodity - 新增商品  CouponAdd - 创建优惠券
                    SMSMarketing - 短信营销  Reservationlist - 查询预约服务 CommodityPurchase - 采购进货
                */
                JurisdictionData.AddMember = utils.isNull(Member.AddMember) ? true : Member.AddMember;
                JurisdictionData.AddCommodity = utils.isNull(CommodityManage.AddCommodity) ? true : CommodityManage.AddCommodity;
                JurisdictionData.CouponAdd = utils.isNull(Marketing.CouponAdd) ? true : Marketing.CouponAdd;

                JurisdictionData.SMSMarketing = utils.isNull(Marketing.SMSMarketing) ? true : Marketing.SMSMarketing;
                JurisdictionData.Reservationlist = utils.isNull(Member.Reservationlist) ? true : Member.Reservationlist;
                JurisdictionData.CommodityPurchase = utils.isNull(StockManage.CommodityPurchase) ? true : StockManage.CommodityPurchase;

                // 新增会员权限
                // AddMember - 新增会员权限

                JurisdictionData.Member_Data = utils.isNull(DataPermissions.Member_Data) ? true : DataPermissions.Member_Data;
                JurisdictionData.AddMember = utils.isNull(Member.AddMember) ? true : Member.AddMember;

                //#region vip会员权限

                // 会员列表权限 
                // ImportMember - 导入权限 ExportMember - 导出权限 UpdateMember - 修改会员信息权限 Member_Details - 查看会员权限 DeleteMember - 删除会员权限
                // Member_Statistics_module - 会员统计模块  MobilePacket - 分组权限 LabelMember - 打标签权限 MemberReport - 挂失权限 CancelMemberReport-取消挂失权限
                // ChangingTheCard - 补卡权限 SetPassword- 修改密码权限 ResetPassword - 重置密码权限 SendMessage-发短信权限
                // MobilePhoneShow - 显示完整手机号权限 Repayment- 还款权限  MemberNameShow - 显示完整会员名称权限

                JurisdictionData.ImportMember = utils.isNull(Member.ImportMember) ? true : Member.ImportMember;
                JurisdictionData.ExportMember = utils.isNull(Member.ExportMember) ? true : Member.ExportMember;
                JurisdictionData.UpdateMember = utils.isNull(Member.UpdateMember) ? true : Member.UpdateMember;
                JurisdictionData.Member_Details = utils.isNull(Member.Member_Details) ? true : Member.Member_Details;
                JurisdictionData.DeleteMember = utils.isNull(Member.DeleteMember) ? true : Member.DeleteMember;
                JurisdictionData.Member_Statistics_module = utils.isNull(Member.Member_Statistics_module) ? true : Member.Member_Statistics_module;
                JurisdictionData.MobilePacket = utils.isNull(Member.MobilePacket) ? true : Member.MobilePacket;
                JurisdictionData.LabelMember = utils.isNull(Member.LabelMember) ? true : Member.LabelMember;
                JurisdictionData.MemberReport = utils.isNull(Member.MemberReport) ? true : Member.MemberReport;
                JurisdictionData.CancelMemberReport = utils.isNull(Member.CancelMemberReport) ? true : Member.CancelMemberReport;
                JurisdictionData.ChangingTheCard = utils.isNull(Member.ChangingTheCard) ? true : Member.ChangingTheCard;
                JurisdictionData.SetPassword = utils.isNull(Member.SetPassword) ? true : Member.SetPassword;
                JurisdictionData.ResetPassword = utils.isNull(Member.ResetPassword) ? true : Member.ResetPassword;
                JurisdictionData.SendMessage = utils.isNull(Member.SendMessage) ? true : Member.SendMessage;
                JurisdictionData.MemberNameShow = utils.isNull(Member.MemberNameShow) ? true : Member.MemberNameShow;
                JurisdictionData.MobilePhoneShow = utils.isNull(Member.MobilePhoneShow) ? true : Member.MobilePhoneShow;
                JurisdictionData.Member_Statistics_module = utils.isNull(Member.Member_Statistics_module) ? true : Member.Member_Statistics_module;
                JurisdictionData.Repayment = utils.isNull(Member.Repayment) ? true : Member.Repayment;

                // 会员充值权限
                // MemberRecharge - 充值权限  DeductMoney - 扣费权限  ReturnAmount - 退还权限 UpdateGiveMoney - 修改赠送金额权限 UpdateRechargeGiveMoney-修改充值金额

                JurisdictionData.MemberRecharge = utils.isNull(Member.MemberRecharge) ? true : Member.MemberRecharge;
                JurisdictionData.DeductMoney = utils.isNull(Member.DeductMoney) ? true : Member.DeductMoney;
                JurisdictionData.ReturnAmount = utils.isNull(Member.ReturnAmount) ? true : Member.ReturnAmount;
                JurisdictionData.UpdateRechargeGiveMoney = utils.isNull(Member.UpdateRechargeGiveMoney) ? true : Member.UpdateRechargeGiveMoney;
                JurisdictionData.UpdateGiveMoney = utils.isNull(Member.UpdateGiveMoney) ? true : Member.UpdateGiveMoney;
                JurisdictionData.Recharge_Data = utils.isNull(DataPermissions.Recharge_Data) ? true : DataPermissions.Recharge_Data;

                // 会员充次权限 
                // MembershipCard - 充次权限

                JurisdictionData.MembershipCard = utils.isNull(Member.MembershipCard) ? true : Member.MembershipCard;

                // 次卡管理权限 
                //  MembershipSetMealCard_Add - 新增次卡权限 MembershipSetMealCard_Update - 修改次卡权限 Card_LowerShelf - 下架次卡权限
                //  MoveEndDeduction - 移动端扣次权限 DelayedRechargeTime - 次卡项目延期权限

                JurisdictionData.MembershipSetMealCard_Add = utils.isNull(Member.MembershipSetMealCard_Add) ? true : Member.MembershipSetMealCard_Add;
                JurisdictionData.MembershipSetMealCard_Update = utils.isNull(Member.MembershipSetMealCard_Update) ? true : Member.MembershipSetMealCard_Update;
                JurisdictionData.Card_LowerShelf = utils.isNull(Member.Card_LowerShelf) ? true : Member.Card_LowerShelf;
                JurisdictionData.MoveEndDeduction = utils.isNull(Member.MoveEndDeduction) ? true : Member.MoveEndDeduction;
                JurisdictionData.DelayedRechargeTime = utils.isNull(Member.DelayedRechargeTime) ? true : Member.DelayedRechargeTime;

                //  积分管理权限 AmountChange
                //  IntegralZero - 积分清零权限 AddIntegra - 添加积分权限 DeteleIntegra - 扣除积分权限 GiftList - 礼品列表权限 AddGift - 添加礼品权限
                //  UpdateGift - 修改礼品权限 DeleteGift - 删除礼品权限 ExchangeGift - 兑换礼品权限 Record - 兑换记录权限

                JurisdictionData.AmountChange = utils.isNull(Member.AmountChange) ? true : Member.AmountChange;
                JurisdictionData.IntegralZero = utils.isNull(Member.IntegralZero) ? true : Member.IntegralZero;
                JurisdictionData.AddIntegra = utils.isNull(Member.AddIntegra) ? true : Member.AddIntegra;
                JurisdictionData.DeteleIntegra = utils.isNull(Member.DeteleIntegra) ? true : Member.DeteleIntegra;
                JurisdictionData.GiftList = utils.isNull(Member.GiftList) ? true : Member.GiftList;
                JurisdictionData.AddGift = utils.isNull(Member.AddGift) ? true : Member.AddGift;
                JurisdictionData.UpdateGift = utils.isNull(Member.UpdateGift) ? true : Member.UpdateGift;
                JurisdictionData.DeleteGift = utils.isNull(Member.DeleteGift) ? true : Member.DeleteGift;
                JurisdictionData.ExchangeGift = utils.isNull(Member.ExchangeGift) ? true : Member.ExchangeGift;
                JurisdictionData.Record = utils.isNull(Member.Record) ? true : Member.Record;
                //#endregion

                //#region 商品权限

                /* 商品列表权限
                      AddCommodity      - 新增商品权限  CommodityList   -   商品列表权限    CommodityList   -   商品分类权限
                      Commodity_Specification_management - 规格管理权限   Commodity_Unit_Management - 单位管理权限     Commodity_Brand_Management - 品牌管理权限
                      Commodity_Package_Combination - 包装组合（商品捆绑）权限  Commodity_Label_printing - 标签打印权限
                      CommodityDetails  - 商品详情权限  WholesalePrice - 商品详情批发价  ImportCommodity - 导入权限        ExportCommodity - 导出权限  UpdateCommodity - 修改权限
                      DeleteCommodity   - 删除权限      CommodityShelf  -   下架权限        BatchAdd        -   批量新增权限    CommodityTotalCostQuery -   查询商品总成本权限
                      GrossProfit_Rate  - 商品毛利 毛利率
                 */
                // JurisdictionData.AddCommodity = utils.isNull(CommodityManage.AddCommodity) ? true : CommodityManage.AddCommodity;
                JurisdictionData.CommodityList = utils.isNull(CommodityManage.CommodityList) ? true : CommodityManage.CommodityList;
                JurisdictionData.CommodityCategory = utils.isNull(CommodityManage.CommodityCategory) ? true : CommodityManage.CommodityCategory;
                JurisdictionData.Commodity_Specification_management = utils.isNull(CommodityManage.Commodity_Specification_management) ? true : CommodityManage.Commodity_Specification_management;
                JurisdictionData.Commodity_Unit_Management = utils.isNull(CommodityManage.Commodity_Unit_Management) ? true : CommodityManage.Commodity_Unit_Management;
                JurisdictionData.Commodity_Brand_Management = utils.isNull(CommodityManage.Commodity_Brand_Management) ? true : CommodityManage.Commodity_Brand_Management;
                JurisdictionData.Commodity_Package_Combination = utils.isNull(CommodityManage.Commodity_Package_Combination) ? true : CommodityManage.Commodity_Package_Combination;
                JurisdictionData.Commodity_Label_printing = utils.isNull(CommodityManage.Commodity_Label_printing) ? true : CommodityManage.Commodity_Label_printing;

                JurisdictionData.CommodityDetails = utils.isNull(CommodityManage.CommodityDetails) ? true : CommodityManage.CommodityDetails;
                JurisdictionData.WholesalePrice = utils.isNull(CommodityManage.WholesalePrice) ? true : CommodityManage.WholesalePrice;
                JurisdictionData.ImportCommodity = utils.isNull(CommodityManage.ImportCommodity) ? true : CommodityManage.ImportCommodity;
                JurisdictionData.ExportCommodity = utils.isNull(CommodityManage.ExportCommodity) ? true : CommodityManage.ExportCommodity;
                JurisdictionData.UpdateCommodity = utils.isNull(CommodityManage.UpdateCommodity) ? true : CommodityManage.UpdateCommodity;
                JurisdictionData.DeleteCommodity = utils.isNull(CommodityManage.DeleteCommodity) ? true : CommodityManage.DeleteCommodity;
                JurisdictionData.CommodityShelf = utils.isNull(CommodityManage.CommodityShelf) ? true : CommodityManage.CommodityShelf;
                JurisdictionData.BatchAdd = utils.isNull(CommodityManage.BatchAdd) ? true : CommodityManage.BatchAdd;
                JurisdictionData.CommodityTotalCostQuery = utils.isNull(CommodityManage.CommodityTotalCostQuery) ? true : CommodityManage.CommodityTotalCostQuery;
                JurisdictionData.GrossProfit_Rate = utils.isNull(CommodityManage.GrossProfit_Rate) ? true : CommodityManage.GrossProfit_Rate;

                /* 商品分类权限
                      AddCategory   -   新增分类权限    UpdateCategory  -   修改分类权限 DeleteCategory -   删除分类权限
                */
                JurisdictionData.AddCategory = utils.isNull(CommodityManage.AddCategory) ? true : CommodityManage.AddCategory;
                JurisdictionData.UpdateCategory = utils.isNull(CommodityManage.UpdateCategory) ? true : CommodityManage.UpdateCategory;
                JurisdictionData.DeleteCategory = utils.isNull(CommodityManage.DeleteCategory) ? true : CommodityManage.DeleteCategory;

                /* 商品价格权限
                      Sv_p_unitprice - 零售价 Sv_distributionprice - 配送价 Sv_purchaseprice - 进货价
                */
                JurisdictionData.Sv_p_unitprice = utils.isNull(CommodityManage.Sv_p_unitprice) ? true : CommodityManage.Sv_p_unitprice;
                JurisdictionData.Sv_distributionprice = utils.isNull(CommodityManage.Sv_distributionprice) ? true : CommodityManage.Sv_distributionprice;
                JurisdictionData.Sv_purchaseprice = utils.isNull(CommodityManage.Sv_purchaseprice) ? true : CommodityManage.Sv_purchaseprice;

                //#endregion

                /* 采购进货权限
                    PurchaseManage - 采购进货页面查看权限 CommodityPurchase - 商品采购权限
                    AddPurchase - 新增入货权限 PurchaseExport - 导出权限 PurchasePrint - 打印权限 PurchaseDetails - 查看详情权限 CopyAdd - 再次采购权限
                    procurementPriceTotal-采购单价与合计查看权限 ProcurementPriceEdit - 修改采购单价权限
                    ReplenishmentReminder - 补货提醒  RepaymentSettlement - 结算/还款记录   ReconciliationManag - 对账管理   ReconciliationManag_statement - 对账管理-采购结算单
                    SupplyRecord - 供应记录

                */
                JurisdictionData.PurchaseManage = utils.isNull(StockManage.PurchaseManage) ? true : StockManage.PurchaseManage;
                JurisdictionData.CommodityPurchase = utils.isNull(StockManage.CommodityPurchase) ? true : StockManage.CommodityPurchase;
                JurisdictionData.AddPurchase = utils.isNull(StockManage.AddPurchase) ? true : StockManage.AddPurchase;
                JurisdictionData.PurchaseExport = utils.isNull(StockManage.PurchaseExport) ? true : StockManage.PurchaseExport;
                JurisdictionData.PurchasePrint = utils.isNull(StockManage.PurchasePrint) ? true : StockManage.PurchasePrint;
                JurisdictionData.PurchaseDetails = utils.isNull(StockManage.PurchaseDetails) ? true : StockManage.PurchaseDetails;
                JurisdictionData.CopyAdd = utils.isNull(StockManage.CopyAdd) ? true : StockManage.CopyAdd;
                JurisdictionData.procurementPriceTotal = utils.isNull(StockManage.Procurement_Price_Total) ? true : StockManage.Procurement_Price_Total;
                JurisdictionData.ProcurementPriceEdit = utils.isNull(StockManage.Procurement_Price) ? true : StockManage.Procurement_Price;
                JurisdictionData.ReplenishmentReminder = utils.isNull(StockManage.ReplenishmentReminder) ? false : StockManage.ReplenishmentReminder;
                JurisdictionData.RepaymentSettlement = utils.isNull(StockManage.RepaymentSettlement) ? false : StockManage.RepaymentSettlement;
                JurisdictionData.ReconciliationManag = utils.isNull(StockManage.ReconciliationManag) ? false : StockManage.ReconciliationManag;
                JurisdictionData.ReconciliationManag_statement = utils.isNull(StockManage.ReconciliationManag_statement) ? false : StockManage.ReconciliationManag_statement;
                JurisdictionData.SupplyRecord = utils.isNull(StockManage.SupplyRecord) ? false : StockManage.SupplyRecord;

                /* 库存管理-出入库
                    OutStock-出库 InStock-入库 AddStock-新增入库 UpdateNumber-数量修改 DeleteProduct-删除商品
                */
                JurisdictionData.OutStock = utils.isNull(StockManage.OutStock) ? false : StockManage.OutStock;
                JurisdictionData.InStock = utils.isNull(StockManage.InStock) ? false : StockManage.InStock;
                JurisdictionData.AddStock = utils.isNull(StockManage.AddStock) ? false : StockManage.AddStock;
                JurisdictionData.UpdateNumber = utils.isNull(StockManage.UpdateNumber) ? false : StockManage.UpdateNumber;
                JurisdictionData.DeleteProduct = utils.isNull(StockManage.DeleteProduct) ? false : StockManage.DeleteProduct;

                JurisdictionData.Procurement_Price_Total = utils.isNull(StockManage.Procurement_Price_Total) ? true : StockManage.Procurement_Price_Total;
                JurisdictionData.Purchase_Addexamine = utils.isNull(StockManage.Purchase_Addexamine) ? true : StockManage.Purchase_Addexamine;

                /* 采购退货权限 
                    ReturnGoods - 查看商品退货页面权限 ReturnGoodsAdd - 新增权限 ReturnGoodsExamine - 审核权限 ReturnGoodsExport - 导出权限
                    ReturnGoodsPrint - 打印权限 ReturnGoodsDetails - 详情权限 ReturnGoods_Price - 修改单价权限 ReturnGoods_Price_Total-查看单价/合计权限
                */
                JurisdictionData.ReturnGoods = utils.isNull(StockManage.ReturnGoods) ? true : StockManage.ReturnGoods;
                JurisdictionData.ReturnGoodsAdd = utils.isNull(StockManage.ReturnGoodsAdd) ? true : StockManage.ReturnGoodsAdd;
                JurisdictionData.ReturnGoodsExamine = utils.isNull(StockManage.ReturnGoodsExamine) ? true : StockManage.ReturnGoodsExamine;
                JurisdictionData.ReturnGoodsExport = utils.isNull(StockManage.ReturnGoodsExport) ? true : StockManage.ReturnGoodsExport;
                JurisdictionData.ReturnGoodsPrint = utils.isNull(StockManage.ReturnGoodsPrint) ? true : StockManage.ReturnGoodsPrint;
                JurisdictionData.ReturnGoodsDetails = utils.isNull(StockManage.ReturnGoodsDetails) ? true : StockManage.ReturnGoodsDetails;
                JurisdictionData.ReturnGoods_Price = utils.isNull(StockManage.ReturnGoods_Price) ? true : StockManage.ReturnGoods_Price;
                JurisdictionData.ReturnGoods_Price_Total = utils.isNull(StockManage.ReturnGoods_Price_Total) ? true : StockManage.ReturnGoods_Price_Total;

                /* 补货提醒权限 
                   Replenishment_Reminder -补货提醒权限 Replenishment_Reminder_cancel -作废 Replenishment_Reminder_export -导出 
                   Replenishment_Reminder_replenishment -补货  Replenishment_Price -查看单价
               */
                JurisdictionData.Replenishment_Reminder = utils.isNull(StockManage.Replenishment_Reminder) ? true : StockManage.Replenishment_Reminder;
                JurisdictionData.Replenishment_Reminder_cancel = utils.isNull(StockManage.Replenishment_Reminder_cancel) ? true : StockManage.Replenishment_Reminder_cancel;
                JurisdictionData.Replenishment_Reminder_export = utils.isNull(StockManage.Replenishment_Reminder_export) ? true : StockManage.Replenishment_Reminder_export;
                JurisdictionData.Replenishment_Reminder_replenishment = utils.isNull(StockManage.Replenishment_Reminder_replenishment) ? true : StockManage.Replenishment_Reminder_replenishment;
                JurisdictionData.Replenishment_Price = utils.isNull(StockManage.Replenishment_Price) ? true : StockManage.Replenishment_Price;
                /* 商品调拨权限
                    StockAllocationList - 查看商品调拨页面权限  StockAllocation - 新增调拨权限  StockAllocationAuditing - 审核权限
                    StockAllocationPrint - 打印权限 StockAllocationExport - 导出权限  StockAllocationDetailedExport - 导出明细权限
                    StockAllocationRecord - 调拨记录权限  StockAllocation_Price_Total 查看单价合计权限
                */
                JurisdictionData.StockAllocationList = utils.isNull(StockManage.StockAllocationList) ? true : StockManage.StockAllocationList;
                JurisdictionData.StockAllocation = utils.isNull(StockManage.StockAllocation) ? true : StockManage.StockAllocation;
                JurisdictionData.StockAllocationAuditing = utils.isNull(StockManage.StockAllocationAuditing) ? true : StockManage.StockAllocationAuditing;
                JurisdictionData.StockAllocationPrint = utils.isNull(StockManage.StockAllocationPrint) ? true : StockManage.StockAllocationPrint;
                JurisdictionData.StockAllocationExport = utils.isNull(StockManage.StockAllocationExport) ? true : StockManage.StockAllocationExport;
                JurisdictionData.StockAllocationDetailedExport = utils.isNull(StockManage.StockAllocationDetailedExport) ? true : StockManage.StockAllocationDetailedExport;
                JurisdictionData.StockAllocationRecord = utils.isNull(StockManage.StockAllocationRecord) ? true : StockManage.StockAllocationRecord;
                JurisdictionData.StockAllocation_Price_Total = utils.isNull(StockManage.StockAllocation_Price_Total) ? true : StockManage.StockAllocation_Price_Total;

                /* 盘点批号 
                    BatchnumberN3-总开关,BatchnumberAdd-新增,BatchnumberExamine-审核,BatchNumberPriceTotal-查看单价/合计,BatchnumberZeroExamine-审核时未盘商品是否清零
                    Number_Examine-单次盘点审核
                */
                JurisdictionData.BatchnumberN3 = utils.isNull(StockManage.Batchnumber_N3) ? true : StockManage.Batchnumber_N3;
                JurisdictionData.BatchnumberAdd = utils.isNull(StockManage.Batchnumber_Add) ? true : StockManage.Batchnumber_Add;
                JurisdictionData.BatchnumberExamine = utils.isNull(StockManage.Batchnumber_Examine) ? true : StockManage.Batchnumber_Examine;
                JurisdictionData.BatchNumberPriceTotal = utils.isNull(StockManage.BatchNumber_Price_Total) ? true : StockManage.BatchNumber_Price_Total;
                JurisdictionData.BatchnumberZeroExamine = utils.isNull(StockManage.Batchnumber_Zero_Examine) ? true : StockManage.Batchnumber_Zero_Examine;
                JurisdictionData.Number_Examine = utils.isNull(StockManage.Number_Examine) ? true : StockManage.Number_Examine;

                /* 库存盘点 
                    InventorylistN3-总开关,InventorylistAdd-新增,InventoryCheckPriceTotal-查看单价/合计
                */
                JurisdictionData.InventorylistN3 = utils.isNull(StockManage.Inventorylist_N3) ? true : StockManage.Inventorylist_N3;
                JurisdictionData.InventorylistAdd = utils.isNull(StockManage.Inventorylist_Add) ? true : StockManage.Inventorylist_Add;
                JurisdictionData.InventoryCheckPriceTotal = utils.isNull(StockManage.Inventory_Check_Price_Total) ? true : StockManage.Inventory_Check_Price_Total;

                /* 盘点差异 
                    differencelistN3-总开关,DifferenceExport-导出明细,DifferencePriceTotal-查看单价/合计
                */
                JurisdictionData.differencelistN3 = utils.isNull(StockManage.differencelist_N3) ? true : StockManage.differencelist_N3;
                JurisdictionData.DifferenceExport = utils.isNull(StockManage.Difference_Export) ? true : StockManage.Difference_Export;
                JurisdictionData.DifferencePriceTotal = utils.isNull(StockManage.Difference_Price_Total) ? true : StockManage.Difference_Price_Total;

                /* 库存盘点 
                    Inventory-总开关,InventoryExport-导出,QuantityConfirm-数量确认,QuantityAdjusted-数量调整,InventoryRecord-盘点记录
                */
                JurisdictionData.Inventory = utils.isNull(StockManage.Inventory) ? true : StockManage.Inventory;
                JurisdictionData.InventoryExport = utils.isNull(StockManage.InventoryExport) ? true : StockManage.InventoryExport;
                JurisdictionData.QuantityConfirm = utils.isNull(StockManage.QuantityConfirm) ? true : StockManage.QuantityConfirm;
                JurisdictionData.QuantityAdjusted = utils.isNull(StockManage.QuantityAdjusted) ? true : StockManage.QuantityAdjusted;
                JurisdictionData.InventoryRecord = utils.isNull(StockManage.InventoryRecord) ? true : StockManage.InventoryRecord;

                /* 供应商管理 
                    SupplierManage-总开关,SupplierAdd-新增,SupplierUpdate-修改,SupplierDelete-删除
                */
                JurisdictionData.SupplierManage = utils.isNull(StockManage.SupplierManage) ? true : StockManage.SupplierManage;
                JurisdictionData.SupplierAdd = utils.isNull(StockManage.SupplierAdd) ? true : StockManage.SupplierAdd;
                JurisdictionData.SupplierUpdate = utils.isNull(StockManage.SupplierUpdate) ? true : StockManage.SupplierUpdate;
                JurisdictionData.SupplierDelete = utils.isNull(StockManage.SupplierDelete) ? true : StockManage.SupplierDelete;

                /* 仓库管理 
                    WarehouseManage-总开关,WarehouseAdd-编辑,WarehouseEnable-启用/暂停,WarehouseDelete-删除
                */
                JurisdictionData.WarehouseManage = utils.isNull(StockManage.WarehouseManage) ? true : StockManage.WarehouseManage;
                JurisdictionData.WarehouseAdd = utils.isNull(StockManage.WarehouseAdd) ? true : StockManage.WarehouseAdd;
                JurisdictionData.WarehouseEnable = utils.isNull(StockManage.WarehouseEnable) ? true : StockManage.WarehouseEnable;
                JurisdictionData.WarehouseDelete = utils.isNull(StockManage.WarehouseDelete) ? true : StockManage.WarehouseDelete;
                JurisdictionData.ViewInventory = utils.isNull(StockManage.ViewInventory) ? false : StockManage.ViewInventory;

                /* 库存调整 
                    ProductModifyStock_Detailed-总开关,AddProductModifyStock-新增,UpdateProductModifyStock-修改
                    ProductModifyStock_Auditing-审核,ProductModifyStock_Detele-删除
                    ProductModifyStock_Printing-导出打印,ProductModifyStock_Export-导出EXCEL,
                */
                let InventoryBusinessModel = utils.isNull(item.InventoryBusinessModel) ? {} : item.InventoryBusinessModel;
                JurisdictionData.ProductModifyStock_Detailed = utils.isNull(InventoryBusinessModel.ProductModifyStock_Detailed) ? true : InventoryBusinessModel.ProductModifyStock_Detailed;
                JurisdictionData.AddProductModifyStock = utils.isNull(InventoryBusinessModel.AddProductModifyStock) ? true : InventoryBusinessModel.AddProductModifyStock;
                JurisdictionData.UpdateProductModifyStock = utils.isNull(InventoryBusinessModel.UpdateProductModifyStock) ? true : InventoryBusinessModel.UpdateProductModifyStock;
                JurisdictionData.ProductModifyStock_Auditing = utils.isNull(InventoryBusinessModel.ProductModifyStock_Auditing) ? true : InventoryBusinessModel.ProductModifyStock_Auditing;
                JurisdictionData.ProductModifyStock_Detele = utils.isNull(InventoryBusinessModel.ProductModifyStock_Detele) ? true : InventoryBusinessModel.ProductModifyStock_Detele;
                JurisdictionData.ProductModifyStock_Printing = utils.isNull(InventoryBusinessModel.ProductModifyStock_Printing) ? true : InventoryBusinessModel.ProductModifyStock_Printing;
                JurisdictionData.ProductModifyStock_Export = utils.isNull(InventoryBusinessModel.ProductModifyStock_Export) ? true : InventoryBusinessModel.ProductModifyStock_Export;

                /* 库存调整 
                    Inventory_Query_List-库存查询,Inventory_Cost-成本价,
                */
                JurisdictionData.Inventory_Query_List = utils.isNull(InventoryBusinessModel.Inventory_Query_List) ? false : InventoryBusinessModel.Inventory_Query_List;
                JurisdictionData.Inventory_Cost = utils.isNull(InventoryBusinessModel.Inventory_Cost) ? false : InventoryBusinessModel.Inventory_Cost;

                /* 商品调价 
                    ProductModifyPrice_Detailed-总开关,AddProductModifyPrice-新增,UpdateProductModifyPrice-修改
                    ProductModifyPrice_Auditing-审核,ProductModifyPrice_Detele-删除
                    ProductModifyPrice_Printing-导出打印,ProductModifyPrice_Export-导出EXCEL,
                */
                JurisdictionData.ProductModifyPrice_Detailed = utils.isNull(InventoryBusinessModel.ProductModifyPrice_Detailed) ? true : InventoryBusinessModel.ProductModifyPrice_Detailed;
                JurisdictionData.AddProductModifyPrice = utils.isNull(InventoryBusinessModel.AddProductModifyPrice) ? true : InventoryBusinessModel.AddProductModifyPrice;
                JurisdictionData.UpdateProductModifyPrice = utils.isNull(InventoryBusinessModel.UpdateProductModifyPrice) ? true : InventoryBusinessModel.UpdateProductModifyPrice;
                JurisdictionData.ProductModifyPrice_Auditing = utils.isNull(InventoryBusinessModel.ProductModifyPrice_Auditing) ? true : InventoryBusinessModel.ProductModifyPrice_Auditing;
                JurisdictionData.ProductModifyPrice_Detele = utils.isNull(InventoryBusinessModel.ProductModifyPrice_Detele) ? true : InventoryBusinessModel.ProductModifyPrice_Detele;
                JurisdictionData.ProductModifyPrice_Printing = utils.isNull(InventoryBusinessModel.ProductModifyPrice_Printing) ? true : InventoryBusinessModel.ProductModifyPrice_Printing;
                JurisdictionData.ProductModifyPrice_Export = utils.isNull(InventoryBusinessModel.ProductModifyPrice_Export) ? true : InventoryBusinessModel.ProductModifyPrice_Export;

                /* 成本调整 
                    ProductCostPrice_Detailed-总开关,AddProductCostPrice-新增,UpdateProductCosPrice-修改
                    ProductCosPrice_Auditing-审核,ProductCosPrice_Detele-删除
                    ProductCosPrice_Printing-导出打印,ProductCosPrice_Export-导出EXCEL,
                */
                JurisdictionData.ProductCostPrice_Detailed = utils.isNull(InventoryBusinessModel.ProductCostPrice_Detailed) ? true : InventoryBusinessModel.ProductCostPrice_Detailed;
                JurisdictionData.AddProductCostPrice = utils.isNull(InventoryBusinessModel.AddProductCostPrice) ? true : InventoryBusinessModel.AddProductCostPrice;
                JurisdictionData.UpdateProductCosPrice = utils.isNull(InventoryBusinessModel.UpdateProductCosPrice) ? true : InventoryBusinessModel.UpdateProductCosPrice;
                JurisdictionData.ProductCosPrice_Auditing = utils.isNull(InventoryBusinessModel.ProductCosPrice_Auditing) ? true : InventoryBusinessModel.ProductCosPrice_Auditing;
                JurisdictionData.ProductCosPrice_Detele = utils.isNull(InventoryBusinessModel.ProductCosPrice_Detele) ? true : InventoryBusinessModel.ProductCosPrice_Detele;
                JurisdictionData.ProductCosPrice_Printing = utils.isNull(InventoryBusinessModel.ProductCosPrice_Printing) ? true : InventoryBusinessModel.ProductCosPrice_Printing;
                JurisdictionData.ProductCosPrice_Export = utils.isNull(InventoryBusinessModel.ProductCosPrice_Export) ? true : InventoryBusinessModel.ProductCosPrice_Export;

                /* 库存变动 
                    Inventory_change_List-总开关,
                */

                JurisdictionData.Inventory_change_List = utils.isNull(InventoryBusinessModel.Inventory_change_List) ? true : InventoryBusinessModel.Inventory_change_List;

                /* 货流权限 -  要货单权限
                    RequireList - 要货单列表权限  RequireAdd - 新增   RequireAuditing - 审核  RequireApproval - 审批  RequirePrinting - 导出/打印
                    RequireTermination - 终止   RequireUpdate - 修改  Require_Price - 修改单价  Require_Price_Total - 查看单价/合计  Require_Store - 是否允许切换发货门店
                */
                let Cargoflow = utils.isNull(item.CargoFlowManage) ? {} : item.CargoFlowManage;
                JurisdictionData.RequireList = utils.isNull(Cargoflow.RequireList) ? true : Cargoflow.RequireList;
                JurisdictionData.RequireAdd = utils.isNull(Cargoflow.RequireAdd) ? true : Cargoflow.RequireAdd;
                JurisdictionData.RequireAuditing = utils.isNull(Cargoflow.RequireAuditing) ? true : Cargoflow.RequireAuditing;
                JurisdictionData.RequireApproval = utils.isNull(Cargoflow.RequireApproval) ? true : Cargoflow.RequireApproval;
                JurisdictionData.RequirePrinting = utils.isNull(Cargoflow.RequirePrinting) ? true : Cargoflow.RequirePrinting;
                JurisdictionData.RequireTermination = utils.isNull(Cargoflow.RequireTermination) ? true : Cargoflow.RequireTermination;
                JurisdictionData.RequireUpdate = utils.isNull(Cargoflow.RequireUpdate) ? true : Cargoflow.RequireUpdate;
                JurisdictionData.Require_Price = utils.isNull(Cargoflow.Require_Price) ? true : Cargoflow.Require_Price;
                JurisdictionData.Require_Price_Total = utils.isNull(Cargoflow.Require_Price_Total) ? true : Cargoflow.Require_Price_Total;
                JurisdictionData.Require_Store = utils.isNull(Cargoflow.Require_Store) ? true : Cargoflow.Require_Store;

                /* 货流权限 -  直调单权限
                    DirectList - 直调单列表权限  DirectAdd - 新增   DirectAuditing - 审核  DirectApproval - 审批  DirectPrinting - 导出/打印
                    DirectTermination - 终止   DirectUpdate - 修改  Direct_Price - 修改单价  Direct_Price_Total - 查看单价/合计  Direct_Store - 是否允许切换调入门店
                */
                JurisdictionData.DirectList = utils.isNull(Cargoflow.DirectList) ? true : Cargoflow.DirectList;
                JurisdictionData.DirectAdd = utils.isNull(Cargoflow.DirectAdd) ? true : Cargoflow.DirectAdd;
                JurisdictionData.DirectAuditing = utils.isNull(Cargoflow.DirectAuditing) ? true : Cargoflow.DirectAuditing;
                JurisdictionData.DirectApproval = utils.isNull(Cargoflow.DirectApproval) ? true : Cargoflow.DirectApproval;
                JurisdictionData.DirectPrinting = utils.isNull(Cargoflow.DirectPrinting) ? true : Cargoflow.DirectPrinting;
                JurisdictionData.DirectTermination = utils.isNull(Cargoflow.DirectTermination) ? true : Cargoflow.DirectTermination;
                JurisdictionData.DirectUpdate = utils.isNull(Cargoflow.DirectUpdate) ? true : Cargoflow.DirectUpdate;
                JurisdictionData.Direct_Price = utils.isNull(Cargoflow.Direct_Price) ? true : Cargoflow.Direct_Price;
                JurisdictionData.Direct_Price_Total = utils.isNull(Cargoflow.Direct_Price_Total) ? true : Cargoflow.Direct_Price_Total;
                JurisdictionData.Direct_Store = utils.isNull(Cargoflow.Direct_Store) ? true : Cargoflow.Direct_Store;
                JurisdictionData.Direct_Out_Store = utils.isNull(Cargoflow.Direct_Out_Store) ? true : Cargoflow.Direct_Out_Store;

                /* 货流权限 -  差异单权限
                    Discrepancy_List - 差异单列表权限  DiscrepancyHasAuditing - 审核   DiscrepancyApproval - 审批  DiscrepancyExport_Pdf - 导出/打印
                    DiscrepancyRefuse - 终止   DiscrepancyRefuse_Price_Total - 查看单价/合计
                */
                JurisdictionData.Discrepancy_List = utils.isNull(Cargoflow.Discrepancy_List) ? true : Cargoflow.Discrepancy_List;
                JurisdictionData.DiscrepancyHasAuditing = utils.isNull(Cargoflow.DiscrepancyHasAuditing) ? true : Cargoflow.DiscrepancyHasAuditing;
                JurisdictionData.DiscrepancyApproval = utils.isNull(Cargoflow.DiscrepancyApproval) ? true : Cargoflow.DiscrepancyApproval;
                JurisdictionData.DiscrepancyExport_Pdf = utils.isNull(Cargoflow.DiscrepancyExport_Pdf) ? true : Cargoflow.DiscrepancyExport_Pdf;
                JurisdictionData.DiscrepancyRefuse = utils.isNull(Cargoflow.DiscrepancyRefuse) ? true : Cargoflow.DiscrepancyRefuse;
                JurisdictionData.DiscrepancyRefuse_Price_Total = utils.isNull(Cargoflow.DiscrepancyRefuse_Price_Total) ? true : Cargoflow.DiscrepancyRefuse_Price_Total;

                /* 货流权限 -  入库权限
                    Direct_Require_EnterList - 入库列表权限  Direct_Require_EnterAdd - 新增   EnterAuditing - 审核  EnterApproval - 审批  Direct_Require_EnterPrinting - 导出/打印
                    Direct_Require_EnterTermination - 终止   Direct_Require_EnterUpdate - 修改   Direct_Require_EnterPrice_Total- 查看单价/合计
                */
                JurisdictionData.Direct_Require_EnterList = utils.isNull(Cargoflow.Direct_Require_EnterList) ? true : Cargoflow.Direct_Require_EnterList;
                JurisdictionData.Direct_Require_EnterAdd = utils.isNull(Cargoflow.Direct_Require_EnterAdd) ? true : Cargoflow.Direct_Require_EnterAdd;
                JurisdictionData.EnterAuditing = utils.isNull(Cargoflow.EnterAuditing) ? true : Cargoflow.EnterAuditing;
                JurisdictionData.EnterApproval = utils.isNull(Cargoflow.EnterApproval) ? true : Cargoflow.EnterApproval;
                JurisdictionData.Direct_Require_EnterPrinting = utils.isNull(Cargoflow.Direct_Require_EnterPrinting) ? true : Cargoflow.Direct_Require_EnterPrinting;
                JurisdictionData.Direct_Require_EnterTermination = utils.isNull(Cargoflow.Direct_Require_EnterTermination) ? true : Cargoflow.Direct_Require_EnterTermination;
                JurisdictionData.Direct_Require_EnterUpdate = utils.isNull(Cargoflow.Direct_Require_EnterUpdate) ? true : Cargoflow.Direct_Require_EnterUpdate;
                JurisdictionData.Direct_Require_EnterPrice_Total = utils.isNull(Cargoflow.Direct_Require_EnterPrice_Total) ? true : Cargoflow.Direct_Require_EnterPrice_Total;

                /* 货流权限 -  出库权限
                    Direct_Require_OutList - 出库列表权限  Direct_Require_OutAdd - 新增   OutAuditing - 审核  OutApproval - 审批  Direct_Require_OutPrinting - 导出/打印
                    Direct_Require_OutTermination - 终止   Direct_Require_OutUpdate - 修改   Direct_Require_OutPrice - 修改单价  Direct_Require_OutPrice_Total - 查看单价/合计
                */
                JurisdictionData.Direct_Require_OutList = utils.isNull(Cargoflow.Direct_Require_OutList) ? true : Cargoflow.Direct_Require_OutList;
                JurisdictionData.Direct_Require_OutAdd = utils.isNull(Cargoflow.Direct_Require_OutAdd) ? true : Cargoflow.Direct_Require_OutAdd;
                JurisdictionData.OutAuditing = utils.isNull(Cargoflow.OutAuditing) ? true : Cargoflow.OutAuditing;
                JurisdictionData.OutApproval = utils.isNull(Cargoflow.OutApproval) ? true : Cargoflow.OutApproval;
                JurisdictionData.Direct_Require_OutPrinting = utils.isNull(Cargoflow.Direct_Require_OutPrinting) ? true : Cargoflow.Direct_Require_OutPrinting;
                JurisdictionData.Direct_Require_OutTermination = utils.isNull(Cargoflow.Direct_Require_OutTermination) ? true : Cargoflow.Direct_Require_OutTermination;
                JurisdictionData.Direct_Require_OutUpdate = utils.isNull(Cargoflow.Direct_Require_OutUpdate) ? true : Cargoflow.Direct_Require_OutUpdate;
                JurisdictionData.Direct_Require_OutPrice = utils.isNull(Cargoflow.Direct_Require_OutPrice) ? true : Cargoflow.Direct_Require_OutPrice;
                JurisdictionData.Direct_Require_OutPrice_Total = utils.isNull(Cargoflow.Direct_Require_OutPrice_Total) ? true : Cargoflow.Direct_Require_OutPrice_Total;

                /* 仓库调拨 
                    StockIntoOutInto - 拨入  StockIntoOutDialOut - 拨出   StockIntoOutPrint - 打印  StockIntoOut_Price_Total - 查看单价/合计
                */
                JurisdictionData.StockIntoOutInto = utils.isNull(StockManage.StockIntoOutInto) ? true : StockManage.StockIntoOutInto;
                JurisdictionData.StockIntoOutDialOut = utils.isNull(StockManage.StockIntoOutDialOut) ? true : StockManage.StockIntoOutDialOut;
                JurisdictionData.StockIntoOutPrint = utils.isNull(StockManage.StockIntoOutPrint) ? true : StockManage.StockIntoOutPrint;
                JurisdictionData.StockIntoOut_Price_Total = utils.isNull(StockManage.StockIntoOut_Price_Total) ? true : StockManage.StockIntoOut_Price_Total;

                /* 支出录入权限
                    ExpAdd - 支出录入  ExpInfo - 支出明细  ExpExport - 支出明细 导出 ExpUpdate - 支出明细 修改
                    ExpDelete - 支出明细 删除  ExpAnalysis - 支出分析 AddExpCategory - 支出分析 新增大类
                */
                //#region 
                JurisdictionData.ExpAdd = utils.isNull(DailyExp.ExpAdd) ? true : DailyExp.ExpAdd;
                JurisdictionData.ExpInfo = utils.isNull(DailyExp.ExpInfo) ? true : DailyExp.ExpInfo;
                JurisdictionData.ExpExport = utils.isNull(DailyExp.ExpExport) ? true : DailyExp.ExpExport;
                JurisdictionData.ExpUpdate = utils.isNull(DailyExp.ExpUpdate) ? true : DailyExp.ExpUpdate;
                JurisdictionData.ExpDelete = utils.isNull(DailyExp.ExpDelete) ? true : DailyExp.ExpDelete;
                JurisdictionData.ExpAnalysis = utils.isNull(DailyExp.ExpAnalysis) ? true : DailyExp.ExpAnalysis;
                JurisdictionData.AddExpCategory = utils.isNull(DailyExp.AddExpCategory) ? true : DailyExp.AddExpCategory;
                //#endregion

                /* 智能分析权限
               
                   SalesReport - 销售流水表    Sales_Profit_Summary - 毛利汇总报表   DailyBill - 每日对账单   PrintTheBill - 打印对账单   Query_DailyBill - 是否允许查看整店数据   
                   BusinessStatement - 营业报表
               
               */
                JurisdictionData.SalesReport = utils.isNull(Analytics.SalesReport) ? true : Analytics.SalesReport;
                JurisdictionData.Sales_Profit_Summary = utils.isNull(Analytics.Sales_Profit_Summary) ? true : Analytics.Sales_Profit_Summary;
                JurisdictionData.DailyBill = utils.isNull(Analytics.DailyBill) ? true : Analytics.DailyBill;
                JurisdictionData.PrintTheBill = utils.isNull(Analytics.PrintTheBill) ? true : Analytics.PrintTheBill;
                JurisdictionData.Query_DailyBill = utils.isNull(Analytics.Query_DailyBill) ? true : Analytics.Query_DailyBill;
                JurisdictionData.BusinessStatement = utils.isNull(Analytics.BusinessStatement) ? true : Analytics.BusinessStatement;
                /* 系统设置权限
                
                    ShopManage - 分店管理   StaffManage - 员工管理
                
                */
                JurisdictionData.ShopManage = utils.isNull(SystemManage.ShopManage) ? true : SystemManage.ShopManage;
                JurisdictionData.StaffManage = utils.isNull(SystemManage.StaffManage) ? true : SystemManage.StaffManage;
                JurisdictionData.Switch_Stores = utils.isNull(SystemManage.Switch_Stores) ? false : SystemManage.Switch_Stores;
                JurisdictionData.ProjectPercentageList = utils.isNull(SystemManage.ProjectPercentageList) ? true : SystemManage.ProjectPercentageList;
            }
        } else {
            for (let key in JurisdictionData) {
                JurisdictionData[key] = true;
            }
        }
        state.userInfo = {
            sv_update_spec_unitprice: userInfo.sv_update_spec_unitprice,
            versionId: userInfo.sv_versionid,                           // 版本id
            sv_versionname: userInfo.sv_versionname,                    // 版本名称
            versionexpiration: userInfo.sv_versionexpiration,
            sv_expire_days: userInfo.sv_expire_days,
            distributorId: userInfo.distributor_id,
            onecbuyversion: userInfo.onecbuyversion,
            /*↑ 概况页信息*/
            IsCargoFlow: userInfo.is_show_CargoFlow,                    // 单店货流
            isStore: userInfo.isStore,                                  // 是否分店
            is_AnyCardShow: userInfo.is_AnyCardShow,                    // 是否展示任意充次
            Switch_Stores: userInfo.isStore ? JurisdictionData.Switch_Stores : true,
            sv_cashmoney_state: userInfo.sv_cashmoney_state,
            userconfig: userInfo.userconfig,
            storeNumber: userInfo.storeNumber,                          // 分店数量
            user_id: userInfo.user_id,                                  // 用户Id
            dailyBill_QueryAll: userInfo.dailyBill_QueryAll,            // 展示营业日报-所有门店
            headQuartersid: userInfo.headQuartersid,                    // 总店Id
            sp_grouping_id,                                             // 岗位Id
            samodel: userInfo.samodel,
            sv_us_shortname: userInfo.sv_us_shortname,                  // 店铺简称
            sv_us_address: userInfo.sv_us_address,
            sv_store_logo: userInfo.sv_store_logo,                      // 店铺logo
            sv_us_phone: userInfo.sv_us_phone,                          // 店铺电话
            sv_ul_mobile: userInfo.sv_ul_mobile,                        // 联系电话
            sv_uit_cache_name: userInfo.sv_uit_cache_name,              // 行业类型code
            sv_uit_name: userInfo.sv_uit_name,                          // 行业名称
            sv_us_name: userInfo.sv_us_name,                            // 店铺名称
            sv_d_name: userInfo.sv_d_name,                              // 操作员名称
            sv_ul_name: userInfo.sv_ul_name,                            // 操作员名称
            sv_d_phone: userInfo.sv_d_phone,
            sv_d_mobile: userInfo.sv_d_mobile,
            sv_uc_sysmessageno: userInfo.sv_uc_sysmessageno,
            sv_menupermissions: utils.isNull(userInfo.sv_menupermissions) ? [] : JSON.parse(userInfo.sv_menupermissions),
            sp_salesclerkid: userInfo.sp_salesclerkid,
            sv_us_industrytype: userInfo.sv_us_industrytype,            // 行业id
            distributor_id: userInfo.distributor_id,                    // 用户类型 0-徳客
            // sv_us_industrytype: 27,            // 行业id
            goodsCode_charact: userInfo.sv_uit_cache_name !== 'cache_name_clothing_and_shoes' ? '商品条码' : '款号',
            goodsNumber_charact: userInfo.sv_uit_cache_name !== 'cache_name_clothing_and_shoes' ? '货号' : '商品条码',
            sv_branchrelation: userInfo.sv_branchrelation,
            dec_payment_method: userInfo.dec_payment_method,            // 支付方式配置
            dec_payment_config: utils.isNull(userInfo.dec_payment_config) ? {} : JSON.parse(userInfo.dec_payment_config),

            sv_business_model: userInfo.sv_business_model,//营业模式
        }
        // 获取抹零设置
        if (!utils.isNull(userInfo.userconfig)) {
            if (!utils.isNull(userInfo.userconfig.sv_uc_saletozeroset)) {
                let json = JSON.parse(userInfo.userconfig.sv_uc_saletozeroset);
                state.cashierJurisdiction.freeZeroSwitch = json.whether;
                state.cashierJurisdiction.freeZero = json.auto;
            }
        }
        // state.userInfo.sv_uit_cache_name = 'meiye';
        state.ProductType = 'ptTwo';
        const cache_name_obj = {
            ptOne: ['cache_name_clothing_and_shoes'],
            ptTwo: ['cachae_name_supermarket', 'cache_name_coffee', 'cache_name_detergent_industry', 'cache_name_tobacco_tea', 'cache_name_maternal_supplies', 'cache_name_auto_beauty', 'cache_name_pleasure_ground'],
            ptThree: ['cache_name_catering', 'cache_name_fresh_fruit', 'cache_name_cake_baking']
        }
        for (const key in cache_name_obj) {
            const item = cache_name_obj[key];
            if (item.includes(userInfo.sv_uit_cache_name)) {
                state.ProductType = key
            }
        }
        // if (userInfo.sv_uit_cache_name === 'cache_name_clothing_and_shoes') {
        //     return state.ProductType = 'ptOne'
        // } else if (userInfo.sv_uit_cache_name === 'cache_name_coffee') {
        //     return state.ProductType = 'ptTwo'
        // } else if (userInfo.sv_uit_cache_name === 'cache_name_catering' || userInfo.sv_uit_cache_name === 'cache_name_fresh_fruit') {         // cache_name_catering - 餐饮  cache_name_fresh_fruit - 生鲜  cache_name_coffee - 棋牌茶楼
        //     return state.ProductType = 'ptThree'
        // } else {
        //     return state.ProductType = 'ptTwo'
        // }
    },
    updateMaskEntity(state, data) {                  // 更新引导页次数
        state.maskEntity = data;
    },
}
