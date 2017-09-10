dom-elementals
=============

Install
------

`npm install --save dom-elementals`

About
----

It's kind of complicated. Let's say it's about making some certain things easier when it comes to browser DOM.

toElement()
-----------

```javascript
import { toElement } from 'dom-elementals';
```

`toElement` is the most important thing. It has an extremely overloaded API.

### toElement(selector) -> selected element

Simply select a single element from the DOM. This is equivalent to `document.querySelector()`.

### toElement(html string) -> new element

Create a DOM element, or DOM DocumentFragment from an html string.

If there are multiple elements in the top level `toElement()` returns a DocumentFragment. If there is one top level element `toElement()` will return the DOM element version of that.


### toElement(element|fragment) -> element|fragment

If you pass an element, or a DocumentFragment to `toElement()` you get it back unaltered. This is for composability purposes.

### toElement(array) -> fragment

**Warning: Infinite circular recursion possible.**

Pass an array to `toElement()`, and it will iterate over that array making elements out of the array values. All array values can be something `toElement()` accepts. All new elements are combined into a DocumentFragment.


### toElement(object) -> new element

**Warning: Infinite circular recursion possible.**

Pass an object with an `element` property. That element property will be turned into the element returned by `toElement()`.

Or pass an object like this:

```javascript
//Create an element
let element = toElement({
    //The tag property is the only required property
    //Here we create a paragraph element
    //tag is equivalent to element.tagName.toLowerCase()
    "tag": "p",
    //Properties in general are set on element
    //All properties that belong to DOM elements are acceptable
    "id": "first-name",
    "textContent": "Tabitha",
    "className": "paragraph-name",
    //Add attributes
    //Just like element.setAttribute(name, value)
    "attributes": {

    },
    //These children will be appended to the element
    "children": [
        //toElement(children[index]) will convert each child
    ],
    //Set element.dataset values
    //To set data-* attributes you might need a polyfill
    "data": {
        "value": 1,
        //Use camelcase, or dash case
        "other-value": 2,
        "camelValue": 3
    },
    //The parent to append element to.
    //This is passed to toElement() as well.
    "parent": "#parent-id-selector",
    //Set the first html of the element
    "head": "<h2>I'm set before anything else</h2>",
    //Set the last html of the element
    "foot": "<footer>I'm set after everything else</footer>",
    //Set styles
    "style": {
        "color": "blue"
    }
});
```

Create a simple input while setting the value.

```javascript
let input = toElement({
    tag: 'input',
    value: "I'm a value"
});
```

### toElement(strings, ...values) -> new element

This is an interface to template literals. All `values` are converted to javascript primitive values (string, number, ...)--even the elements.

You can use it directly:

```javascript
let value = 'Hello Universe!';
let element = toElement`<p>${value}</p>`;
```

Or indirectly:

```javascript
function createElement(strings, ...values){
    return toElement(strings, ...values);
}
let value = 'Hello Cosmos!';
let element = createElement`<p>${value}</p>`;
```

toHTML()
-------

```javascript
import { toHTML } from 'dom-elementals';
```

`toHTML(value)` can except these values:

* DOM element
* object with an element property
* DocumentFragment

arrayFrom()
---------

`arrayFrom(arrayLike)` is not really a DOM specific thing, but conversion of array like objects is so common it is included.

setAttributes()
---------

`setAttributes(element, object)` is used to set all the attributes of a given `object` on to the `element`.

isElement()
---------

`isElement(value)` returns true if `value` is an element.
