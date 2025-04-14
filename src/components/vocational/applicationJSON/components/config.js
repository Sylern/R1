
// typeID
const ID_TEXT = 0 //单行文本组件ID
const ID_DATE = 1 //日期文本组件ID
const ID_NUMBER = 2 //数字文本组件ID
const ID_IDCARD = 5 //身份证组件ID

const ID_MEMBER_DATE = 3
const ID_MEMBER_SEX = 4


let config = {
    [ID_TEXT]: { viewName: "dcText", editName: 'dcTextEdit', icon: "icon-wenben", name: "文本",size:32 },
    [ID_DATE]: { viewName: "dcDate", editName: 'dcDateEdit', icon: "icon-rili", name: "日期",size:28 },
    [ID_NUMBER]: { viewName: "dcNumber", editName: 'dcNumberEdit', icon: "icon-shuzi", name: "数字",size:32 },
    [ID_MEMBER_DATE]: { viewName: "dcMemberDate", editName: 'dcMemberDateEdit', icon: "icon-shengrix", name: "生日",size:32},
    [ID_MEMBER_SEX]: { viewName: "dcMemberSex", editName: 'dcMemberSexEdit', icon: "icon-xingbie", name: "性别",size:32 },
    [ID_IDCARD]: { viewName: "dcIdCard", editName: 'dcIdCardEdit', icon: "icon-IDcard", name: "身份证",size:32 }
}

const fmtProps = (typeId) => ({
    placeholder: { type: String, default: typeId === ID_DATE || typeId === ID_MEMBER_DATE || typeId === ID_MEMBER_SEX ? `请选择${config[typeId].name}` : `请输入${config[typeId].name}` },
    value: { type: String, default: "" },
    label: { type: String, default: config[typeId].name },
    required: { type: Boolean, default: true }
})
config[ID_TEXT] = { ...config[ID_TEXT], ...{ props: { props: fmtProps(ID_TEXT) } } }
config[ID_DATE] = {
    ...config[ID_DATE],
    ...{
        props: {
            props: {
                ...fmtProps(ID_DATE),
                ...{ today: { type: Boolean, default: false }, start: { type: String, default: "" }, end: { type: String, default: "" } }
            }
        }
    }
}
config[ID_NUMBER] = { ...config[ID_NUMBER], ...{ props: { props: fmtProps(ID_NUMBER) } } }
config[ID_IDCARD] = { ...config[ID_IDCARD], ...{ props: { props: fmtProps(ID_IDCARD) } } }

config[ID_MEMBER_DATE] = {
    ...config[ID_MEMBER_DATE],
    ...{
        props: {
            props: { ...fmtProps(ID_MEMBER_DATE), ...{ today: { type: Boolean, default: false } } }
        }
    }
}
config[ID_MEMBER_SEX] = { ...config[ID_MEMBER_SEX], ...{ props: { props: fmtProps(ID_MEMBER_SEX) } } }

export {
    ID_DATE,
    ID_TEXT,
    ID_NUMBER,
    ID_MEMBER_DATE,
    ID_MEMBER_SEX,
    ID_IDCARD
}

export default config