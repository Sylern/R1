"use strict";
import myTable from './lib/myTable';
import myTableCell from './lib/myTableCell';
const Page = {
    install: function (Vue, options) {
        Vue.component(myTable.name, myTable);
        Vue.component(myTableCell.name, myTableCell);
    }
};


if (typeof window !== 'undefined' && window.Vue) { window.Vue.use(Page); }

export default Page;