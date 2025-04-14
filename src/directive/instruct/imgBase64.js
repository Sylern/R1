const base64 = {
    inserted(el, { value }) {
        let img = img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = value;
        img.onload = () => {
            let canvas = document.createElement('CANVAS');
            canvas.height = img.height;
            canvas.width = img.width;
            let ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            el.src = canvas.toDataURL();
            el.setAttribute('data-src', value);
        };
    },
    update(el, binding) {
        let { value, oldValue } = binding;
        if (value !== oldValue) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = value;
            img.onload = () => {
                let canvas = document.createElement('CANVAS');
                canvas.height = img.height;
                canvas.width = img.width;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                el.src = canvas.toDataURL();
                el.setAttribute('data-src', value);
            };
        }
    }

};
export default base64;