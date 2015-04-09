import {components, domRenderables} from 'famous';

export class View {
    constructor(options) {
        options = options || {};
        this.node = options.node;
        this.model = options.model;
        this.dispatch = this.node.getDispatch();

        this.align = new components.Align(this.dispatch);
        this.mountPoint = new components.MountPoint(this.dispatch);
        this.opacity = new components.Opacity(this.dispatch);
        this.origin = new components.Origin(this.dispatch);
        this.position = new components.Position(this.dispatch);
        this.rotation = new components.Rotation(this.dispatch);
        this.scale = new components.Scale(this.dispatch);
        this.size = new components.Size(this.dispatch);
        this.el = new domRenderables.HTMLElement(this.dispatch, options.tagName);

        this.pre();
        this.setProperties();
        this.render();
        this.setEvents();
        this.post();
    }

    pre() {
        //Used to be a pre launching point
    }

    render() {
        // Each class will implement differently
    }

    setProperties() {
        // Each class will implement differently
    }

    setEvents() {
        // Each class will implement differently
    }

    post() {
        //Used to be a post launching point
    }

    onCustomEvent(evName, fn) {
        if(!this.eventHandler) this.eventHandler = new EventHandler(this.dispatch);
        this.eventHandler.on(evName, fn);
    }

    onDomEvent(evName, methods, properties, fn) {
        var i;
        if(!this.el) this.el = new HTMLElement(this.dispatch);
        if(properties instanceof Array) {
            if(!(evName instanceof Array)) evName = [evName];
            for(i = 0; i < evName.length; i++) {
                this.el.on(evName[i], methods, properties);
                this.dispatch.registerTargetedEvent(evName[i], fn);
            }
        } else {
            if(!(evName instanceof Array)) evName = [evName];
            for(i = 0; i < evName.length; i++) {
                this.el.on(evName[i], methods);
                this.dispatch.registerTargetedEvent(evName[i], properties);
            }
        }
    }
}
