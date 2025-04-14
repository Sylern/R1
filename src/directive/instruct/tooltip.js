export default {
    inserted(el) {
        const curStyle = window.getComputedStyle(el, '');
        const textSpan = document.createElement('span');
        textSpan.style.fontSize = curStyle.fontSize;
        textSpan.style.fontWeight = curStyle.fontWeight;
        textSpan.style.fontFamily = curStyle.fontFamily;
        document.body.appendChild(textSpan);
        textSpan.innerHTML = el.innerText;
        if (textSpan.offsetWidth > el.offsetWidth) {
            // 给当前元素设置超出隐藏
            el.style.overflow = 'hidden';
            el.style.textOverflow = 'ellipsis';
            el.style.whiteSpace = 'nowrap';

            el.onmouseenter = (e) => {
                const kxmTooltipDom = document.createElement('div');

                const left = el.getBoundingClientRect().left - Math.ceil(el.offsetWidth / 2);

                const top = el.getBoundingClientRect().top + el.offsetHeight + 10;
                kxmTooltipDom.style.cssText = `
                    top: ${top}px;
                    left: ${left}px;
	            `;
                kxmTooltipDom.setAttribute('id', 'kxm-tooltip');
                document.body.appendChild(kxmTooltipDom);
                document.getElementById('kxm-tooltip').innerHTML = `
                <div class="kxm-tooltip-arrow"></div>
                <span>${el.innerText}</span>
            `;
            }
            el.onmouseleave = () => {
                const kxmTooltipDom = document.getElementById('kxm-tooltip');
                kxmTooltipDom && document.body.removeChild(kxmTooltipDom);
            }
        }
        document.body.removeChild(textSpan);
    },
    // 指令与元素解绑时
    unbind() {
        const kxmTooltipDom = document.getElementById('kxm-tooltip');
        kxmTooltipDom && document.body.removeChild(kxmTooltipDom);
    }
}