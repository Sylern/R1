import TicketGroupDiy from '../ticketGroupDiy/ticketGroupDiy.vue'

export default {
    // import引入的组件需要注入到对象中才能使用
    components: {
        TicketGroupDiy: TicketGroupDiy
    },
    props: [
        'itemList',
        'ticket',
        'itemType',
        'activeItem',
        'ticketSizeActive'
    ],
    data() {
        return {
        }
    },
    methods: {
        changeActiveItem(tab, event) {
            // this.activeItem =
            this.$emit('changeActiveItem', tab.label)
        }
    }
}
