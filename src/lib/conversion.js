import { isObject, isElement, isDocumentFragment, isDate } from './is.js';

export function toHTML(...values){

    return values.map(v=>{
        if(v === void 0) return '';

        if(isObject(v) && v.hasOwnProperty('element')){
            v = v.element;
        }

        if(typeof v === 'string'){
            return v;
        }

        if(isElement(v)){
            return v.outerHTML;
        }else if(isDocumentFragment(v)){
            let d = document.createElement('div');
            d.appendChild(v.cloneNode(true));
            return d.innerHTML;
        }
    }).join('');
}

export function stringToFragment(str){
    let d = document.createElement('div');
    //A fragment allows a single source of entry
    //to multiple children without a parent
    let frag = document.createDocumentFragment();
    //NOTE: Nested paragraph tags get screwed up in innerHTML.
    //This also happens with other certain mixes of tags.
    d.innerHTML = str;
    while(d.firstChild){
        frag.appendChild(d.firstChild);
    }
    return frag;
}

export function stringToElement(str){
    let frag = stringToFragment(str);
    //Sometimes we can get away with a single child
    if(frag.children.length === 1){
        return frag.removeChild(frag.firstChild);
    }
    return frag;
}

const localeOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
};

const language = window.navigator.userLanguage
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

export function objectToString(v){
    let str = '';
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
