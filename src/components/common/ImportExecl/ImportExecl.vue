<template>
    <el-dialog :title="dataJson.title" :append-to-body="true" :visible.sync="dialogVisible" :width="typeExecl === 'show'?'1240px':'850px'" center class="system_dialog">
        <div class="ImportExecl borderTop">
            <template v-if="typeExecl==='start'">
                <div class="left">
                    <div class="title">说明</div>
                    <div class="dd">1、下载导入模板的Excel可以批量导入</div>
                    <div class="dd">2、按模板填写信息，确保模板内容无误</div>
                    <div class="dd">3、上传并批量导入数据</div>
                    <div class="dd">4、为保障导入成功,建议每次导入文件不超过1M</div>
                    <div class="dd">5、为保障导入成功,表内数据与系统内数据一致,格式一致</div>
                </div>
                <div class="right">
                    <input @change="handleFile" ref="fileImport" class="file" type="file" />
                    <div v-for="(item,index) in checkData.list" :key="index" class="item">
                        <template v-if="item.type==='download'">
                            <div @click="handleDownloadImport(item)" class="imgWrap">
                                <img class="img" :src="$store.state.base.frontImgBase+'/images/template@2x.png'" />
                            </div>
                            <div class="name">下载模板</div>
                        </template>
                        <template v-else>
                            <div @click="handleImport(item)" class="imgWrap">
                                <img class="img" :src="$store.state.base.frontImgBase+'/images/import@2x.png'" />
                            </div>
                            <div class="name">导入列表</div>
                        </template>
                    </div>
                </div>
            </template>

            <template v-if="typeExecl==='have'">
                <div class="content">
                    <div class="progress">
                        <div class="imgWrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/shijan@2x.png'" />
                        </div>
                        <div class="txt">数据导入中，请耐心等待....</div>
                    </div>
                </div>
            </template>

            <template v-if="typeExecl === 'show'">
                <div class="content member_list">
                    <el-scrollbar class="tabel_wrap">
                        <myTable ref="myTable" rowKey="sv_mr_cardno" :data="memberJson" class="member_table">
                            <my-table-cell align="center" label="序号" width="40" prop="index" fixed>
                                <template v-slot:default="row">
                                    <span>{{row.index+1}}</span>
                                </template>
                            </my-table-cell>
                            <my-table-cell label="会员卡号" prop="sv_mr_cardno" width="120"></my-table-cell>
                            <my-table-cell label="会员姓名" prop="sv_mr_name" width="100"></my-table-cell>
                            <my-table-cell label="手机号码" prop="sv_mr_mobile" width="120" align="center"></my-table-cell>
                            <my-table-cell label="称谓" prop="sv_mr_nick" width="120" align="center"></my-table-cell>
                            <my-table-cell label="会员等级" prop="sv_ml_name" width="100" align="center"></my-table-cell>
                            <my-table-cell label="会员分组" prop="sv_mg_name" width="100" align="center"></my-table-cell>
                            <my-table-cell label="会员生日" prop="sv_mr_birthday" width="100" align="center"></my-table-cell>
                            <my-table-cell label="备注信息" prop="sv_mr_remark" width="120"></my-table-cell>
                            <my-table-cell label="会员余额" prop="sv_mw_availableamount" width="120" align="center" ></my-table-cell>
                            <my-table-cell label="累计消费" prop="" width="120" align="center"></my-table-cell>
                            <my-table-cell label="会员积分" prop="sv_mw_sumpoint" width="120" align="center"></my-table-cell>
                            <!-- <my-table-cell label="累计充值积分" prop="sv_mw_sumpoint" width="120"></my-table-cell> -->
                            <my-table-cell label="注册时间" prop="sv_mr_adddate" width="120" align="center"></my-table-cell>
                            <my-table-cell label="过期时间" prop="sv_mr_deadline" width="120" align="center"></my-table-cell>
                        </myTable>
                    </el-scrollbar>
                    <div class="foot show_wrap">
                        <div class="rodio">
                            <el-radio v-model="memberType" :label="0">默认验证同手机卡号重复
                                <el-tooltip effect="dark" placement="top" content="只要手机号，卡号存在视为系统已存在对应会员" class="etr_tooltip">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </el-radio>
                            <el-radio v-model="memberType" :label="1">覆盖会员余额积分
                                <el-tooltip effect="dark" placement="top" content="根据表格手机号,卡号，名字作为唯一验证全匹配,匹配成功将新的余额替换系统已存在的余额积分" class="etr_tooltip">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </el-radio>
                            <el-radio v-model="memberType" :label="2">叠加会员余额积分
                                <el-tooltip effect="dark" placement="top" content="根据表格手机号,卡号，名字作为唯一验证全匹配,匹配成功将新的余额累加到系统已存在会员的余额积分" class="etr_tooltip">
                                    <i class="el-icon-question"></i>
                                </el-tooltip>
                            </el-radio>
                        </div>
                        <div class="fontContent">
                            <el-button @click="handlePostlist" class="download btnItem btnPrimary">确定</el-button>
                            <el-button @click="typeExecl='start'" class="submit btnItem">取消</el-button>
                        </div>
                    </div>
                </div>
            </template>

            <template v-if="typeExecl==='end'">
                <div class="content">
                    <div class="success">
                        <div class="imgWrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/success.png'" />
                        </div>
                        <div class="txt">导入完成</div>
                        <div v-if="isOk" class="info">导入成功{{successInfo.Success_Number}}条数据</div>
                        <div v-else class="error">
                            导入成功{{successInfo.Success_Number}}条数据,失败
                            <label>{{successInfo.Fail_Number}}</label>条数据
                        </div>
                        <div class="foot">
                            <div class="fontContent">
                                <div @click="handleDownload" v-if="!isOk" class="download">下载失败列表</div>
                                <div @click="handleSubmit" class="submit">确定</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

             <template v-if="typeExecl==='waring'">
                <div class="content">
                    <div class="success">
                        <div class="imgWrap">
                            <img class="img" :src="$store.state.base.frontImgBase+'/images/success.png'" />
                        </div>
                        <div class="txt">申请导入完成</div>
                        <div class="foot">
                            <div class="fontContent">
                                <div @click="handleSubmit" class="submit">确定</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </el-dialog>
</template>

<style  lang="sass" scoped>@import "./ImportExecl.scss"
</style>
<script src="./ImportExecl.js"></script>