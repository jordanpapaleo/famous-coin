import {components, domRenderables} from 'famous';
import {View} from '../shared/View';
import UI from '../utils/UI';

export class DomView extends View {
    constructor(options) {
        options = options || {};

        super(options);

        options.tagName = (options.hasOwnProperty('tagName')) ? options.tagName : 'div';

        this.el = new domRenderables.DOMElement(this.node, {
            tagName: options.tagName,
            properties: options.styles || {}
        });

        if(options.content) {
            this.el.setContent(options.content);
        }

        this.preRender();
        this.render();
        this.postRender();
    }

    preRender() { }

    render() { }

    postRender() { }

    on(events, cb) {
        if(!this.eventHandler) {
            this.eventHandler = new components.EventHandler(this.node);
        }

        if(typeof events === 'string') {
            events = [events];
        }

        const dragEvents  = ['drag', 'dragdrop', 'dragend', 'dragenter', 'dragexit', 'draggesture', 'dragleave', 'dragover', 'dragstart', 'drop'];
        const focusEvents = ['blur, change', 'focus', 'focusin', 'focusout'];
        const formEvents  = ['reset', 'submit'];
        const inputEvents = ['click', 'dblclick', 'keydown', 'keypress', 'keyup', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'wheel'];
        const touchEvents = ['touchcancel', 'touchend', 'touchenter', 'touchleave', 'touchmove', 'touchstart'];

        const domEvents = dragEvents.concat(focusEvents).concat(formEvents).concat(inputEvents).concat(touchEvents);

        for(let i = 0, j = events.length; i < j; i++) {
            let evt = events[i];

            if(domEvents.indexOf(evt) === -1) {
                this._onGlobalEvent(evt, cb);
            } else {
                this._onDomEvent(evt, cb);
            }
        }
    }

    _onGlobalEvent(evt, cb) {
        this.eventHandler.on(evt, cb);
    }

    _onDomEvent(evt, cb) {
        this.el.onAddUIEvent(evt);
        this.el.on(evt, cb);
    }

    setStyle(properties) {
        properties = properties || {};
        UI.setStyle(this, properties);
    }
}
