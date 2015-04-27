import {transitions} from 'famous';
import {DomView} from '../shared/DomView';

const Curves = transitions.Curves;

export class Card extends DomView {
    setProperties() {
        this.setSize(['absolute', 350], ['absolute', 220]);
        this.mountPoint.set(.5, 0);
        this.align.set(.5, 0);
        this.origin.set(.5, .5);
        this.scale.set(.5, .5, .5);
        this.position.set(-300, 300, this.model.i * 350);
    }

    render() {
        this.addCardBack();
        this.addCardFront();
        this.loadCards();
    }

    addCardFront() {
        let cardFront = new DomView({
            tagName: 'img',
            node: this.node.addChild(),
            model: { imgPath: this.model.front }
        });

        cardFront.setStyle({
            'backface-visibility': 'hidden'
        });

        cardFront.size.setProportional(1, 1);
        cardFront.el.addClass('card-img-front');
        cardFront.el.setAttribute('src', cardFront.model.imgPath);
    }

    addCardBack() {
        let cardBack = new DomView({
            tagName: 'img',
            node: this.node.addChild(),
            model: { imgPath: this.model.back }
        });

        cardBack.setStyle({
            'backface-visibility': 'visible'
        });

        cardBack.size.setProportional(1, 1);
        cardBack.el.addClass('card-img-back');
        cardBack.el.setAttribute('src', cardBack.model.imgPath);
    }

    loadCards() {
        const _this = this;

        this.position.setX(0, {
            curve: Curves.easeInOut,
            duration: 650
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

            _this.model.position = position;
            _this.model.position.z = _this.position.getZ();

            //TODO BUG: Remove timeout once callback is fixed
            setTimeout(function() {
                const options = { curve: 'outBack', duration: 500 };
                _this.rotation.setZ(rotation, options);

                _this.position.setX(position.x, options);
                _this.position.setY(position.y, options);
            }, 700);
        });
    }
}
