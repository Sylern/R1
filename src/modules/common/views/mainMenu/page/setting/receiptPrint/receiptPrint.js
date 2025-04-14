export default {
    name: 'receiptPrint',
    data() {
        return {
            printData: {
                switchAll: true,
                printList: [
                    {
                        id: '001',
                        name: '小票打印机'
                    }
                ],
                printNumber: 2,
                cashBoxSwitch: false,
                fontSwitch: false,
                sizeSelected: '',
                sizeList: [
                    {
                        id: '0001',
                        name: '58mm'
                    },
                    {
                        id: '0002',
                        name: '80mm'
                    },
                    {
                        id: '0003',
                        name: '110mm'
                    },
                    {
                        id: '0004',
                        name: '210mm'
                    }
                ]
            },
            checkPrint: '',
            // 以下是设置小票打印中的参数
            showSetting: false,
        }
    },
    watch: {
    },
    computed: {
        
    },
    mounted() {
        
    },
    methods: {
        
    }
}