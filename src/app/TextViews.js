import View             from 'famous-creative/display/View';
import ENUMS            from './Enums';


export class TopText extends View {
    constructor(node, options) {
        super(node, options);

        this.createDOMElement({
            properties: {
                'font-size': '60px',
                'text-align': 'center',
                'font-weight': '200'
            }
        });

        this.setDOMContent('Try<br>simple');

        this.setSizeMode(0, 1);
        this.setProportionalSize(1, null);
        this.setAbsoluteSize(null, 200);
        this.setOpacity(1);
        this.setPositionY(33);
    }
}

export class TagLine extends View {
    constructor(node, options) {
        super(node, options);

        this.createDOMElement({
            properties: {
                'font-size': '50px',
                'text-align': 'center',
                'line-height': '1em',
                'color': '#FFFFFF'
            },
            content: 'All your cards<br><strong>one coin</strong>'
        });

        this.setSizeMode(0, 1);
        this.setProportionalSize(1, null);
        this.setAbsoluteSize(null, 100);
        this.setOpacity(1);
        this.setPositionY(-100);
    }
}

export class Coin extends View {
    constructor(node, options) {
        super(node, options);

        this.createDOMElement({
            properties: {
                'font-size': '48px',
                'text-align': 'center',
                'line-height': '1em',
                'color': '#000000'
            },
            content: 'coin'
        });

        this.setSizeMode(0, 1);
        this.setProportionalSize(1, null);
        this.setAbsoluteSize(null, 50);
        this.setOpacity(1);
        this.setPositionY(window.innerHeight * 1.3);
    }
}

export class GetYours extends View {
    constructor(node, options) {
        super(node, options);

        this.createDOMElement({
            properties: {
                'font-size': '42px',
                'text-align': 'center',
                'line-height': '1em',
                'color': '#FFFFFF'
            },
            content: 'Get yours first'
        });

        this.setSizeMode(0, 1);
        this.setProportionalSize(1, null);
        this.setAbsoluteSize(null, 50);
        this.setOpacity(1);
        this.setPositionY(window.innerHeight * 1.4);
    }
}

export class PreOrder extends View {
    constructor(node, options) {
        super(node, options);

        this.createDOMElement({
            properties: {
                'background-color': '#000000',
                'border-radius': '4px',
                'color': '#FFFFFF',
                'font-size': '22px',
                'font-weight': '700',
                'line-height': '40px',
                'overflow': 'hidden',
                'text-align': 'center',
                'text-transform': 'uppercase'
            },
            content: 'Pre-order now',
            classes: ['txt-preorder']
        });

        this.setAlign(.5, 0);
        this.setMountPoint(.5, 0);
        this.setOpacity(1);
        this.setSizeMode(1, 1);
        this.setAbsoluteSize(220, 40);
        this.setPositionY(window.innerHeight * 1.5);
    }
}
