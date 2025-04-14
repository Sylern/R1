import customConfig from '@/utils/config/customConfig.js';
import base from '@/api/base';
import { stockApi } from "@/api/index.js";
import { mapState } from 'vuex';
import overviewCommon from './overViewCommon/overViewCommon.vue';
import overview from './overview/overview.vue';
import overviewFitness from './overviewFitness/overviewFitness.vue';
import playGroundData from './component/playGroundData/playGroundData.vue'

export default {
    components: { overviewCommon, overview, overviewFitness, playGroundData },
    data() {
        const isNewVersion = window.location.href.indexOf('ds.') > -1 || window.location.href.indexOf('soft.') > -1 || window.location.href.indexOf('8080') > -1;   // 判断是否新版框架
        return {
            expirationTips: false,              // 过期提醒
            versionId: -1,                      // 版本id
            onecbuyversion: false,              // 曾经是否购买
            storeData: {                        // 门店信息
                services_list: []
            },
            storesData: {                       // 店铺信息
                sv_store_logo: '',
            },
            kfData: {                           // 帮助中心客服数据
                headImg: '',
                name: '',
                mobile: '',
                kfWehcatImg: ''
            },

            //#region 右侧
            needDo: {                           // 待办事项
                birthdayNum: 0,                     // 库存预警数
                outOfStock: 0,                      // 库存预警数
                intoStorage: 0,                     // 待入库
                needUseNum: 0,                      // 待核销
                distribution: 0,                    // 待配送
                intoStorage: 0,                     // 待入库
                services: 0,                        // 待服务
                audit: 0,                           // 待审核
            },
            imgList: [],                        // 轮播图列表
            updataLog: [],                      // 更新日志
            imageUrl: '',                       // app 二维码
            showAll: false,                     // 客服弹框是否全部显示
            //#endregion

            imgUrl: base.imgUrl,                // 图片地址
            service: {                          // 右下加客服信息
                name: '',                           // 姓名
                mobile: '',                         // 手机号
                headerImg: '',                      // 头像
                wxImg: '',                          // 二维码
                sv_remark: '',                      // 内容
            },
            timer: '',                          // 定时器
            isShowOem: false,                   // 显示代理商电话
            isShowCash: false,                  // 显示输入备用金
            isOnFrontCashier: isNewVersion,     // 是否是前端收银
            isShowPayment: false,               // 显示支付办理弹窗
            salesclerkCash: '',                 // 备用金

            noteEntity: {                       // 短信信息
                sv_days_remaining: "",              // 剩余天数
                sv_id_renew: false,                 // 是否续费
                sv_sms_num: 0,                      // 短信数
                sv_usage_days: "",                  // 使用天数
                sv_utilization_rate: 0              // 使用率
            },

            showPlayGroundData: false,           //显示场地数据
            query: {
                InOutStatus: 2,    //null全部 2在场 1 离场
                BeginDate: "",        //开始时间
                EndDate: "",          //结束时间
                Page: 1,              //页码
                BarCode: "",          //票码
                userId: "",           //店铺id
                Size: 10,             //页量
            },
            playGroundDataList: [],
            playGroundTotal: 0
        }
    },
    computed: {
        ...mapState(['userInfo', 'feedbackCount', 'JurisdictionObj']),
        isNewModel() {               // 是否使用新版报表
            let list = [
                'cache_name_clothing_and_shoes',
                'cachae_name_supermarket',
                'cache_name_maternal_supplies',
                'cache_name_detergent_industry',
                'cache_name_tobacco_tea',
            ]
            let isInNew = list.indexOf(this.cache_industry) > -1;
            return isInNew
        },
        cache_industry() {
            return this.userInfo.sv_uit_cache_name
        },
        isNewVersion() {
            return window.location.href.indexOf('soft.') > -1 || window.location.href.indexOf('ds.') > -1 || window.location.href.indexOf('webstore.') > -1 || window.location.href.indexOf('8080') > -1
        },
        shwoRechargeBtn() {
            let hasSendsms = this.userInfo.sv_menupermissions.find(e => e.code === 'sendsms')
            return this.$app.isNull(hasSendsms) ? false : hasSendsms.enable
        },
        isEducation() {
            let industrytypeIncludes = [11]             // 11-艺培
            return industrytypeIncludes.includes(this.userInfo.sv_us_industrytype)
        },
        isFitness() {
            let industrytypeIncludes = [32, 69]         // 32-健身房 69-智慧场馆
            return industrytypeIncludes.includes(this.userInfo.sv_us_industrytype)
        },
        hasPcClient() {
            let value = true;
            for (const item in customConfig.hasPcClient) {
                if (window.location.href.indexOf(item) > -1) {
                    value = customConfig.hasPcClient[item]
                }
            }
            return value
        },
        hasHardware() {
            let value = true;
            for (const item in customConfig.hasHardware) {
                if (window.location.href.indexOf(item) > -1) {
                    value = customConfig.hasHardware[item]
                }
            }
            return value
        },
    },
    watch: {
        'saleData': {
            deep: true,
            handler: function (newVal, oldVal) {
                newVal && this.saleChart();
            }
        },
    },
    mounted() {
        if (this.userInfo.distributor_id !== 1) {
            this.getKfConfig();                                 // 获取客服信息
        }
        let value = base.frontImgBase + '/images/base/login/APP.png';
        for (const item in customConfig.loginQRcode) {
            if (window.location.href.indexOf(item) > -1) {
                value = customConfig.loginQRcode[item]
            }
        }
        this.imageUrl = this.$app.isNull(value) ? '' : (base.frontImgBase + value);
        this.init();

        document.querySelector('#situationScroll .el-scrollbar__wrap').addEventListener('scroll', this.showService);
        this.$root.$on('situationRefresh', this.init);
        // console.log(this.userInfo.distributor_id);
        // console.log(this.isNewVersion);
        this.GeUserBasicData();

    },
    beforeDestroy() {
        this.$root.$off('situationRefresh', this.init);
    },
    methods: {
        handleRefreshScroll() {
            this.$nextTick(() => {
                !!this.$refs.pageScroll && this.$refs.pageScroll.update();
            })
        },
        init() {                                                // 初始化数据
            this.storeData = {                        // 门店信息
                services_list: []
            };
            this.getStoreInfo();                                    // 店铺信息
            this.intoStorage();                                     // 待入库统计
            this.getUserCoutnt();                                   // 会员生日数
            this.needUse();                                         // 待核销
            setTimeout(() => {
                this.getUserPortrait();                                 // 获取客服信息
                this.getAgentConfig();                                  // 获取广告
            }, 3000);
            this.$root.$emit('overViewCommonRefresh');
            // 待服务
            this.userInfo.sv_uit_cache_name === 'cache_name_cosmetology' && this.getReservationlist();
            //场地数据
            if (this.userInfo.sv_uit_cache_name === 'cache_name_pleasure_ground' || this.userInfo.sv_uit_cache_name === 'cache_name_yoga_fitness') {
                const ymd = this.$app.currentTime(new Date(), "yyyy-MM-dd")
                this.query.BeginDate = `${ymd} 00:00:00`
                this.query.EndDate = `${ymd} 23:59:59`
                this.query.userId = this.userInfo.user_id
                this.getPlayGroundDate()
            }
        },
        updata(e, option) {                                     // 组件回调 更改组件显示状态
            this[option] = e;
        },

        //#region 跳转 下载
        handleMarketingTool() {                                     // 跳转到营销工具
            if (this.userInfo.distributor_id !== 1) return this.isShowOem = true;
            this.$router.push({ path: '/cashier/pageNesting', query: { iframeUrl: window.location.origin + '/vueview/onlinemall/index.html' } })

        },
        // handleToRenew() {                                       // 跳转到续费页面
        //     window.top.location.href = this.handleRenewUrl();
        // },
        handleRenewUrl() {                                      // 拼接续费页面地址
            if (this.isNewVersion) {
                this.$router.push({
                    path: '/renew/renewChooseEntry',
                    query: {
                        singleType: this.userInfo.buyshopnumber ? 'many' : 'odd'
                    }
                })
                return
            }
            window.top.location.href = '/Home/iframenestificat_N3?url=/vueview/promotion/index.html'
        },
        handleToSchool() {                                      // 跳转学院
            window.open(stockApi.getSchoolBase());
        },
        handleToDecerpcn() {                                    // 跳转到德客官网
            window.open('https://www.51deke.com');
        },
        handleChangeStore() {                                   // 切换门店
            this.$router.push({
                path: '/salesroom/switchStoresEntry'
            });
            // window.location.href = '/system/index.html#/salesroom/switchStoresEntry';
        },
        handleStoresCenter() {                                  // 管理账号->店铺中心
            this.$router.push({
                path: '/personalStores/storesCenter'
            });
            // window.location.href = '/system/index.html#/personalStores/storesCenter';
        },
        handleYes() {                                           // 退出登录
            this.$router.push({
                path: '/'
            });
        },
        handleCommonFunc(item) {
            if (this.$app.isNull(item.href)) return;
            if (this.isNewVersion) {
                this.$router.push({
                    path: item.href
                })
            } else {
                window.parent.location.href = item.href;
            }
        },
        handleToOtherModel(name, expired = true) {              // 常用功能跳转     expired-是否开通
            // 新增商品地址
            const addProduct = this.userInfo.sv_uit_cache_name === 'cache_name_catering' ? '/Product/addCateringProduct_N3' : this.isNewModel ? '/Home/iframenestificat_N3?url=/vueview/commodity/index.html?activeName=productEntryAdd' : ' /Product/Index_N3';         // /Product/Index_N3 /Product/addCateringProduct_N3
            let hrefs = {           // 跳转地址代理
                店铺中心: '/System/comsetpage_N3?url=/vueview/system/index.html#/personalStores/storesCenter',
                数据信息: '/Home/common_N3',                     // 大屏数据分析页面
                //#region 常用功能
                // 前台收银: '/Home/Index2_N3',
                新增会员: this.isNewVersion ? '/memberCenter/memberEntryAdd' : '/member/memberList_N3',
                会员列表: this.isNewVersion ? '/memberCenter/memberEntry' : '/member/memberList_N3',
                新增商品: addProduct,
                新增菜品: '/Product/addCateringProduct_N3',
                创建优惠券: '/Coupon/CouponManage_N3',
                销售流水报表: this.isNewModel ? '/Home/iframenestificat_N3?url=/vueview/rustructure/salesReport.html' : '/intelligent/Sellingwater_N3',
                要货管理: this.isNewModel ? '/Home/iframenestificat_N3?url=/vueview/inventory_business/index.html#/purchasePackage/purchase' : '/Cargoflow/RequireGoods_N3',
                短信营销: '/sms/sendsms_N3',
                小程序装修: '/MobileStore/defTemplate_N3',
                充值营销短信: '/Home/iframenestificat_N3?url=http://51.decerp.cc?user_id=' + this.userInfo.user_id,
                捆绑商品列表: '/Home/iframenestificat_N3?url=/vueview/commodity/index.html#/setMeal/tying',
                新增商品套餐: '/Home/iframenestificat_N3?url=/vueview/commodity/index.html#/setMeal/addSetMeal',
                查询预约服务: '/ProductReservation/Reservations2_N3',
                采购进货: this.isNewModel ? '/Home/iframenestificat_N3?url=/vueview/inventory_business/index.html?activeName=purchase' : '/repertory/Procurement_N3',
                //#endregion
                //#region 更多服务                
                特价: '/Promotional/Promotional_SpecialPrice_List_N3',
                拼团: '/UserModuleConfig/assemblelist_N3',
                满减: '/Promotional/Promotional_Reduction_List_N3',
                折扣: '/Promotional/Promotional_Discount_List_N3',
                秒杀: '/UserModuleConfig/seckilllist_N3',
                满送: '/Promotional/Promotional_Give_List_N3',
                邀请有礼: '/UserModuleConfig/Invitingconfiguration_N3',
                //#endregion
                //#region 待办事项
                待入库: this.isNewVersion ? '/cargoFlow/demandList' : '/Home/iframenestificat_N3?url=/vueview/inventory_business/index.html?activeName=demandList',
                库存预警: this.isNewVersion ? '/purchasePackage/purchase' : '/Home/iframenestificat_N3?url=/vueview/inventory_business/index.html?activeName=purchase',
                商品列表: this.isNewVersion ? '/product/productEntry' : '/Home/iframenestificat_N3?url=/vueview/commodity/index.html?activeName=productEntry',
                待核销: this.isNewVersion ? '' : '/Home/iframenestificat_N3?url=/vueview/onlineOrder/index.html',
                待服务: '/ProductReservation/Reservations2_N3',
                //#endregion
                立即开通: '/system/PaymentApplication_N3',
            }
            if (!expired) { return this.handleMarketingTool({ sv_is_opened: false }) };         // 没开通跳转购买页面或弹出代理商电话
            name && hrefs[name] && (this.isNewVersion ? this.$router.push({ path: hrefs[name] }) : window.top.location.href = hrefs[name]);
        },
        handlePayment() {

        },
        handleKeFu() {                                          // 跳转到德客人工客服
            if (this.userInfo.distributor_id !== 1) return;
            var l = (screen.availWidth - 800) / 2;
            var t = (screen.availHeight - 600) / 2;
            window.open('https://cschat-ccs.aliyun.com/index.htm?tntInstId=_2FpHZ1c&scene=SCE00009794#/', '人工客服', 'width=800,height=600,top=' + t + ',left=' + l + ',toolbar=no,menubar=no,location=no,status=yes')
        },
        handleTypeWin() {                                       // 下载德客软件
            if (this.userInfo.distributor_id === 1)
                this.$app.downloadUrl('https://www.decerp.cn/res/德客软件.exe');
            else
                this.$app.downloadUrl('https://school.mispos.cc/门店管理系统.zip');

        },
        //#endregion
        showService() {                                         // 展开客服
            if (this.showAll === true) return;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if (document.querySelector('#situationScroll .el-scrollbar__wrap').scrollTop > document.querySelector('#situationScroll').offsetHeight) {
                    this.showAll = true;
                }
            }, 300);
        },
        hideExpire() {
            this.$router.push({ path: '/' })
        },
        winTopDialog() {
            if (this.isNewVersion) return;
            let div = document.createElement('div');
            let dom = this.userInfo.distributor_id == 1 ?
                `<div>您的店铺服务已过期。现在订购可获得多种行业解决方案。立即订购</div><div onclick="(function(){window.location.href='${this.handleRenewUrl()}'})()" style="display:inline-block;margin-top:60px;width: 150px;text-align:center;line-height:35px;background:rgba(var(--main-theme-color), 1);;color: #fff;border-radius: 3px;cursor: pointer;">立即续费</div>`
                : `<div>您的店铺服务已过期。现在订购可获得多种行业解决方案。请及时联系：</div><div style="margin:20px 0 40px;color:#2b82fd;">${this.userInfo.sv_d_phone || ''}</div>`

            div.style = 'position:fixed;top: 0;left: 0;right: 0;bottom: 0;background: rgba(0,0,0,.4);z-index: 9999;';
            div.innerHTML =
                `<div style="position:absolute;top: 50%;left: 50%;transform:translate(-50%,-50%);width: 400px;padding:20px 20px;text-align: center;background:#fff;border-radius:10px;">
                    <div style="margin-bottom:60px">到期提醒</div>
                    ${dom}
                    <div class="renew_close" onclick="(function(){window.location.href='/Login'})()">
                        <span class="lf"></span>
                        <span class="rt"></span>
                    </div>
                    <style>
                        .renew_close{
                            position: absolute;
                            right: 0px;
                            top: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 28px;
                            height: 28px;
                            transform: translate(33px, 5px);
                            cursor: pointer;
                        }
                        .renew_close .lf{
                            position: absolute;
                            display: inline-block;
                            width: 25px;
                            height: 2px;
                            border-radius: 2px;
                            background:#fff;
                            transform: rotate(45deg);
                        }
                        .renew_close .rt{
                            position: absolute;
                            display: inline-block;
                            width: 25px;
                            height: 2px;
                            border-radius: 2px;
                            background:#fff;
                            transform: rotate(-45deg);
                        }
                    </style>
                </div>`;
            let dialogDiv = document.createElement('div');
            dialogDiv.style = 'position:absolute;top: 50%;left: 50%;transfrom:translate(-50%,-50%);';

            div.appendChild(dialogDiv)
            window.top.document.body.appendChild(div);
        },

        getStoreInfo() {                                        // 获取店铺信息
            !!window.injectedObject && window.injectedObject.dismissLoading();
            // basicApi.islogin().then(res => {
            //     if (res) {
            //         this.versionId = res.sv_versionid;
            //         this.onecbuyversion = res.onecbuyversion;
            //     }
            // })
            this.versionId = this.userInfo.sv_versionid;
            this.onecbuyversion = this.userInfo.onecbuyversion;

            basicApi.getStoreInfo().then(res => {
                if (res) {
                    res.isTrial = res.sv_versionid_name.indexOf('试用版') > -1;                  // 判断是否试用版本
                    res.hasEnd = !/.*[\u4e00-\u9fa5]+.*$/.test(res.sv_versionexpiration);       // 到期事件是否有中文
                    res.sv_versionid_name = res.sv_versionid_name.split('/')[0];                // 版本不要年限
                    // 到期日期
                    res.endTime = !res.hasEnd ? res.sv_versionexpiration : this.$app.currentTime(new Date(Date.parse(new Date()) + res.sv_versionexpiration * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
                    this.storeData = res;
                    this.expirationTips = this.storeData.sv_versionexpiration < 16 && this.storeData.sv_versionexpiration > 0;
                    if (res.sv_versionexpiration <= 0) {
                        this.winTopDialog();
                    }
                }
            });
        },
        getKfConfig() {                                         // 获取客服信息
            basicApi.getKfConfig().then(res => {
                if (res) {
                    let kfInfo = this.$app.isNull(res.sv_agent_custom_config) ? '' : res.sv_agent_custom_config.find(e => e.type == 4);
                    this.kfData.kfWehcatImg = this.$app.isNull(res.sv_agent_custom_config) ? '' : res.sv_agent_custom_config.find(e => e.type == 5).img;
                    this.kfData.headImg = this.$app.isNull(kfInfo) ? '' : kfInfo.img;
                    if (this.$app.isNull(res.sv_d_user_name) && !this.$app.isNull(kfInfo) && !this.$app.isNull(kfInfo.data)) {
                        this.kfData.name = kfInfo.data[0].data;
                        this.kfData.mobile = kfInfo.data[1].data;
                    } else {
                        this.kfData.name = res.sv_d_user_name;
                        this.kfData.mobile = res.sv_d_user_mobile;
                    }
                }
            });
        },
        getMessageBoxList() {                                   // 更新日志
            basicApi.getMessageBoxList({ messageType: 5, pageIndex: 1, pageSize: 5 }).then(res => {
                if (res) {
                    this.updataLog = res.values ? [] : res.values;
                }
            })
        },
        intoStorage() {                                         // 待入库
            // 货流入库
            stockApi.getPurchasereturnApprovallist({ sv_source_id: -1, target_id: -1 }).then(res => {
                if (res) {
                    this.needDo.intoStorage += res.total;
                }
            })
            // 调拨入库
            stockApi.getStockAllocationlist({ "id": -1, "u_id": -1, "keywards": "", "str_state": "3,4", "is_multiple_state": true, "start_date": "", "end_date": "", "page": 1, "pagesize": 10 }).then(res => {
                if (res) {
                    this.needDo.intoStorage += res.total;
                }
            })
            // 采购入库
            stockApi.postProcurement_supplier_list({ id: -1, state1: -1, keywards: '', supp_id: -1, str_state: '3,4', is_multiple_state: true, creator_by: -1, reviewer_by: -1, start_date: '', end_date: '', page: 1, pagesize: 10 }).then(res => {
                if (res) {
                    this.needDo.intoStorage += res.total;
                }
            })
        },
        needUse(n) {                                            // 待核销
            let [startdate, enddate] = this.$app.currentTimeFrame(0);       // 默认时间为今天
            let queryData = { page: 1, pagesize: 10, startdate, enddate, activity_type: -1, payment_type: -1, payment_status: -1, shipping_methods: -1, deliverystatus: -4, keywards: '' }
            // 待核销
            stockApi.getOnlineOrderInfo(queryData).then(res => {
                if (res) {
                    this.needDo.needUseNum = res.total;
                }
            });
            // 待配送
            stockApi.getOnlineOrderInfo({ ...queryData, deliverystatus: 0 }).then(res => {
                if (res) {
                    this.needDo.distribution += res.total;
                }
            });
        },
        getsv_product_replenishment() {                         // 库存预警
            stockApi.getsv_product_replenishment({ is_cunt: true }).then(res => {
                if (res) {
                    this.needDo.outOfStock = res.total;
                }
            });
        },
        getUserCoutnt() {                                       // 会员生日
            stockApi.getUserCoutnt({ allStore: 0 }).then(res => {
                if (res) {
                    this.needDo.birthdayNum = res.bircount || 0;
                }
            });
            // stockApi.getMemeberFilters().then(res => {            // 获取备用金配置
            //     if (res) {
            //         this.isShowCash = res.sv_store_cashmoney_enable && this.isOnFrontCashier;
            //     }
            // });
        },
        getReservationlist() {                                  // 待服务
            basicApi.getReservationlist({ state: 1, pageIndex: 1, pageSize: 10, type: 1 }).then(res => {
                if (res) {
                    this.needDo.services = res.total || 0;
                }
            });
        },
        getUserPortrait() {                                     // 获取客服信息
            basicApi.getUserPortrait({ sv_openshop_person: this.userInfo.sv_openshop_person }).then(res => {
                if (res) {
                    this.service = {
                        name: res.name,
                        mobile: res.mobile,
                        headerImg: res.portrait_img,
                        wxImg: res.wx_img,
                        sv_remark: res.sv_remark
                    }
                }
            })
        },
        getAgentConfig() {                                      // 获取广告
            basicApi.getAgentConfig().then(res => {
                if (res && !this.$app.isNull(res[3])) {
                    if (res[3].img && res[3].data[0].is_enable) {
                        let obj = {
                            url: res[3].data[0].data,
                            img: res[3].img
                        }
                        this.imgList.push(obj);
                    }
                    if (!this.$app.isNull(res[4]) && res[4].img && res[4].data[0].is_enable) {
                        let obj = {
                            url: res[4].data[0].data,
                            img: res[4].img
                        }
                        this.imgList.push(obj);
                    }
                }
            })
        },
        getPlayGroundDate() {                                //获取场地数据
            stockApi.ConsumeInfos(this.query).then(res => {
                const { total, datas, } = res
                this.playGroundDataList = datas || []
                this.playGroundTotal = total || 0
            })
        },
        setSalesclerkCash() {                                   // 设置备用金
            if (this.$app.isNull(this.salesclerkCash)) { return this.$message.error('请输入备用金') }
            basicApi.setSalesclerkCash(this.salesclerkCash).then(res => {
                this.$message.success('保存成功');
                this.isShowCash = false;
            })
        },
        handleOpen(url) {                                       // 打开新窗口
            window.open(url)
        },
        handleShowFeedback() {
            this.$root.$emit('feedbackMessage');
        },
        GeUserBasicData() {                                     // 获取店铺基础数据
            basicApi.GeUserBasicData().then(res => {
                this.noteEntity = this.$app.isNull(res)
                    ? { sv_days_remaining: "", sv_id_renew: false, sv_sms_num: 0, sv_usage_days: "", sv_utilization_rate: 0 }
                    : res;
            })
        },
        handleRoute(code) {
            switch (code) {
                case 'sendSms': this.$router.push({ path: '/member/sendSms' }); break;
                case 'renewChooseEntry':
                    this.$router.push({ path: '/renew/renewChooseEntry', query: { singleType: this.$store.state.userInfo.buyshopnumber ? 'many' : 'odd' } })
                    break;
                default: break;
            }
        }
    }
}
