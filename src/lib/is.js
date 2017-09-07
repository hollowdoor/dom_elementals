import isObject from 'isobject';
export { isObject };
//No such module
export function isDocumentFragment(v){
    return (v + '') === '[object DocumentFragment]';
}

export function isElemental(v){
    return isDocumentFragment(v) || isElement(v);
}

//isElement exists as a module, but it's not viable
export function isElement(input) {

  return (input != null)
    && (typeof input === 'object')
    && (input.nodeType === Node.ELEMENT_NODE)
    && (typeof input.style === 'object')
    && (typeof input.ownerDocument === 'object');
}

export function isDate(v){
    return Object.prototype.toString.call(v) === '[object Date]';
}
