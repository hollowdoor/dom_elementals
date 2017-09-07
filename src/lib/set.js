import camelcase from 'camelcase';

export function setData(el, data){
    if(!el.dataset) return;
    Object.keys(data).forEach(
        key=>el.dataset[camelcase(key)] = data[key]
    );
    return el;
}

export function setAttributes(el, attributes){
    if(!el.setAttribute) return;
    if([3, //text
        8, //comment
        2  //attribute
    ].indexOf(el.nodeType) !== -1) return;

    Object.keys(attributes).forEach(key=>{
        el.setAttribute(key, attributes[key] + '');
    });
    return el;
}

export function setStyles(el, styles){
    let allstyles = window.getComputedStyle(el);
    if(!el.style) return;
    Object.keys(styles).forEach(key=>{
        if(allstyles[key] === void 0){
            el.style.setProperty(
                '--'+decamelize(key, '-'),
                styles[key] + ''
            );
            return;
        }
        el.style[camelcase(key)] = styles[key] + '';
    });
}
