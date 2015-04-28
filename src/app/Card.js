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

        this.model.rotation = {
            x: 0,
            y: 0,
            z: 0
        };

        this.model.position = {
            x: 0,
            y: 300,
            z: 0
        };

        switch(this.model.i) {
            case 0:
                this.model.rotation.z = (-9 * Math.PI) / 180;
                this.model.position.x = 30;
                this.model.position.y = 250;
                break;
            case 1:
                this.model.rotation.z = (.5 * Math.PI) / 180;
                this.model.position.y = 312;
                this.model.position.x = 20;
                break;
            case 2:
                this.model.rotation.z = (30 * Math.PI) / 180;
                this.model.position.x = -20;
                this.model. position.y = 355;
                break;
            case 3:
                this.model.rotation.z = (-23 * Math.PI) / 180;
                this.model.position.y = 245;
                this.model.position.x = -30;
                break;
            default:
                break;
        }

        // I want a slight delay after the app loads
        setTimeout(function() {
            _this.position.setX(0, {
                curve: Curves.easeInOut,
                duration: 650
            }, function() {
                // I want a slight delay after the animation is done
                setTimeout(function() {
                    const options = { curve: 'outBack', duration: 500 };
                    _this.rotation.setZ(_this.model.rotation.z, options);
                    _this.position.setX(_this.model.position.x, options);
                    _this.position.setY(_this.model.position.y, options);
                }, 75);
            });
        }, 250);
    }
}
