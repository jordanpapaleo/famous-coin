import {components, transitions} from 'famous';
import {DomView} from '../shared/DomView';

const Curves         = transitions.Curves;

export class Hand extends DomView {
    constructor(options) {
        super(options);

        //this.setEvents();
        this.startAnimation();
    }

    setProperties() {
        this.setSize(['absolute', 70], ['absolute', 75]);
        this.position.setY(296);
        this.position.setZ(2000);
        this.mountPoint.set(.5, 0);
        this.align.set(.5, 0);
    }

    render() {
        this.el.setAttribute('src', this.model.imgPath);
    }

    startAnimation() {
        this.isHalted = false;
        this.animateHand();
    }

    stopAnimation() {
        this.isHalted = true;
        this.opacity.halt();
        this.position.halt();
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

        this.position.setY(196, {
            duration,
            curve: Curves.linear
        }, function() {
            _this.resetHand();
        });

        // Start the opacity half way through the animation
        setTimeout(function() {
            _this.opacity.set(0, {
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
        this.position.setY(296, {
            duration: 0
        }, function() {
            //TODO BUG:  Callbacks are not working correctly
            setTimeout(function() {
                _this.opacity.set(1, { duration: 100}, function() {
                    //TODO BUG:  Callbacks are not working correctly
                    // A quick pause after the animation completes
                    setTimeout(function() {
                        _this.animateHand();
                    }, 200);
                });
            }, 900);
        });
    }

    setEvents() {
        const _this = this;
        this.eventHandler = new components.EventHandler(this.node);

        this.eventHandler.on('dragging', function(message) {
            if(message === 'start') {
                _this.stopAnimation();
            }
        });

        this.eventHandler.on('resetApp', function(message) {
            _this.restartAnimation();
        });
    }
}
