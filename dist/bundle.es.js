import isArrayLike from 'is-array-like';
import arrayFrom from 'array-from';
import camelcase from 'camelcase';
import isObject from 'isobject';

//No such module
function isDocumentFragment(v){
    return (v + '') === '[object DocumentFragment]';
}

function isElemental(v){
    return isDocumentFragment(v) || isElement(v);
}

//isElement exists as a module, but it's not viable
function isElement(input) {

  return (input != null)
    && (typeof input === 'object')
    && (input.nodeType === Node.ELEMENT_NODE)
    && (typeof input.style === 'object')
    && (typeof input.ownerDocument === 'object');
}

function isDate(v){
    return Object.prototype.toString.call(v) === '[object Date]';
}

function toHTML(){
    var values = [], len = arguments.length;
    while ( len-- ) values[ len ] = arguments[ len ];


    return values.map(function (v){
        if(v === void 0) { return ''; }

        if(isObject(v) && v.hasOwnProperty('element')){
            v = v.element;
        }

        if(typeof v === 'string'){
            return v;
        }

        if(isElement(v)){
            return v.outerHTML;
        }else if(isDocumentFragment(v)){
            var d = document.createElement('div');
            d.appendChild(v.cloneNode(true));
            return d.innerHTML;
        }
    }).join('');
}

function stringToFragment(str){
    var d = document.createElement('div');
    //A fragment allows a single source of entry
    //to multiple children without a parent
    var frag = document.createDocumentFragment();
    //NOTE: Nested paragraph tags get screwed up in innerHTML.
    //This also happens with other certain mixes of tags.
    d.innerHTML = str;
    while(d.firstChild){
        frag.appendChild(d.firstChild);
    }
    return frag;
}

function stringToElement(str){
    var frag = stringToFragment(str);
    //Sometimes we can get away with a single child
    if(frag.children.length === 1){
        return frag.removeChild(frag.firstChild);
    }
    return frag;
}

var localeOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
};

var language = window.navigator.userLanguage
|| window.navigator.language;

function toLocaleString(v){
    try{
        return v.toLocaleString(
            language,
            localeOptions
        );
    }catch(e){
        return v + '';
    }
}

function objectToString(v){
    var str = '';
    if(isDate(v)){
        //Make it pretty when the date is a lone value
        return toLocaleString(v);
    }

    if(v.constructor === Object){
        //Let Date be the ISO standard for JSON objects
        try{
            return JSON.stringify(v, null, 2);
        }catch(e){}
    }
    //All other objects are toStringed
    //This way user space toString is considered
    return v + '';
}

function setData(el, data){
    if(!el.dataset) { return; }
    Object.keys(data).forEach(
        function (key){ return el.dataset[camelcase(key)] = data[key]; }
    );
    return el;
}

function setAttributes(el, attributes){
    if(!el.setAttribute) { return; }
    if([3, //text
        8, //comment
        2  //attribute
    ].indexOf(el.nodeType) !== -1) { return; }

    Object.keys(attributes).forEach(function (key){
        el.setAttribute(key, attributes[key] + '');
    });
    return el;
}

function setStyles(el, styles){
    var allstyles = window.getComputedStyle(el);
    if(!el.style) { return; }
    Object.keys(styles).forEach(function (key){
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

//import isObject from 'isobject';
function toElement(v){
    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];


    if(typeof v !== 'string' && isArrayLike(v)){

        v = arrayFrom(v);

        if(values.length){
            var html = v.reduce(function (html, str, i){
                return html + str + toHTML(values[i]);
            }, '');
            return convert(html);
        }

        return v.reduce(function (frag, value){
            frag.appendChild(convert(value));
            return frag;
        }, document.createDocumentFragment());

    }

    return convert(v);
}

function convert(v){

    if(isObject(v)){
        if(v.hasOwnProperty('element')) { v = v.element; }

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
        var el = document.querySelector(v);
        if(el) { return el; }
    }catch(e){}

    return stringToElement(v);
}


function objectToDOM(obj){

    var el, parentNode = null, keys = Object.keys(obj), index;

    var hadKey = function (key){
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

    keys.forEach(function (key){
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
    arrayFrom(children).forEach(function (child){
        el.appendChild(toElement(child));
    });
    return el;
}

export { toHTML, toElement, convert, objectToDOM };
//# sourceMappingURL=bundle.es.js.map
