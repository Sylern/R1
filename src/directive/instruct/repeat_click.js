const repeatClick = {
    inserted(el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true;
                let classStyle = el.className;
                el.setAttribute('class', classStyle + ' is-disabled');
                setTimeout(() => { el.disabled = false; el.setAttribute('class', classStyle); }, binding.value || 3000);
            }
        })
    },

};
export default repeatClick;