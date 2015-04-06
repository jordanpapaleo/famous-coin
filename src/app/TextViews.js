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
        let topTextStyle = {
            "font-size": "60px",
            "text-align": "center",
            "font-weight": "200"
        };

        this.el.content(this.model);
        Utils.setStyle(this, topTextStyle);
    }
}

class TagLine extends View {
    setProperties() {
        this.size.setAbsolute(318, 100);
        this.opacity.set(1);
        this.position.setY(-100);
    }

    render() {
        let styles = {
            "font-size": "50px",
            "text-align": "center",
            "line-height": "1em",
            "color": "#FFFFFF"
        };

        this.el.content("All your cards<br><strong>one coin</strong>");
        Utils.setStyle(this, styles);
    }
}

class Coin extends View {
    setProperties() {
        this.size.setAbsolute(318, 50);
        this.opacity.set(1);
        this.position.setY(562);
    }

    render() {
        let styles = {
            "font-size": "48px",
            "text-align": "center",
            "line-height": "1em",
            "color": "#000000"
        };

        this.el.content("coin");
        Utils.setStyle(this, styles);
    }
}

class GetYours extends View {
    setProperties() {
        this.size.setAbsolute(318, 50);
        this.opacity.set(1);
        this.position.setY(645);
    }

    render() {
        let styles = {
            "font-size": "42px",
            "text-align": "center",
            "line-height": "1em",
            "color": "#FFFFFF"
        };

        this.el.content("Get yours first");
        Utils.setStyle(this, styles);
    }
}

class PreOrder extends View {
    setProperties() {
        this.align.set(.5, 0);
        this.mountPoint.set(.5, 0);
        this.size.setAbsolute(220, 40);
        this.opacity.set(1);
        this.position.setY(750);
    }

    render() {
        let styles = {
            "font-size": "22px",
            "text-align": "center",
            "text-transform": "uppercase",
            "font-weight": "700",
            "line-height": "40px",
            "color": "#FFFFFF",
            "background-color": "#000000",
            "border-radius": "4px"
        };

        this.el.content("Pre-order now");
        Utils.setStyle(this, styles);
    }
}

module.exports = {
    TopText: TopText,
    TagLine: TagLine,
    Coin: Coin,
    GetYours: GetYours,
    PreOrder: PreOrder
};
