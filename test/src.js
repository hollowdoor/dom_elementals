import { toElement } from '../';

insert(toElement(`<p>Hello</p>`));

insert(toElement(create('p', 'World')));
insert(toElement`<p>${'!'}</p>`);
insert(toElement`<div>${create('p', 'Hello')}</div>`);
insert(
    toElement([
        '<p>one</p>',
        '<p>two</p>',
        create('p', 'three')
    ])
);

insert(
    toElement({
        tag: 'input',
        value: "I'm an input",
        style: {color: 'blue'}
    })
);

insert(
    toElement({
        tag: 'ol',
        children: [
            '<li>one</li>',
            '<li>two</li>',
            create('li', 'three')
        ],
        attributes: {
            "some-attr": "200"
        },
        data: {
            'value': "I'm a value"
        },
        value: "I'm an input"
    })
);

insert(toElement(new Date(Date.now())));

insert(
    toElement({
        tag: 'pre',
        children: [
            toElement({
                things: ['thing 1', 'thing 2'],
                time: new Date(Date.now())
            })
        ]
    })
);

insert(
    toElement({
        tag: 'pre',
        children: [
            toElement(new (function struct(){
                this.things = ['thing 0'];
                this.method = function(){};
                this.time = new Date(Date.now());
            })())
        ]
    })
);


function create(type, content){
    let e = document.createElement(type);
    e.textContent = content;
    return e;
}

function insert(e){
    document.body.appendChild(e);
}
