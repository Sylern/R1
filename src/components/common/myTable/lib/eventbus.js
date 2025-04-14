"use strict";
/***
 * 自定义事件处理中心
 */
export default class EventBus {
    constructor(options={debug:false}) {
        this.oncesubs = [];                     //  一次性函数名称
        this.subscripts = [];                   //  订阅事件key=>val
        this.options = options;
    }

    /**
     * 新增事件监听
     * @param eventname 事件名称
     * @param callback 事件回调函数
     */
    on(eventname, callback) {
        var _that = this;                   // 检测是否存在事件,如果存在,则加入,不存在创建
        let sIndex = _that._findIndex(eventname);
        _that._log(_that.subscripts)
        if (sIndex >= 0) {
            _that.subscripts[sIndex].calls.push(callback);
        } else {
            _that.subscripts.push({ name: eventname, calls: [callback] });
        }
        if(this.options.debug==true){ _that.debug() }

    }

    /**
     * 移除事件监听
     * @param eventname 事件名称
     */
    off(eventname) {                    // 去除订阅
        var _that = this; 
        let sIndex = _that._findIndex(eventname);
        if (sIndex >= 0) { _that.subscripts.splice(sIndex,1); }
    }
    /**
     * 一次性监听事件
     * @param eventname
     * @param callback
     */
    once(eventname,callback){           //  执行一次后,销毁订阅
        var _that = this;               //  检测是否存在事件,如果存在,则加入,不存在创建
        let sIndex = _that._findIndex(eventname);
        _that._log(_that.subscripts)
        if (sIndex >= 0) {
            _that.on(eventname,callback)
        } else {
            _that.on(eventname,callback)
            _that.oncesubs.push(eventname)   //首次,传入一次性函数数组中
        }
        if(this.options.debug==true){ _that.debug() }
    }

    /**
     * 添加需要监听的事件
     * @param eventname
     */
    fire(eventname) {
        var _that = this;
        let sIndex = _that._findIndex(eventname);
        if (sIndex >= 0) {
            _that.subscripts[sIndex].calls.forEach(cal => {
                let argumentsNew = Array.prototype.slice.call(arguments, 1);
                cal.apply(null, argumentsNew);
            });
            //这里需要检测是否是一次性函数
            let _oIndex = _that.oncesubs.findIndex((name) => {
                return name === eventname;
            });
            if(_oIndex>=0){
                _that.off(eventname);
                _that.oncesubs.splice(_oIndex,1);
            }
        }else{
            _that._log(eventname+'event not exits')
        }
    }


    debug(){
        var _that = this;
        _that.subscripts.forEach((cal)=>{
        })
    }

    /**
     * 封装日志输出
     * @param msg
     * @private
     */
    _log(...msg){
        if( this.options.debug){
        }
    }

    /**
     * 查找事件下标
     * @param eventname 事件名称
     * @returns {number} 事件的下标,如果为-1则不存在
     * @private
     */
    _findIndex(eventname){
        var _that = this;
        let sIndex = -1;
        sIndex = _that.subscripts.findIndex(sub => {
            return sub.name === eventname;
        });
        return sIndex;
    }
}
