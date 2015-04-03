import {core, domRenderables, components, transitions} from 'famous';
import {View} from '../shared/View';
import Utils from '../utils/Utilities';
import {Timeline} from '../shared/Timeline';

const EventHandler = components.EventHandler;
const Easing       = transitions.Easing;

export class Card extends View {
    setProperties() {
        this.size.setAbsolute(350, 220);
        this.mountPoint.set(.5, 0);
        this.align.set(.5, 0);
        this.origin.set(0.5, 0.5, 0.5);
        this.position.setX(-300);
        this.position.setY(300);
        this.scale.setX(.5);
        this.scale.setY(.5);
        this.scale.setZ(.5);
    }

    render() {
        this.el.addClass('card-img');
        this.el.attribute('src', this.model.imgPath);
        this.loadCards();
    }

    loadCards() {
        const _this = this;

        this.position.setX(0, {
            curve: 'easeOut',
            duration: 500
        }, function() {
            let rotation = 0;
            let position = { x: 0, y: 300 };

            switch(_this.model.i) {
                case 0:
                    rotation = (-9 * Math.PI) / 180;
                    position.x = 30;
                    position.y = 250;
                    break;
                case 1:
                    rotation = (.5 * Math.PI) / 180;
                    position.y = 312;
                    position.x = 20;
                    break;
                case 2:
                    rotation = (30 * Math.PI) / 180;
                    position.x = -20;
                    position.y = 355;
                    break;
                case 3:
                    rotation = (-23 * Math.PI) / 180;
                    position.y = 245;
                    position.x = -30;
                    break;
                default:
                    break;
            }

            _this.model.rotation = {
                x: 0,
                y: 0,
                z: rotation
            };

            _this.model.position = {
                x: position.x,
                y: position.y
            };

            //TODO BUG: Remove timeout once callback is fixed
            setTimeout(function() {
                const options = { curve: 'outBack', duration: 500 };
                _this.rotation.setZ(rotation, options);
                _this.position.set(position.x, position.y, 1, options);
            }, 700);
        });
    }
}
