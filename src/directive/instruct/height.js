import utils from '@/utils/utils.js'
const height = {
    inserted(el) {
        let parentHeight = el.parentNode.offsetHeight;
        let clientHeight = el.clientHeight;
        let cut_height = el.getAttribute('cut_height');
        cut_height = utils.isNull(cut_height) ? 0 : parseInt(cut_height);
        let Height = parentHeight - cut_height;
        let currHig = Height > clientHeight ? 'auto' : Height+'px';
        el.style.height = currHig;
    },
};
export default height;