export default {
    name: 'message',
    data() {
        return {
            showEdit: false,
            activePos: '0',
            tabs: [
                {
                    id: '0',
                    name: '系统通知',
                    isDot: false
                },
                {
                    id: '1',
                    name: '更新日志',
                    isDot: false
                },
                // {
                //     id: '3',
                //     name: '库存提醒',
                //     isDot: false
                // },
                // {
                //     id: '4',
                //     name: '货流提醒',
                //     isDot: false
                // }
            ],
            editList: [
                {
                    icon: '',
                    name: '店铺信息',
                },
                {
                    icon: '',
                    name: '语言选择',
                },
                {
                    icon: '',
                    name: '退款密码',
                },
                {
                    icon: '',
                    name: '开钱箱',
                }
            ]
        }
    },
    watch: {
    },
    computed: {
    },
    methods: {
        handleClick() {

        }
    }
}