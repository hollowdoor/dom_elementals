import isArrayLike from 'is-array-like';
import arrayFrom from 'array-from';
//import isObject from 'isobject';
import camelcase from 'camelcase';
import {
    stringToElement, toHTML, objectToString
} from './conversion.js';
import {
    setData, setAttributes, setStyles
} from './set.js';
import {
    isObject, isDocumentFragment, isElement, isElemental
} from './is.js';

export { toHTML, arrayFrom, setAttributes, isElement };

export function toElement(v, ...values){

    if(typeof v !== 'string' && isArrayLike(v)){

        v = arrayFrom(v);

        if(values.length){
            let html = v.reduce((html, str, i)=>{
                return html + str + toHTML(values[i]);
            }, '');
            return convert(html);
        }

        return v.reduce((frag, value)=>{
            frag.appendChild(convert(value));
            return frag;
        }, document.createDocumentFragment());

    }

    return convert(v);
}

export function convert(v){

    if(isObject(v)){
        if(v.hasOwnProperty('element')) v = v.element;

        if(isObject(v)){
            if(isElemental(v) || v === document){
                return v;
            }

            if(v.hasOwnProperty('tag')){
                return objectToDOM(v);
            }

            v = objectToString(v);
        }
    }

    try{
        let el = document.querySelector(v);
        if(el) return el;
    }catch(e){}

    return stringToElement(v);
}


export function objectToDOM(obj){

    let el, parentNode = null, keys = Object.keys(obj), index;

    const hadKey = key=>{
        if((index = keys.indexOf(key + '')) !== -1){
            keys.splice(index, 1);
            return true;
        }
        return false;
    };

    if(hadKey('tag')){
        el = document.createElement(obj.tag.toLowerCase());
    }else{
        throw new Error('obj must have a "tag" property with a DOM tag name');
    }

    if(hadKey('attributes') && isObject(obj.attributes)){
        setAttributes(el, obj.attributes);
    }

    if(hadKey('data') && isObject(obj.data)){
        setData(el, obj.data);
    }

    if(hadKey('innerHTML')){
        el.innerHTML = toHTML(obj.innerHTML);
    }

    if(hadKey('head')){
        el.appendChild(toElement(obj.head));
    }

    if(hadKey('children') && isArrayLike(obj.children)){
        appendChildren(el, obj.children);
    }

    if(hadKey('foot')){
        el.appendChild(toElement(obj.foot));
    }

    if(hadKey('style') && isObject(obj.style)){
        setStyles(el, obj.style);
    }

    if(hadKey('parent')){
        parentNode = toElement(obj.parent);
    }

    keys.forEach(key=>{
        if(obj[key] !== 'function' && !isObject(obj[key])){
            el[key] = obj[key];
        }
    });

    if(parentNode){
        parentNode.appendChild(el);
    }

    return el;
}



function appendChildren(el, children){
    arrayFrom(children).forEach(child=>{
        el.appendChild(toElement(child));
    });
    return el;
}
