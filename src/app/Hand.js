import View             from 'famous-creative/display/View';
import ENUMS            from './Enums';

const Curves = FamousPlatform.transitions.Curves;

export class Hand extends View {
    constructor(node, options) {
        super(node, options);

        this.setSizeMode(1, 1);
        this.setAbsoluteSize(70, 75);
        this.setPositionY(296);
        this.setPositionZ(3000);
        this.setMountPoint(.5, 0);
        this.setAlign(.5, 0);

        this.model = options.model;

        this.createDOMElement({
            tagName: 'img',
            properties: {
                'zIndex': 3000
            }
        });

        this.setDOMAttributes({
            'src': this.model.imgPath
        });

        this.setEvents();
        this.startAnimation();
    }


    setEvents() {
        const _this = this;

        this.on('dragging', function(message) {
            if(message === 'start') {
                _this.stopAnimation();
            }
        });

        this.on('resetApp', function() {
            _this.restartAnimation();
        });
    }

    startAnimation() {
        this.isHalted = false;
        this.animateHand();
    }

    stopAnimation() {
        this.isHalted = true;
        this.haltOpacity();
        this.haltPosition();
    }

    restartAnimation() {
        this.isHalted = false;
        this.resetHand();
    }

    animateHand() {
        if(this.isHalted) {
            return;
        }

        const _this = this;
        let duration = 1200;

        this.setPositionY(196, {
            duration,
            curve: Curves.linear
        }, function() {
            _this.resetHand();
        });

        // Start the opacity half way through the animation
        setTimeout(function() {
            _this.setOpacity(0, {
                curve: Curves.linear,
                duration: duration / 2
            });
        }, duration / 2);
    }

    resetHand() {
        if(this.isHalted) {
            return;
        }

        const _this = this;
        this.setPositionY(296, {
            duration: 0
        }, function() {
            //TODO BUG:  Callbacks are not working correctly
            setTimeout(function() {
                _this.setOpacity(1, { duration: 100}, function() {
                    //TODO BUG:  Callbacks are not working correctly
                    // A quick pause after the animation completes
                    setTimeout(function() {
                        _this.animateHand();
                    }, 200);
                });
            }, 900);
        });
    }
}
