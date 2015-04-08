import {core, domRenderables, components} from 'famous';
import {View} from '../shared/View';
import Utils from '../utils/Utilities'

const EventHandler = components.EventHandler;

export class Hand extends View {
    setProperties() {
        this.size.setAbsolute(70, 75);
        this.position.setY(296);
        this.mountPoint.set(.5, 0);
        this.align.set(.5, 0);
    }

    render() {
        this.el.attribute('src', this.model.imgPath);
    }

    post() {
        this.startAnimation();
    }

    animateHand() {
        if(this.isHalted) return;

        const _this = this;
        let duration = 1200;

        this.position.setY(196, {
            curve: 'linear',
            duration: duration
        }, function() {
            _this.resetHand();
        });

        setTimeout(function() {
            _this.opacity.set(0, {
                curve: 'linear',
                duration: duration / 2
            });
        }, duration / 2);
    }

    resetHand() {
        if(this.isHalted) return;

        const _this = this;
        this.position.setY(296, { duration: 0 }, function() {
            setTimeout(function() {
                _this.opacity.set(1, { duration: 100}, function() {
                    setTimeout(function() {
                        _this.animateHand();
                    }, 200);
                });
            }, 900);
        });
    }

    startAnimation() {
        this.isHalted = false;
        this.animateHand();
    }

    stopAnimation() {
        this.isHalted = true;
    }

    restartAnimation() {
        this.isHalted = false;
        this.resetHand();
    }

    setEvents() {
        const _this = this;
        this.eventHandler = new EventHandler(this.dispatch);

        this.eventHandler.on('dragging', function() {
            _this.stopAnimation();
        });
    }
}
