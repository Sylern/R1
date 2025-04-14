const fs = require("fs");
const path = require("path");
// const route = '../src/modules/vip/views/memberCenter/member';               // 创建文件的位置路径
// const route = '../src/modules/system/views/salesroom'; 
// const route = '../src/modules/system/views/functionSetting'; 
const route = '../src/modules/common/views/promotion/page/interaction';
// checkedCommodityStore  multipleUnits

const basePath = path.resolve(__dirname, route);
let projectname = process.argv[2];
if (!projectname)                                                   // 验证文件名称必须不为空
    console.log('文件夹名称不能为空！'),
        console.log('示例：npm run create test '),
        process.exit(0);

projectname = projectname.substring(0, 1).toLowerCase() + projectname.substring(1);             // 首字母小写


const vueTep = `
<template>
  <div class="${projectname}-wrap">
  </div>
</template>

<style lang="scss" scoped>
@import "./${projectname}.scss";
</style>
<script src="./${projectname}.js"></script>
`;
const scssTep = `.${projectname}-wrap{
}`;
const jsTep = `
export default {
    data() {
        return {
        }
    },
    watch: {
    },
    mounted() {
    },
    methods: {
    }
}
`;


console.log(`${basePath}/${projectname}`);

fs.mkdirSync(`${basePath}/${projectname}`);                         // 创建文件夹 
process.chdir(`${basePath}/${projectname}`);                        // cd 到该文件夹下

fs.writeFileSync(`${projectname}.vue`, vueTep);                     // 创建vue文件
fs.writeFileSync(`${projectname}.scss`, scssTep);                   // 创建scss文件
fs.writeFileSync(`${projectname}.js`, jsTep);                       // 创建js文件
process.exit(0);

