import View from 'famous-creative/display/View';

const Curves = FamousPlatform.transitions.Curves;

export class SpinningRing extends View {
    constructor(node, options) {
        super(node, options);

        console.log('options',options);

        let sizeX, sizeY, posY;

        this.createDOMElement({
            tagName: 'img',
            attributes: {
                'src': options.svgPath
            }
        });

        if(options.i === 0) {
            //Outer ring
            sizeX = 90;
            sizeY = 90;
            posY  = window.innerHeight * 1.1;
        } else if(options.i === 1) {
            //Inner ring
            sizeX = 78;
            sizeY = 78;
            posY  = window.innerHeight * 1.1;
        }

        this.setSizeMode(1, 1);
        this.setAbsoluteSize(sizeX, sizeY);
        this.setPositionY(posY);

        this.setMountPoint(.5, 0);
        this.setAlign(.5, 0);
        this.setOrigin(.5, .5);
    }
}
