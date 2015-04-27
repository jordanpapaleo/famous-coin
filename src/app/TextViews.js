import {DomView} from '../shared/DomView';

class TopText extends DomView {
    setProperties() {
        this.setSize(['absolute', 318], ['absolute', 200]);
        this.opacity.set(1);
        this.position.setY(33);
    }

    render() {
        this.el.setContent(this.model);
        this.setStyle({
            'font-size': '60px',
            'text-align': 'center',
            'font-weight': '200'
        });
    }
}

class TagLine extends DomView {
    setProperties() {
        this.setSize(['absolute', 318], ['absolute', 100]);
        this.opacity.set(1);
        this.position.setY(-100);
    }

    render() {
        this.el.setContent('All your cards<br><strong>one coin</strong>');
        this.setStyle({
            'font-size': '50px',
            'text-align': 'center',
            'line-height': '1em',
            'color': '#FFFFFF'
        });
    }
}

class Coin extends DomView {
    setProperties() {
        this.setSize(['absolute', 318], ['absolute', 50]);
        this.opacity.set(1);
        this.position.setY(780);
    }

    render() {
        this.el.setContent('coin');
        this.setStyle({
            'font-size': '48px',
            'text-align': 'center',
            'line-height': '1em',
            'color': '#000000'
        });
    }
}

class GetYours extends DomView {
    setProperties() {
        this.setSize(['absolute', 318], ['absolute', 50]);
        this.opacity.set(1);
        this.position.setY(880);
    }

    render() {
        this.el.setContent('Get yours first');
        this.setStyle({
            'font-size': '42px',
            'text-align': 'center',
            'line-height': '1em',
            'color': '#FFFFFF'
        });
    }
}

class PreOrder extends DomView {
    setProperties() {
        this.align.set(.5, 0);
        this.mountPoint.set(.5, 0);
        this.opacity.set(1);
        this.setSize(['absolute', 220], ['absolute', 40]);
        this.position.setY(1000);
    }

    render() {
        this.el.setContent('Pre-order now');
        this.setStyle({
            'font-size': '22px',
            'text-align': 'center',
            'text-transform': 'uppercase',
            'font-weight': '700',
            'line-height': '40px',
            'color': '#FFFFFF',
            'background-color': '#000000',
            'border-radius': '4px'
        });
    }
}

module.exports = {
    TopText: TopText,
    TagLine: TagLine,
    Coin: Coin,
    GetYours: GetYours,
    PreOrder: PreOrder
};
