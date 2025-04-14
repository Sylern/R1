export default {
    props: {
        needTimePicker: { type: Boolean, default: false },
        // 默认隐藏超过今天的日期
        disableTime: { type: Boolean, default: false },
        forwardSelect: { type: Boolean, default: false },           // 选择今天及之后日期 并禁用今天之前的时间
        allSelect: { type: Boolean, default: false },               // 可全选
        paramData: { type: Array, default: () => { return [] } },
        disabled: { type: Boolean, default: false }                 // 是否禁用
    },
    data() {
        const now = new Date();
        const h = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
        const m = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
        const s = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
        let that = this;
        return {
            plaStart: this.needTimePicker ? '开始时间' : '开始日期',
            plaEnd: this.needTimePicker ? '结束时间' : '结束日期',
            pickerOptions: {
                shortcuts: [
                    {
                        text: '今日',
                        onClick(picker) {
                            const now = new Date();
                            let today = now.getFullYear() + '-' + parseInt(now.getMonth() + 1) + '-' + now.getDate();
                            const end = new Date(today + ' 23:59:59');
                            const start = that.forwardSelect && !that.allSelect ? now : new Date(today + ' 00:00:00');
                            picker.$emit('pick', [new Date(start), new Date(end)]);
                        }
                    },
                    {
                        text: that.forwardSelect ? '明日' : '昨日',
                        onClick(picker) {
                            const now = new Date();
                            let today = now.getFullYear() + '-' + parseInt(now.getMonth() + 1) + '-' + now.getDate();
                            let start = null, end = null;
                            if (that.forwardSelect) {
                                start = new Date(today).setTime(new Date(today + ' 23:59:59').getTime() + 1000);
                                end = new Date(today);
                                end.setTime(new Date(today + ' 23:59:59').getTime() + 3600 * 1000 * 24);
                            } else {
                                start = new Date(today);
                                start = start.setTime(new Date(today + ' 00:00:00').getTime() - 3600 * 1000 * 24);
                                end = new Date(today).setTime(new Date(today + ' 00:00:00').getTime() - 1000);
                            }
                            // const start = new Date(now.getFullYear() + '-' + parseInt(now.getMonth() + 1) + '-' + parseInt(now.getDate()));
                            picker.$emit('pick', [new Date(start), new Date(end)]);
                        }
                    },
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const now = new Date();
                            let today = now.getFullYear() + '-' + parseInt(now.getMonth() + 1) + '-' + now.getDate();
                            let start = null, end = null;
                            if (that.forwardSelect) {
                                start = now;
                                end = new Date(today);
                                end.setTime(new Date(today + ' 23:59:59').getTime() + 3600 * 1000 * 24 * 6);
                            } else {
                                start = new Date(today);
                                start = start.setTime(new Date(today + ' 00:00:00').getTime() - 3600 * 1000 * 24 * 6);
                                end = new Date(today + ' 23:59:59');
                            }
                            // const end = new Date();
                            // const start = new Date();
                            // that.forwardSelect && end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
                            // !that.forwardSelect && start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [new Date(start), new Date(end)]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const now = new Date();
                            let today = now.getFullYear() + '-' + parseInt(now.getMonth() + 1) + '-' + now.getDate();
                            let start = null, end = null;
                            if (that.forwardSelect) {
                                start = now;
                                end = new Date(today);
                                end.setTime(new Date(today + ' 23:59:59').getTime() + 3600 * 1000 * 24 * 30);
                            } else {
                                start = new Date(today);
                                start = start.setTime(new Date(today + ' 00:00:00').getTime() - 3600 * 1000 * 24 * 30);
                                end = new Date(today + ' 23:59:59');
                            }
                            // const end = new Date();
                            // const start = new Date();
                            // that.forwardSelect && end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
                            // !that.forwardSelect && start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [new Date(start), new Date(end)]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const now = new Date();
                            let today = now.getFullYear() + '-' + parseInt(now.getMonth() + 1) + '-' + now.getDate();
                            let start = null, end = null;
                            if (that.forwardSelect) {
                                start = now;
                                end = new Date(today);
                                end.setTime(new Date(today + ' 23:59:59').getTime() + 3600 * 1000 * 24 * 90);
                            } else {
                                start = new Date(today);
                                start = start.setTime(new Date(today + ' 00:00:00').getTime() - 3600 * 1000 * 24 * 90);
                                end = new Date(today + ' 23:59:59');
                            }
                            // const end = new Date();
                            // const start = new Date();
                            // that.forwardSelect && end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
                            // !that.forwardSelect && start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [new Date(start), new Date(end)]);
                        }
                    }]
            },
            defaultTime: ['00:00:00', '23:59:59'],        // 日期时间控件
            dateTime: []
        }
    },
    watch: {
        paramData: {                                       // 监听传过来的日期数据
            deep: true, immediate: true, handler: function (newVal, oldVal) { this.dateTime = newVal; }
        }
    },
    created() {
        if (!this.disableTime) {
            this.pickerOptions.disabledDate = (time) => {
                if (this.allSelect) return false;
                if (this.forwardSelect) {
                    return this.$app.compareDate(this.$app.currentTime(new Date(), 'yyyy-MM-dd'), this.$app.currentTime(time, 'yyyy-MM-dd'))
                } else {
                    return this.$app.compareDate(this.$app.currentTime(time, 'yyyy-MM-dd'), this.$app.currentTime(new Date(), 'yyyy-MM-dd'))
                }
            }
        }
    },
    methods: {
        handleChangeTime(e) {
            this.$emit('change', e);
        }
    }
}