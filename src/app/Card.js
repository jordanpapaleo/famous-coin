import View from 'famous-creative/display/View';
const Curves = FamousPlatform.transitions.Curves;

export class Card extends View {
    constructor(node, options) {
        super(node, options);
        this.model = options.model;

        let perspective = 600;
        let zTransform = this.model.i * 350;

        this.setSizeMode(1, 1);
        this.setAbsoluteSize(350, 220);
        this.setMountPoint(.5, 0);
        this.setAlign(.5, 0);
        this.setOrigin(.5, .5, .5);
        this.setScale(.5, .5, .5);
        this.setPosition(-window.innerWidth, 300, zTransform);

        this.createDOMElement({
            properties: {
                'zIndex': zTransform,
                '-webkit-perspective': perspective,
                '-moz-perspective': perspective,
                'perspective': perspective
            }
        });

        // this.addCardBack();
        this.addCardFront();
        this.loadCard();
    }

    addCardBack() {
        let cardBack = new View(this.node.addChild());
        cardBack.setSizeMode(0, 0);
        cardBack.setProportionalSize(1, 1);
        cardBack.createDOMElement({
            tagName: 'img',
            classes: [['card-img-back']],
            properties: {
                'backface-visibility': 'visible'
            }
        });
        cardBack.setDOMAttributes({
            'src': this.model.back
        });
    }

    addCardFront() {
        let cardFront = new View(this.node.addChild());
        cardFront.setSizeMode(0, 0);
        cardFront.setProportionalSize(1, 1);
        cardFront.createDOMElement({
            tagName: 'img',
            classes: ['card-img-front'],
            properties: {
                // 'backface-visibility': 'hidden'
            }
        });
        cardFront.setDOMAttributes({
            'src': this.model.front
        });
    }

    loadCard() {
        const _this = this;

        this.model.rotation = {
            x: 0,
            y: 0,
            z: 0
        };

        this.model.position = {
            x: 0,
            y: 300,
            z: this.getPositionZ()
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
            _this.setPositionX(0, {
                curve: Curves.easeInOut,
                duration: 650
            }, function() {
                // I want a slight delay after the animation is done
                setTimeout(function() {
                    const options = { curve: 'outBack', duration: 500 };
                    _this.setRotationZ(_this.model.rotation.z, options);
                    _this.setPositionX(_this.model.position.x, options);
                    _this.setPositionY(_this.model.position.y, options);
                }, 75);
            });
        }, 250);
    }
}
