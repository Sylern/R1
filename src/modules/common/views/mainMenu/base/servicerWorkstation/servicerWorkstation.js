import { stockApi } from "@/api/index.js";
import { mapState } from "vuex";
export default {
    name: 'servicerWorkstation',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        isOrderList: {
            type: Boolean,
            default: false
        },
        orderData: {
            type: Object,
            default: () => {
                return {
                    productResults: []
                }
            }
        },
        carttingPos: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            imgBase: stockApi.imgBase(),
            selectType: [
                ['type1', 'type2', 'type3', 'type4'],
                ['type1', 'type2', 'type3', 'type4'],
                ['type1', 'type2', 'type3', 'type4']
            ],
            workstationEdit: {
                type1: false,
                type2: false,
                type3: false
            },
            workstationEmployeeList: [
                [], [], []
            ],
        }
    },
    computed: {
        ...mapState(['storeEmployeeList', 'carttingData']),
        dialogVisible: {
            get() { return this.visible; }, set(value) {
                value = value === 'close' ? false : value;
                this.$emit('update:visible', value);
            }
        },
        productResults() {
            return this.isOrderList ? this.orderData.productResults : this.carttingData.productResults
        },
    },
    watch: {
        dialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    let employeeList = []
                    this.storeEmployeeList.forEach(item => {
                        employeeList = employeeList.concat(item.list);
                    });
                    this.selectType = [
                        ['type1', 'type2', 'type3', 'type4'],
                        ['type1', 'type2', 'type3', 'type4'],
                        ['type1', 'type2', 'type3', 'type4']
                    ];
                    const currentEmployeeData = this.isOrderList ? { employeeList: [] } : this.carttingData.productResults[this.carttingPos].multCommissions;
                    this.workstationEmployeeList = [
                        [...employeeList.map(e => {
                            const setedItem = currentEmployeeData.length > 0 ? currentEmployeeData[0].find(sItem => sItem.sv_employee_id === e.sv_employee_id) : null;
                            if (setedItem) this.selectType[0].remove(setedItem.selectedType);
                            return {
                                ...e,
                                percent: setedItem ? setedItem.percent : 0,
                                percentValue: setedItem ? setedItem.percentValue : 0,
                                selectedType: setedItem ? setedItem.selectedType : '',
                                isSelected: setedItem ? true : false,
                                isAppoint: setedItem ? setedItem.isAppoint : '',
                                isLocked: setedItem ? setedItem.isLocked : false
                            }
                        })],
                        [...employeeList.map(e => {
                            const setedItem = currentEmployeeData.length > 1 ? currentEmployeeData[1].find(sItem => sItem.sv_employee_id === e.sv_employee_id) : null;
                            if (setedItem) this.selectType[1].remove(setedItem.selectedType);
                            return {
                                ...e,
                                percent: setedItem ? setedItem.percent : 0,
                                percentValue: setedItem ? setedItem.percentValue : 0,
                                selectedType: setedItem ? setedItem.selectedType : '',
                                isSelected: setedItem ? true : false,
                                isAppoint: setedItem ? setedItem.isAppoint : '',
                                isLocked: setedItem ? setedItem.isLocked : false
                            }
                        })],
                        [...employeeList.map(e => {
                            const setedItem = currentEmployeeData.length > 2 ? currentEmployeeData[2].find(sItem => sItem.sv_employee_id === e.sv_employee_id) : null;
                            if (setedItem) this.selectType[2].remove(setedItem.selectedType);
                            return {
                                ...e,
                                percent: setedItem ? setedItem.percent : 0,
                                percentValue: setedItem ? setedItem.percentValue : 0,
                                selectedType: setedItem ? setedItem.selectedType : '',
                                isSelected: setedItem ? true : false,
                                isAppoint: setedItem ? setedItem.isAppoint : '',
                                isLocked: setedItem ? setedItem.isLocked : false
                            }
                        })]
                    ]
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        closeDialog() {
            this.dialogVisible = 'close';
        },
        handleEditSwitch(index) {
            this.workstationEdit['type' + (index + 1)] = this.workstationEdit['type' + (index + 1)] ? false : true;
        },
        handleEmployeeIndex($event, item, workstationIndex) {
            if (item.inputLocked) return;
            item.percent = parseInt($event.offsetX * 100 / $event.target.clientWidth);
            item.isLocked = true;
            if (item.percent > item.max) item.percent = item.max;
            this.handleSetPercent(workstationIndex);
        },
        handleSliderChange(item, workstationIndex) {
            item.isLocked = true;
            if (item.percent > item.max) item.percent = item.max;
            this.handleSetPercent(workstationIndex);
        },
        handlePercentInput(event, item, workstationIndex) {
            let value = this.$app.verifyNumber(event) || 0;
            item.percent = parseInt(value) > 100 ? 100 : parseInt(item.percent);
            item.percent = item.percent > item.max ? item.max : item.percent;
            item.percent = item.percent || 0;
            item.isLocked = true;
            this.handleSetPercent(workstationIndex);
        },

        handlePercentValueChange(event, item, workstationIndex) {
            let value = this.$app.verifyDecimal(event, 2) || 0;

            const dealMoney = this.productResults[this.carttingPos].dealMoney;
            let currentWorkstationList = this.workstationEmployeeList[workstationIndex];
            let selectedList = currentWorkstationList.filter(e => e.isSelected);
            let lockedPercentValue = 0;
            let lastUnlockedPercent = 100;
            selectedList.forEach(data => {
                if (data.isLocked && data.sv_employee_id !== item.sv_employee_id) {
                    lockedPercentValue = this.$app.addNumber(lockedPercentValue, parseFloat(data.percentValue));
                    lastUnlockedPercent = this.$app.subtractNumber(lastUnlockedPercent, parseInt(data.percent));
                }
            });
            let maxValue = this.$app.subtractNumber(dealMoney, lockedPercentValue);
            item.percentValue = parseFloat(value) > parseFloat(maxValue) ? parseFloat(maxValue) : parseFloat(value);
            item.percentValue = item.percentValue || 0;
            item.percent = parseInt(this.$app.divideNumber(item.percentValue * 100, dealMoney));
            lockedPercentValue = this.$app.addNumber(lockedPercentValue, item.percentValue);
            lastUnlockedPercent = this.$app.subtractNumber(lastUnlockedPercent, item.percent);
            item.isLocked = true;

            this.$nextTick(() => {
                let unLockedList = selectedList.filter(e => !e.isLocked);
                let lastUnlockedValue = this.$app.subtractNumber(dealMoney, lockedPercentValue);
                const surplusEveryValue = this.$app.divideNumber(this.$app.subtractNumber(dealMoney, lockedPercentValue), unLockedList.length);
                unLockedList.forEach((data, index) => {
                    if (index !== unLockedList.length - 1) {
                        data.percentValue = surplusEveryValue;
                        lastUnlockedValue = this.$app.subtractNumber(lastUnlockedValue, surplusEveryValue);
                        data.percent = parseInt(this.$app.divideNumber(data.percentValue * 100, dealMoney));
                        lastUnlockedPercent -= data.percent;
                    } else {
                        data.percentValue = lastUnlockedValue;
                        data.percent = lastUnlockedPercent;
                    }
                })
                this.$set(this.workstationEmployeeList, workstationIndex, currentWorkstationList);
            });
        },

        handleSetPercent(workstationIndex) {
            const dealMoney = this.productResults[this.carttingPos].dealMoney;
            let currentWorkstationList = this.workstationEmployeeList[workstationIndex];
            let selectedList = currentWorkstationList.filter(e => e.isSelected);
            let unLockedList = selectedList.filter(e => !e.isLocked);
            let lockedPercent = 0;
            let lastSelectedId = null;
            selectedList.forEach((item, index) => {
                if (index === selectedList.length - 1) {
                    lastSelectedId = item.sv_employee_id;
                }
                item.isLocked && (lockedPercent += item.percent)
            });
            let unLockedPercent = 100 - lockedPercent;
            let lastUnlockedPercent = 100 - lockedPercent;
            let lastUnlockedId = null;
            const surplusEvery = parseInt((100 - lockedPercent) / unLockedList.length);
            unLockedList.forEach((item, index) => {
                if (index !== unLockedList.length - 1 && unLockedList.length > 1) {
                    lastUnlockedId = item.sv_employee_id;
                    lastUnlockedPercent = lastUnlockedPercent - surplusEvery;
                }
            })
            let percentValueExcludeLast = 0;
            currentWorkstationList = currentWorkstationList.map(e => {
                const max = !e.isSelected ? 0 : e.isLocked ? (unLockedPercent + e.percent) : unLockedPercent;
                const percent = !e.isSelected ? 0 : e.isLocked ? e.percent : (lastUnlockedId === e.sv_employee_id ? lastUnlockedPercent : surplusEvery);
                const percentValue = lastSelectedId === e.sv_employee_id && selectedList.length > 1 ? this.$app.subtractNumber(dealMoney, percentValueExcludeLast) : this.$app.multiplyNumber(percent / 100, dealMoney);
                if (lastSelectedId !== e.sv_employee_id) percentValueExcludeLast += percentValue;
                return {
                    ...e,
                    max,
                    percent,
                    isAppoint: e.isAppoint || false,
                    percentValue: this.$app.moneyFixed(percentValue, 1)
                }
            });
            this.$set(this.workstationEmployeeList, workstationIndex, currentWorkstationList);
        },
        currentSelect(workstationIndex, sv_employee_id) {
            return this.workstationEmployeeList[workstationIndex].find(e => e.sv_employee_id === sv_employee_id)
        },
        handleDeleteSelected(item, index) {                 // 删除当前所选员工
            item.isSelected = false;
            item.percent = 0;
            item.isLocked = false;
            this.selectType[index].unshift(item.selectedType);
            this.handleSetPercent(index);
        },
        handleEmployeeItem(item, index) {                   // 选择员工
            let currentSelectedList = this.workstationEmployeeList[index].filter(e => e.isSelected);
            if (currentSelectedList.length === 4) return this.$message.warning('当前工位已选择 4 位员工，请删除后再选择');
            item.isSelected = true;
            item.selectedType = this.selectType[index][0];
            this.selectType[index].shift();
            this.handleSetPercent(index);
        },
        handleClear() {                                     // 清空已选员工
            this.$confirm('是否要清空已选员工？').then(_ => {
                this.workstationEmployeeList.forEach(pItem => {
                    pItem.forEach(item => {
                        item.isSelected = false;
                        item.percent = 0;
                        item.isLocked = false;
                    })
                });
                this.selectType = [
                    ['type1', 'type2', 'type3', 'type4'],
                    ['type1', 'type2', 'type3', 'type4'],
                    ['type1', 'type2', 'type3', 'type4']
                ]
            }).catch(_ => {

            });
        },
        handleSure() {
            this.closeDialog();
            if (this.isOrderList) {
                const data = this.workstationEmployeeList.map(pItem => {
                    return pItem.filter(item => item.isSelected)
                });
                this.$emit('handleWorkstation', data);
            } else {
                this.carttingData.productResults[this.carttingPos].multCommissions = this.workstationEmployeeList.map(pItem => {
                    return pItem.filter(item => item.isSelected)
                });
                this.$emit('handleWorkstation');
            }
        },
    }
};