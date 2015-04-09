import {core, domRenderables, components} from 'famous';
import {View} from '../shared/View';
import Utils from '../utils/Utilities';

class TopText extends View {
    setProperties() {
        this.size.setAbsolute(318, 200);
        this.opacity.set(1);
        this.position.setY(33);
    }

    render() {
        this.el.content(this.model);
        Utils.setStyle(this, {
            'font-size': '60px',
            'text-align': 'center',
            'font-weight': '200'
        });
    }
}

class TagLine extends View {
    setProperties() {
        this.size.setAbsolute(318, 100);
        this.opacity.set(1);
        this.position.setY(-100);
    }

    render() {
        this.el.content('All your cards<br><strong>one coin</strong>');
        Utils.setStyle(this, {
            'font-size': '50px',
            'text-align': 'center',
            'line-height': '1em',
            'color': '#FFFFFF'
        });
    }
}

class Coin extends View {
    setProperties() {
        this.size.setAbsolute(318, 50);
        this.opacity.set(1);
        this.position.setY(780);
    }

    render() {
        this.el.content('coin');
        Utils.setStyle(this, {
            'font-size': '48px',
            'text-align': 'center',
            'line-height': '1em',
            'color': '#000000'
        });
    }
}

class GetYours extends View {
    setProperties() {
        this.size.setAbsolute(318, 50);
        this.opacity.set(1);
        this.position.setY(880);
    }

    render() {
        this.el.content('Get yours first');
        Utils.setStyle(this, {
            'font-size': '42px',
            'text-align': 'center',
            'line-height': '1em',
            'color': '#FFFFFF'
        });
    }
}

class PreOrder extends View {
    setProperties() {
        this.align.set(.5, 0);
        this.mountPoint.set(.5, 0);
        this.size.setAbsolute(220, 40);
        this.opacity.set(1);
        this.position.setY(1000);
    }

    render() {
        this.el.content('Pre-order now');
        Utils.setStyle(this, {
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
