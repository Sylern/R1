<template>
    <div class="label-printing">
        <div class="p-top-10">
            <el-button @click="goBack" type="text">返回标签列表</el-button>
        </div>
        <el-scrollbar class="diy_body">
            <div style="width: 460px;">
                <el-form ref="form" :model="form" label-width="75px">
                    <el-form-item label="模板名称:">
                        <el-input v-model="form.name" placeholder="请输入模板名称"></el-input>
                    </el-form-item>
                    <el-form-item label="纸张尺寸:">
                        <el-col :span="11" class="size_content">
                            宽 <el-input v-model="form.width" class="size_input"></el-input>mm
                        </el-col>
                        <el-col class="size_line" :span="2">-</el-col>
                        <el-col :span="11" class="size_content">
                            高 <el-input v-model="form.height" class="size_input"></el-input>mm
                        </el-col>
                    </el-form-item>
                    <el-form-item label="背景图片:">
                        <!-- <UploadImg1 v-model="form.imgurl" /> -->
                        <ImportImg :dataJson="importImg" @callback="callbackImportImgEdit" :verifyJson="verifyJson" :typeEntity="typeEntity"></ImportImg>
                        <div class="tips">· 背景图不会被打印，仅用于辅助调整打印项位置。</div>
                        <div class="tips">· 建议图片尺寸比例与纸张尺寸比例一致，图片不超过200kb。</div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="p-top-10">模板设置</div>
            <el-divider></el-divider>
            <div class="min-flex min-flex-main-start min-flex-align-stretch">
                <div>
                    <!-- 拖拽区 -->
                    <div class="drawing-board drag-box" id="drag--id" :style="{backgroundImage: 'url('+ labelImgurl +')', 'background-size': 'auto 100%', 'background-repeat':  'no-repeat','background-position': 'center' ,  width: width + 'px' , height: height + 'px'}">
                        <span v-for="(item) in itemList" :key="item.uuid" :class="['item-box', activeItem === item.uuid ? 'item-box-active' : '']" v-drag="item" :style="{left: item.left + 'px', top: item.top + 'px'}" @click="handleItemType(item)">
                            <!-- 条形码模块 start -->
                            <div v-if="item.itemType === 4">
                                <div class="style" v-if="item.barCodeDisplayType === 1||item.displayType === 1">
                                    <div class="font-small" :style="{'font-size': fontView(item.fontSize) + 'px'}">22563</div>
                                </div>
                                <div class="style min-flex min-flex-dir-top" v-if="item.barCodeDisplayType === 2||item.displayType === 2" :style="`width: ${item.barCodeWidth*1.625}px;`">
                                    <div class="bar-code" :style="`width: ${item.barCodeWidth*1.625}px;height: ${item.barCodeHeight*1.625}px;`"></div>
                                </div>
                                <div class="style" v-if="item.barCodeDisplayType === 3||item.displayType === 3" :style="`width: ${item.barCodeWidth*1.625}px;`">
                                    <div class="bar-code" :style="`width: ${item.barCodeWidth*1.625}px;height: ${item.barCodeHeight*1.625}px;`"></div>
                                    <div class="font-small">22563</div>
                                </div>
                            </div>
                            <!-- 条形码模块 end -->
                            <!-- 两行样式 start -->
                            <div v-else-if="item.itemType === 5||item.itemType === 2">
                                <div v-if="item.name==='生产日期'">
                                    <span :class="{'item-bold': item.b, 'item-underline': item.u}" :style="{'font-size': fontView(item.fontSize) + 'px'}">{{item.displayModel === 1 ? item.title + '###' : '#' + item.title}}</span>
                                </div>
                                <div v-else>
                                    <div class="style min-flex min-flex-dir-top" :class="{'item-bold': item.b, 'item-underline': item.u}" v-if="item.displayStyle*1 === 1">
                                        <!-- <div :style="{'font-size': fontView(item.fontSize) + 'px'}">{{item.name}}{{item.showUnit ? '(xx)': ''}}</div> -->
                                        <div :style="{'font-size': fontView(item.fontSize) + 'px'}">xx.xx</div>
                                    </div>
                                    <div class="style min-flex min-flex-dir-top" :class="{'item-bold': item.b, 'item-underline': item.u}" v-if="item.displayStyle*1 === 2">
                                        <!-- <div :style="{'font-size': fontView(item.fontSize) + 'px'}">{{item.name}}{{item.showUnit ? '(xx)': ''}}</div> -->
                                        <div :style="{'font-size': fontView(item.fontSize) + 'px'}">xx.xx</div>
                                    </div>
                                    <div class="style" :class="{'item-bold': item.b, 'item-underline': item.u}" v-if="item.displayStyle*1 === 3">
                                        <!-- <span :style="{'font-size': fontView(item.fontSize) + 'px'}">{{item.name}}:{{item.showUnit ? '(xx)': ''}}</span> -->
                                        <span :style="{'font-size': fontView(item.fontSize) + 'px'}">xx.xx</span>
                                    </div>
                                    <div class="style" :class="{'item-bold': item.b, 'item-underline': item.u}" v-if="item.displayStyle*1 === 5">
                                        <!-- <span :style="{'font-size': fontView(item.fontSize) + 'px'}">{{item.name}}:{{item.showUnit ? '(xx)': ''}}</span> -->
                                        <span :style="{'font-size': fontView(item.fontSize) + 'px'}">xx.xx</span>
                                    </div>
                                </div>
                            </div>
                            <!-- 两行样式 end -->
                            <div v-else-if="item.itemType === 6">
                                <div class="style min-flex min-flex-dir-top" v-if="item.displayStyle*1 === 1">
                                    <!-- <div >{{item.name}}(元)</div> -->
                                    <div :style="{'font-size': fontView(item.fontSize) + 'px'}">xx.xx</div>
                                </div>
                                <div class="style min-flex min-flex-dir-top" v-if="item.displayStyle*1 === 2">
                                    <!-- <div >{{item.name}}(元)</div> -->
                                    <div :style="{'font-size': fontView(item.fontSize) + 'px'}">xx.xx</div>
                                </div>
                                <div class="style" v-if="item.displayStyle*1 === 3">
                                    <!-- <span>{{item.name}}(元)</span> -->
                                    <span :style="{'font-size': fontView(item.fontSize) + 'px'}">xx.xx</span>
                                </div>
                            </div>
                            <!-- 洗涤样式 start -->
                            <div v-else-if="item.itemType === 12">
                                <div class="style min-flex min-flex-dir-top" v-if="item.washingMethodDisplayType === 1" :style="`width: ${210 * item.barCodeWidth}px;`">
                                    <div class="wash-icon-bg" :style="`background-image: url('${item.data.iconUrl}');`"></div>
                                </div>
                                <div class="style" v-else-if="item.washingMethodDisplayType === 2" :style="`width: ${210 * item.barCodeWidth}px;`">
                                    <div class="wash-icon-bg" :style="`background-image: url('${item.data.iconUrl}');`"></div>
                                    <div :class="{'item-bold': item.b, 'item-underline': item.u}" :style="{'font-size': item.fontSize + 'px','color':'#616161'}" class="font-small">{{item.title}}</div>
                                </div>
                            </div>
                            <!-- 基本样式 start -->
                            <span v-else :class="{'item-bold': item.b, 'item-underline': item.u}" :style="{'font-size': fontView(item.fontSize) + 'px'}">{{item.displayModel === 1 ? item.title + '###' : '#' + item.title}}</span>
                            <i class="item-icon el-icon-circle-close" @click.stop="handleRemoveItem(item)"></i>
                        </span>
                    </div>
                    <!-- 组件 -->
                    <div class="drawing-board base_values_wrap m-tb-10 p-lr-10 p-tb-10">
                        <div class="title">基础字段</div>
                        <div class="min-flex base_values">
                            <div v-for="item in basis" :key="item.name" class="label-item">
                                <div class="item min-flex" @click="handleItem(item)">{{item.name}}</div>
                            </div>
                        </div>
                        <!-- <div class="title">条码秤字段</div>
                        <div class="min-flex base_values">
                            <div v-for="item in barcodes" :key="item.name" class="label-item">
                            <div class="item min-flex" @click="handleItem(item)">{{item.name}}</div>
                            </div>
                        </div> -->
                        <div class="title">价格字段</div>
                        <div class="min-flex base_values">
                            <div v-for="item in price" :key="item.name" class="label-item">
                                <div class="item min-flex" @click="handleItem(item)">{{item.name}}</div>
                            </div>
                        </div>
                        <div class="title">{{isShoes?'条码/款号字段':'条码/货号字段'}}</div>
                        <div class="min-flex base_values">
                            <div v-for="item in barcodes" :key="item.name" class="label-item">
                                <div class="item min-flex" @click="handleItem(item)">{{item.name}}</div>
                            </div>
                        </div>
                        <!-- <div class="title">洗涤方式</div>
                        <div class="min-flex base_values">
                            <div v-for="item in washList" :key="item.title" @click="handleItem(item)" class="wash-icon-item">
                            <img class="img" :src="item.iconUrl" :alt="item.title" class="wash-icon">
                            <div class="wash-title">{{item.title}}</div>
                            </div>
                        </div> -->
                        <div class="title">其他信息</div>
                        <div class="min-flex base_values">
                            <div v-for="item in otherInfo" :key="item.name" class="label-item">
                                <div class="item min-flex" @click="handleItem(item)">{{item.name}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 模板 -->
                <div class="module m-left-10">
                    <!-- 基础字段右边工具栏 -->
                    <div class="item" v-if="activeItemType === 1">
                        <div>{{itemType1.name}}</div>
                        <el-divider></el-divider>
                        <el-form ref="form" label-width="100px" class="tool_form">
                            <el-form-item label="坐标:">
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    横坐标<el-input-number v-model="itemType1.left" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                                <el-col class="line min-flex" :span="2">-</el-col>
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    纵坐标<el-input-number v-model="itemType1.top" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="打印内容:">
                                <el-radio v-model="itemType1.displayModel" :label="1">
                                    <span>打印标题和内容</span>
                                    <el-tooltip effect="dark" content="温馨提示：打印出来的内容包含标题和内容两部分，例如：“标题：内容”。" placement="top-start">
                                        <i class="el-icon-question" style="color: #909399"></i>
                                    </el-tooltip>
                                </el-radio>
                                <div>
                                    <span>标题显示:</span>
                                    <el-input v-model="itemType1.title" :disabled="itemType1.displayModel === 2" placeholder="请输入标题" class="title_input"></el-input>
                                </div>
                                <el-radio v-model="itemType1.displayModel" :label="2">仅打印内容<el-tooltip effect="dark" content="温馨提示：如 “标题：内容”，仅打印 “内容”。" placement="top-start">
                                        <i class="el-icon-question" style="color: #909399"></i>
                                    </el-tooltip>
                                </el-radio>

                            </el-form-item>
                            <el-form-item label="字体大小:">
                                <el-select v-model="itemType1.fontSize" placeholder="请选择">
                                    <el-option v-for="item in fontSizes" :key="item" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="文字样式:">
                                <div class="font_style">
                                    <!-- <el-radio-button v-model="itemType1.fontStyle" label="1"><img class="img" src="~@/assets/images/system/b.png" class="imgbtn m-right-10"></el-radio-button>
                                    <el-radio-button v-model="itemType1.fontStyle" label="4"><img class="img" src="~@/assets/images/system/u.png" class="imgbtn"></el-radio-button> -->
                                    <el-checkbox v-model="blod" @change="fontChange"><img src="~@/assets/images/system/b.png" class="img imgbtn m-right-10" :class="{'imgbtn-action': blod }"></el-checkbox>
                                    <el-checkbox v-model="underline" @change="fontChange"><img src="~@/assets/images/system/u.png" class="img imgbtn" :class="{'imgbtn-action': underline }"></el-checkbox>
                                    <!-- <img class="img" src="~@/assets/images/system/b.png" @click="fontChange(1)" class="imgbtn m-right-10" :class="{'imgbtn-action': itemType1.b }">
                                    <img class="img" src="~@/assets/images/system/u.png" @click="fontChange(4)" class="imgbtn" :class="{'imgbtn-action': itemType1.u }"> -->
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 日期右边工具栏 -->
                    <div class="item" v-if="activeItemType === 2">
                        <div>{{itemType1.name}}</div>
                        <el-divider></el-divider>
                        <el-form ref="form" label-width="100px">
                            <el-form-item label="坐标:">
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    横坐标<el-input-number v-model="itemType1.left" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                                <el-col class="line min-flex" :span="2">-</el-col>
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    纵坐标<el-input-number v-model="itemType1.top" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                            </el-form-item>
                            <div v-if="itemType1.name==='生产日期'">
                                <el-form-item label="打印内容:">
                                    <el-radio v-model="itemType1.displayModel" :label="1">打印标题和内容<el-tooltip effect="dark" content="温馨提示：打印出来的内容包含标题和内容两部分，例如：“标题：内容”。" placement="top-start">
                                            <i class="el-icon-question" style="color: #909399"></i>
                                        </el-tooltip>
                                    </el-radio>
                                    <div>
                                        <span>标题显示:</span>
                                        <el-input v-model="itemType1.title" :disabled="itemType1.displayModel === 2" placeholder="请输入标题" class="title_input"></el-input>
                                    </div>
                                    <el-radio v-model="itemType1.displayModel" :label="2">仅打印内容<el-tooltip effect="dark" content="温馨提示：如 “标题：内容”，仅打印 “内容”。" placement="top-start">
                                            <i class="el-icon-question" style="color: #909399"></i>
                                        </el-tooltip>
                                    </el-radio>
                                </el-form-item>
                                <el-form-item label="展示样式:">
                                    <el-radio v-model="itemType1.dateTimeDisplayModel" :label="1">YYYY年MM月DD日，如：2019年12月05日</el-radio>
                                    <el-radio v-model="itemType1.dateTimeDisplayModel" :label="2">YYYY/MM/DD。如：2019/12/05</el-radio>
                                    <el-radio v-model="itemType1.dateTimeDisplayModel" :label="3">MM/DD，如：12-05</el-radio>
                                    <el-radio v-model="itemType1.dateTimeDisplayModel" :label="5">YYYY/MM/DD HH:MM:SS，如：2021/12/05 08:00:00</el-radio>
                                </el-form-item>
                            </div>
                            <div v-else>
                                <el-form-item label="展示样式:">
                                    <el-radio v-model="itemType1.dateDisplayModel" :label="1">YYYY年MM月DD日，如：2019年12月05日</el-radio>
                                    <el-radio v-model="itemType1.dateDisplayModel" :label="2">YYYY/MM/DD。如：2019/12/05</el-radio>
                                    <el-radio v-model="itemType1.dateDisplayModel" :label="3">MM/DD，如：12-05</el-radio>
                                </el-form-item>
                            </div>
                            <el-form-item label="字体大小:">
                                <el-select v-model="itemType1.fontSize" placeholder="请选择">
                                    <el-option v-for="item in fontSizes" :key="item" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="文字样式:">
                                <div class="font_style">
                                    <el-checkbox v-model="blod" @change="fontChange"><img src="~@/assets/images/system/b.png" class="img imgbtn m-right-10" :class="{'imgbtn-action': blod }"></el-checkbox>
                                    <el-checkbox v-model="underline" @change="fontChange"><img src="~@/assets/images/system/u.png" class="img imgbtn" :class="{'imgbtn-action': underline }"></el-checkbox>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 下单时间右边工具栏 -->
                    <div class="item" v-if="activeItemType === 3">
                        <div>{{itemType1.name}}</div>
                        <el-divider></el-divider>
                        <el-form ref="form" label-width="100px">
                            <el-form-item label="坐标:">
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    横坐标<el-input-number v-model="itemType1.left" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                                <el-col class="line min-flex" :span="2">-</el-col>
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    纵坐标<el-input-number v-model="itemType1.top" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="打印内容:">
                                <el-radio v-model="itemType1.displayModel" :label="1">打印标题和内容<el-tooltip effect="dark" content="温馨提示：打印出来的内容包含标题和内容两部分，例如：“标题：内容”。" placement="top-start">
                                        <i class="el-icon-question" style="color: #909399"></i>
                                    </el-tooltip>
                                </el-radio>
                                <div>
                                    <span>标题显示:</span>
                                    <el-input v-model="itemType1.title" :disabled="itemType1.displayModel === 2" placeholder="请输入标题" class="title_input"></el-input>
                                </div>
                                <el-radio v-model="itemType1.displayModel" :label="2">仅打印内容<el-tooltip effect="dark" content="温馨提示：如 “标题：内容”，仅打印 “内容”。" placement="top-start">
                                        <i class="el-icon-question" style="color: #909399"></i>
                                    </el-tooltip>
                                </el-radio>
                            </el-form-item>
                            <el-form-item label="展示样式:">
                                <el-radio v-model="itemType1.dateDisplayModel" :label="1">YYYY年MM月DD日，如：2019年12月05日 15:22:21</el-radio>
                                <el-radio v-model="itemType1.dateDisplayModel" :label="2">YYYY/MM/DD。如：2019/12/05 15:22:21</el-radio>
                                <el-radio v-model="itemType1.dateDisplayModel" :label="3">MM/DD，如：12-05 15:22:21</el-radio>
                            </el-form-item>
                            <el-form-item label="字体大小:">
                                <el-select v-model="itemType1.fontSize" placeholder="请选择">
                                    <el-option v-for="item in fontSizes" :key="item" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="文字样式:">
                                <div class="font_style">
                                    <el-checkbox v-model="blod" @change="fontChange"><img src="~@/assets/images/system/b.png" class="img imgbtn m-right-10" :class="{'imgbtn-action': blod }"></el-checkbox>
                                    <el-checkbox v-model="underline" @change="fontChange"><img src="~@/assets/images/system/u.png" class="img imgbtn" :class="{'imgbtn-action': underline }"></el-checkbox>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 条形码右边工具栏 -->
                    <div class="item" v-if="activeItemType === 4">
                        <div>{{itemType1.name}}</div>
                        <el-divider></el-divider>
                        <el-form ref="form" label-width="100px">
                            <el-form-item label="坐标:">
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    横坐标<el-input-number v-model="itemType1.left" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                                <el-col class="line min-flex" :span="2">-</el-col>
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    纵坐标<el-input-number v-model="itemType1.top" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                            </el-form-item>
                            <el-form-item v-if="itemType1.name===(isShoes?'商品条码':'商品货号')" label="展示样式:">
                                <el-radio v-model="itemType1.displayType" :label="1">货号展示为数字</el-radio><br />
                                <el-radio v-model="itemType1.displayType" :label="2">展示为条码</el-radio><br />
                                <el-radio v-model="itemType1.displayType" :label="3">展示为条码+数字</el-radio>
                            </el-form-item>
                            <el-form-item v-else label="展示样式:">
                                <el-radio v-model="itemType1.barCodeDisplayType" :label="1">展示为数字</el-radio><br />
                                <el-radio v-model="itemType1.barCodeDisplayType" :label="2">展示为条码</el-radio><br />
                                <el-radio v-model="itemType1.barCodeDisplayType" :label="3">展示为条码+数字</el-radio>
                            </el-form-item>
                            <el-form-item label="字体大小:" v-if="itemType1.displayType === 1 || itemType1.barCodeDisplayType === 1">
                                <el-select v-model="itemType1.fontSize" placeholder="请选择">
                                    <el-option v-for="item in fontSizes" :key="item" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="条码宽度:" v-if="itemType1.displayType !== 1 && itemType1.barCodeDisplayType !== 1">
                                <el-input-number v-model="itemType1.barCodeWidth" controls-position="right" :min="1" class="input_num barcode"></el-input-number>
                                <!-- <el-select v-model="itemType1.barCodeWidth" placeholder="请选择">
                                    <el-option key="1" label="1" :value="1"></el-option>
                                    <el-option key="2" label="2" :value="2"></el-option>
                                </el-select> -->
                            </el-form-item>
                            <el-form-item label="条码高度:" v-if="itemType1.displayType !== 1 && itemType1.barCodeDisplayType !== 1">
                                <el-input-number v-model="itemType1.barCodeHeight" controls-position="right" :min="1" class="input_num barcode"></el-input-number>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 双行字体右边工具栏 -->
                    <div class="item" v-if="activeItemType === 5">
                        <div>{{itemType1.name}}</div>
                        <el-divider></el-divider>
                        <el-form ref="form" label-width="100px">
                            <el-form-item label="坐标:">
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    横坐标<el-input-number v-model="itemType1.left" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                                <el-col class="line min-flex" :span="2">-</el-col>
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    纵坐标<el-input-number v-model="itemType1.top" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="字体大小:">
                                <el-select v-model="itemType1.fontSize" placeholder="请选择">
                                    <el-option v-for="item in fontSizes" :key="item" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 双行右边工具栏 -->
                    <div class="item" v-if="activeItemType === 6">
                        <div>{{itemType1.name}}</div>
                        <el-divider></el-divider>
                        <el-form ref="form" label-width="100px">
                            <el-form-item label="坐标:">
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    横坐标<el-input-number v-model="itemType1.left" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                                <el-col class="line min-flex" :span="2">-</el-col>
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    纵坐标<el-input-number v-model="itemType1.top" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="字体大小:">
                                <el-select v-model="itemType1.fontSize" placeholder="请选择">
                                    <el-option v-for="item in fontSizes" :key="item" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 二维码工具栏 -->
                    <div class="item" v-if="activeItemType === 7">
                        <div>{{itemType1.name}}</div>
                        <el-divider></el-divider>
                        <el-form ref="form" label-width="100px">
                            <el-form-item label="坐标:">
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    横坐标<el-input-number v-model="itemType1.left" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                                <el-col class="line min-flex" :span="2">-</el-col>
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    纵坐标<el-input-number v-model="itemType1.top" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="展示样式:">
                                <el-radio v-model="itemType1.type" :label="1">店铺微信商城二维码</el-radio><br />
                                <el-radio v-model="itemType1.type" :label="2">店铺小程序二维码</el-radio><br />
                                <el-radio v-model="itemType1.type" :label="3">其他二维码</el-radio>
                            </el-form-item>
                            <el-form-item v-show="itemType1.type===3" label="">
                                <!-- <UploadImg1 v-model="itemType1.qRCodeUrl" /> -->
                            </el-form-item>
                            <el-form-item label="二维码高度:">
                                <el-input-number v-model="itemType1.height" controls-position="right" :min="1"></el-input-number>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- <div class="item" v-if="activeItemType === 8">
                        <div>{{itemType1.name}}</div>
                        <el-divider></el-divider>
                        <el-form ref="form" label-width="100px">
                            <el-form-item label="坐标:">
                            <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                横坐标<el-input-number v-model="itemType1.left" controls-position="right" class="input_num"></el-input-number>
                            </el-col>
                            <el-col class="line min-flex" :span="2">-</el-col>
                            <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                纵坐标<el-input-number v-model="itemType1.top" controls-position="right" class="input_num"></el-input-number>
                            </el-col>
                            </el-form-item>
                            <el-form-item label="展示样式:">
                            <el-radio v-model="itemType1.washingMethodDisplayType" :label="1">店铺微信商城二维码</el-radio><br />
                            <el-radio v-model="itemType1.washingMethodDisplayType" :label="2">店铺小程序二维码</el-radio><br />
                            <el-radio v-model="itemType1.washingMethodDisplayType" :label="3">其他二维码</el-radio><br />
                            <div v-if="itemType1.washingMethodDisplayType === 3" class="min-flex">
                                <UploadImg1 v-model="itemType1.qRCodeUrl" />
                                <div>
                                <div class="tips">· 背景图不会被打印，仅用于辅助调整打印项位置。</div>
                                <div class="tips">· 建议图片尺寸比例与纸张尺寸比例一致，图片不超过200kb。</div>
                                </div>
                            </div>
                            </el-form-item>
                            <el-form-item v-show="itemType1.type===3" label="">
                            <UploadImg1 v-model="itemType1.qRCodeUrl" />
                            </el-form-item>
                            <el-form-item label="二维码高度:">
                            <el-input-number v-model="itemType1.height" controls-position="right" :min="1"></el-input-number>
                            </el-form-item>
                        </el-form>
                    </div> -->
                    <!-- 会员价 -->
                    <div class="item" v-if="activeItemType === 9">
                        <div>{{itemType1.name}}</div>
                        <el-divider></el-divider>
                        <el-form ref="form" label-width="100px">
                            <el-form-item label="坐标:">
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    横坐标<el-input-number v-model="itemType1.left" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                                <el-col class="line min-flex" :span="2">-</el-col>
                                <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                    纵坐标<el-input-number v-model="itemType1.top" controls-position="right" class="input_num"></el-input-number>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="打印内容:" v-if="itemType1.name!=='自定义文本'">
                                <el-radio v-model="itemType1.displayModel" :label="1">
                                    <span>打印标题和内容</span>
                                    <el-tooltip effect="dark" content="温馨提示：打印出来的内容包含标题和内容两部分，例如：“会员价：30.00”。" placement="top-start">
                                        <i class="el-icon-question" style="color: #909399"></i>
                                    </el-tooltip>
                                </el-radio>
                                <div>
                                    <span>标题显示:</span>
                                    <el-input v-model="itemType1.title" :disabled="itemType1.displayModel === 2" placeholder="请输入标题" class="title_input"></el-input>
                                </div>
                                <el-radio v-model="itemType1.displayModel" :label="2">仅打印内容<el-tooltip effect="dark" content="温馨提示：如 “会员价：30.00”，仅打印 “30.00”。" placement="top-start">
                                        <i class="el-icon-question" style="color: #909399"></i>
                                    </el-tooltip>
                                </el-radio>
                            </el-form-item>
                            <!-- <el-form-item v-if="itemType1.memberLevels||itemType1.seletedMemberLevelId" label="展示样式:">
                                <el-radio v-model="itemType1.seletedMemberLevelId" :label="0">展示会员价</el-radio><br />
                                <el-radio v-model="itemType1.seletedMemberLevelId" :label="itemType1.memberLevels[0].memberlevel_id">展示会员等级</el-radio>
                                <el-select v-model="itemType1.seletedMemberLevelId" placeholder="请选择会员等级" style="width: 140px;">
                                    <el-option
                                    v-for="item in itemType1.memberLevels"
                                    :key="item.memberlevel_id"
                                    :label="item.sv_ml_name"
                                    :value="item.memberlevel_id">
                                    </el-option>
                                </el-select>
                                的会员价
                                <br />
                            </el-form-item> -->
                            <el-form-item v-else label="文本内容:">
                                <el-input type="textarea" placeholder="文本内容" :autosize="{ minRows: 6, maxRows: 6}" v-model="itemType1.title" maxlength="100" show-word-limit>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="字体大小:">
                                <el-select v-model="itemType1.fontSize" placeholder="请选择">
                                    <el-option v-for="item in fontSizes" :key="item" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="文字样式:">
                                <div class="font_style">
                                    <el-checkbox v-model="blod" @change="fontChange"><img src="~@/assets/images/system/b.png" class="img imgbtn m-right-10" :class="{'imgbtn-action': blod }"></el-checkbox>
                                    <el-checkbox v-model="underline" @change="fontChange"><img src="~@/assets/images/system/u.png" class="img imgbtn" :class="{'imgbtn-action': underline }"></el-checkbox>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 洗涤方式工具栏 -->
                    <!-- <div class="item" v-if="activeItemType === 12">
                        <div>{{itemType1.name}}</div>
                        <el-divider></el-divider>
                        <el-form ref="form" label-width="100px">
                            <el-form-item label="坐标:">
                            <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                横坐标<el-input-number v-model="itemType1.left" controls-position="right" class="input_num"></el-input-number>
                            </el-col>
                            <el-col class="line min-flex" :span="2">-</el-col>
                            <el-col :span="11" class="min-flex flex_jc_sb flex_ai_c">
                                纵坐标<el-input-number v-model="itemType1.top" controls-position="right" class="input_num"></el-input-number>
                            </el-col>
                            </el-form-item>
                            <el-form-item label="展示样式:">
                            <el-radio v-model="itemType1.washingMethodDisplayType" :label="1">仅展示图标</el-radio><br />
                            <el-radio v-model="itemType1.washingMethodDisplayType" :label="2">展示图标和文字</el-radio><br />
                            </el-form-item>
                        </el-form>
                    </div> -->
                </div>
            </div>
        </el-scrollbar>
        <div class="fix-bottom-bar">
            <el-button type="primary" size="medium" @click="saveTemplate">保存</el-button>
            <el-button type="primary" size="medium" @click="goBack">返回</el-button>
            <!-- <el-button type="primary" size="medium" @click="testPrint">打印测试</el-button> -->
        </div>
    </div>
</template>

<script src="./tagAdd.js"></script>

<style lang='scss' scoped>
@import './tagAdd.scss';
</style>
