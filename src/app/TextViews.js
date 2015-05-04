import View from 'famous-creative/display/View';

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

        this.setSizeMode(1, 1);
        this.setAbsoluteSize(318, 200);
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

        this.setSizeMode(1, 1);
        this.setAbsoluteSize(318, 100);
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

        this.setSizeMode(1, 1);
        this.setAbsoluteSize(318, 50);
        this.setOpacity(1);
        this.setPositionY(780);
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

        this.setSizeMode(1, 1);
        this.setAbsoluteSize(318, 50);
        this.setOpacity(1);
        this.setPositionY(880);
    }
}

export class PreOrder extends View {
    constructor(node, options) {
        super(node, options);

        this.createDOMElement({
            properties: {
                'font-size': '22px',
                'text-align': 'center',
                'text-transform': 'uppercase',
                'font-weight': '700',
                'line-height': '40px',
                'color': '#FFFFFF',
                'background-color': '#000000',
                'border-radius': '4px'
            },
            content: 'Pre-order now'
        });

        this.setAlign(.5, 0);
        this.setMountPoint(.5, 0);
        this.setOpacity(1);
        this.setSizeMode(0, 0);
        this.setAbsoluteSize(220, 40);
        this.setPositionY(1000);
    }
}
