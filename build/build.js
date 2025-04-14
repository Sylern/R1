const { execFileSync, spawnSync } = require('child_process');
const glob = require("glob");


let items = glob.sync('./src/modules/*/');
console.log(process.argv);
const projectname = process.argv[2] || "common";

var apiPrefix = process.argv[3] ? process.argv[3] : "api.test";
const apiconfig = process.env.apiconfig;

console.log("apiconfig = " + apiconfig);

const fs = require("fs");
fs.writeFileSync("./src/utils/config/env.json", JSON.stringify({ env: process.env.apiconfig.trim(), apiPrefix: apiPrefix }))

const start = new Date().getTime();
if (projectname === 'all') {
    for (const key in items) {
        let filepath = items[key]
        let fileList = filepath.split('/');
        let fileName = fileList[fileList.length - 2];
        try {
            console.log('正在编译: ' + fileName + '模块');
            // execFileSync('powershell', ['npm run pack ' + fileName, fileName, 'separate'], {});
            spawnSync('npm run pack ' + fileName, [], { cwd: process.cwd(), shell: true });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
} else {
    let items = projectname.split(',');
    for (const key in items) {
        console.log('正在编译: ' + items + '模块');
        spawnSync('npm run pack ' + items[key], [], { cwd: process.cwd(), shell: true });
    }
}
const end = new Date().getTime();
console.log('耗时:' + ((end - start) / 1000) + 's');
console.log('DEBUG: changed for CI only.')