//#region 工具类组件
import dcImg from './common/dcImg/dcImg.vue';                                                           // 图片组件引入
import cmdIcon from './common/cmd-icon/cmd-icon.vue';                                                   // 字体图标引入
import dcDialog from './common/dcDialog/dcDialog.vue';                                                  // 弹窗
import dcCheckbox from './common/dcCheckbox/dcCheckbox.vue';                                            // 勾选框
import dateTimePicker from '@/components/common/dateTimePicker/dateTimePicker.vue';                     // 时间组件引入
import ImportImg from './common/ImportImg/ImportImg.vue';                                               // 选择图片上传
import takePhoto from './vocational/takePhoto/takePhoto.vue';                                               // 选择图片上传
import ImportFile from './common/ImportFile/ImportFile.vue';                                            // 选择文件上传
import ImportExecl from './common/ImportExecl/ImportExecl.vue';                                         // 导入组件
import ImgPopover from './common/ImgPopover/ImgPopover.vue';                                            // 表格 图片组件
import collapseTransition from './common/collapseTransition/collapseTransition';                        // 上下收缩组件
import location from './common/location/location.vue';                                                  // 定位
import noProgress from './common/progress/progress.vue';                                                // 进度条
// import gridManager from './common/gridManager';                                                      // 
import menuTree from './common/menuTree/index.vue';                                                     // 递归树形菜单
import applicationJSON from './vocational/applicationJSON/applicationJSON.vue';                         // 小程序表单验证

//#region 业务类组件
import delay from './vocational/delay/delay.vue';                                                       // 延期
import checkedCommodity from './vocational/checkedCommodity/checkedCommodity.vue';                      // 选择商品
import checkedCategory from './vocational/checkedCategory/checkedCategory.vue';                         // 选择分类
import checkedMaterial from './vocational/checkedMaterial/checkedMaterial.vue';                         // 选择原料
import checkedSeckill from './vocational/checkedSeckill/checkedSeckill.vue'                             // 秒杀商品
import checkedStation from './vocational/checkedStation/checkedStation.vue'                             // 选择岗位

import checkedCardBg from './vocational/checkedCardBg/checkedCardBg.vue';                               // 选择会员卡背景图

import checkedPurchase from './vocational/checkedPurchase/checkedPurchase.vue';                         // 关联采购入库单
import checkedBill from './vocational/checkedBill/checkedBill.vue';                                     // 关联单据 商品调拨
import replenishment from './vocational/replenishment/replenishment.vue';                               // 智能补货提醒
import unCheckedStocktaking from './vocational/unCheckedStocktaking/unCheckedStocktaking.vue';          // 未盘商品列表


import viewImg from './common/dcImg/dcImg.vue'                                                          // 图片显示组件
import selectDlg from './common/selectDlg/selectDlg.vue'                                                // 弹窗

import labelTemplate from './vocational/labelTemplate/labelTemplate.vue';                               // 标签打印单个
import labelTemplateBox from './vocational/labelTemplateBox/labelTemplateBox.vue';                      // 标签打印外壳
import labelTemplateList from './vocational/labelTemplateList/labelTemplateList.vue';                   // 标签打印列表
import quotationNo from './vocational/quotationNo/quotationNo.vue';                                     // 选择引用单号
import pageTitle from './vocational/pageTitle/pageTitle.vue';                                           // 页面标题
import helpCenter from './vocational/helpCenter/helpCenter.vue';                                        // 帮助中心
import multiPage from './vocational/multiPage/multiPage.vue';                                           // 多标题页
import checkedIntegralCommodity from './vocational/checkedIntegralCommodity/checkedIntegralCommodity.vue' //积分商品
import updatePassword from './vocational/updatePassword/updatePassword.vue';                            // 修改密码



import memberList from './common/memberList/memberList.vue';                                            // 选择会员弹框
import operatorList from './common/operatorList/operatorList.vue';                                      // 选择操作员弹框

import checkedFeeding from './vocational/checkedFeeding/checkedFeeding.vue';                            // 选择加料
import checkedFlavor from './vocational/checkedFlavor/checkedFlavor.vue';                               // 选择口味
import checkedClassify from './vocational/checkedClassify/checkedClassify.vue';                         // 选择分类


import returnPsw from './vocational/returnPsw/returnPsw.vue';                                           // 退款弹窗
import convergePay from './vocational/convergePay/convergePay.vue';                                     // 聚合支付扫码弹框
import convergePayNew from './vocational/convergePayNew/convergePay.vue';                               // 聚合支付扫码弹框
import couponList from './vocational/couponList/couponList.vue';                                        // 优惠券选择弹框
import dsSignalr from './vocational/dsSignalr/dsSignalr.vue';                                           // 消息推送
import feedback from './vocational/feedback/feedback.vue';                                              // 反馈消息
import checkedBg from './vocational/checkedBg/checkedBg.vue'
import minAppLink from './vocational/minAppLink/minAppLink.vue'
import authentication from './vocational/authentication/authentication.vue'                             // 店铺认证
export {
    dcDialog,
    dcCheckbox,
    dateTimePicker,
    dcImg,
    cmdIcon,
    checkedCommodity,
    ImportExecl,
    checkedPurchase,
    checkedCardBg,
    checkedCategory,
    replenishment,
    checkedBill,
    checkedSeckill,
    checkedStation,
    unCheckedStocktaking,
    ImportImg,
    takePhoto,
    viewImg,
    selectDlg,
    ImgPopover,
    ImportFile,
    collapseTransition,
    labelTemplate,
    labelTemplateBox,
    labelTemplateList,
    quotationNo,
    pageTitle,
    helpCenter,
    multiPage,
    checkedIntegralCommodity,
    location,
    updatePassword,
    memberList,
    operatorList,
    checkedFeeding,
    checkedFlavor,
    checkedMaterial,
    checkedClassify,
    returnPsw,
    convergePay,
    convergePayNew,
    couponList,
    dsSignalr,
    feedback,
    noProgress,
    delay,
    menuTree,
    applicationJSON,
    checkedBg,
    minAppLink,
    authentication
}