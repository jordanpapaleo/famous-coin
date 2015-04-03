import {core, domRenderables, components} from 'famous';
import {View} from '../shared/View';
import Utils from '../utils/Utilities';

const EventHandler = components.EventHandler;

export class TopText extends View {
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
