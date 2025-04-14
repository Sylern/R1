export default {
  namespaced: true,
  state: {
    CashierManage: {},                // 收银权限
    SalesReport: {},                  // 账单权限
  },
  getters: {

  },
  mutations: {
    setPermission(state, obj) {
      state[obj.key] = obj.data;
    }
  },
  actions: {

  },
}
