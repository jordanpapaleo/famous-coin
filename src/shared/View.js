import {components, core} from 'famous';

export class View {
    constructor(options) {
        options = options || {};
        this.node       = options.node;
        this.model      = options.model || {};
        this.align      = new components.Align(this.node);
        this.mountPoint = new components.MountPoint(this.node);
        this.origin     = new components.Origin(this.node);
        this.opacity    = new components.Opacity(this.node);
        this.position   = new components.Position(this.node);
        this.rotation   = new components.Rotation(this.node);
        this.scale      = new components.Scale(this.node);
        this.size       = new components.Size(this.node);

        this.setProperties();
    }

    // Takes 1 - 3 arrays
    // ex: this.setSize(['relative', 1], ['relative', .5]);
    setSize() {
        let sizeMode = [];
        let absoluteSizes = [];
        let proportionalSizes = [];
        let renderSizes = [];

        for(let i = 0, j = arguments.length; i < j; i++) {
            if(!i instanceof Array) {
                break;
            }

            let sizing = arguments[i];

            switch (sizing[0]) {
                case 'relative':
                    sizeMode.push(core.Node.RELATIVE_SIZE);
                    proportionalSizes.push(sizing[1]);
                    absoluteSizes.push(undefined);
                    renderSizes.push(undefined);
                    break;
                case 'absolute':
                    sizeMode.push(core.Node.ABSOLUTE_SIZE);
                    proportionalSizes.push(undefined);
                    absoluteSizes.push(sizing[1]);
                    renderSizes.push(undefined);
                    break;
                case 'render':
                    sizeMode.push(core.Node.RENDER_SIZE);
                    proportionalSizes.push(undefined);
                    absoluteSizes.push(undefined);
                    renderSizes.push(sizing[1]);
                    break;
                default:
                    break;
            }
        }

        this.size.setMode.apply(this.size, sizeMode);
        this.size.setProportional.apply(this.size, proportionalSizes);
        this.size.setAbsolute.apply(this.size, absoluteSizes);
    }

    setProperties() {
        //Override
    }
}
