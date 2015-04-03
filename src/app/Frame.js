import {core, domRenderables, components, transitions} from 'famous';
import Utils from '../utils/Utilities'
import {View} from '../shared/View';
import {Hand} from './Hand';
import {TopText} from './TopText';
import {Card} from './Card';
import {Timeline} from '../shared/Timeline';

const Easing         = transitions.Easing;
const GestureHandler = components.GestureHandler;

export class Frame extends View {
    pre() {
        this.timeline = new Timeline({ timescale: 1 });
    }

    setProperties() {
        this.size.setAbsolute(320, 568);
        this.mountPoint.set(.5, .5);
        this.align.set(.5, .5);
    }

    render() {
        const frameStyles = {
            'border': '1px solid black',
            'overflow': 'hidden'
        };
        Utils.setStyle(this, frameStyles);

        this.renderBlueScreen();
        this.renderTopText();
        this.renderCards();
        this.renderHand();

        //this.renderOverlay();
        this.initTimeline();
    }

    renderBlueScreen() {
        this.blueScreen = new View({
            node: this.node.addChild(),
            mode: {}
        });

        let blueStyles = {
            'background-color': 'rgb(22, 139, 221)'
        };

        Utils.setStyle(this.blueScreen, blueStyles);

        this.blueScreen.align.set(0, 1, 0);
    }

    renderTopText() {
        this.topText = new TopText({
            node: this.node.addChild(),
            model: "Try<br>simple"
        });
    }

    renderHand() {
        this.hand = new Hand({
            tagName: 'img',
            node: this.node.addChild(),
            model: { imgPath: 'assets/svg/hand.svg' }
        });
    }

    renderCards() {
        const _this = this;

        this.cards = [];
        let cardsSrc = [
            'assets/images/gift.png',
            'assets/images/credit.png',
            'assets/images/membership.png',
            'assets/images/debit.png',
            'assets/images/coin.png'
        ];

        cardsSrc.forEach(function(card, i) {
            let cardNode = new Card({
                tagName: 'img',
                node: _this.node.addChild(),
                model: { imgPath: card, i: i }
            });

            if(i === 4) {
                cardNode.opacity.set(0);
            }

            _this.cards.push(cardNode);
        });
    }

    setEvents() {
        const _this = this;
        new GestureHandler(this.dispatch, [{
            event: 'drag',
            callback: function(e) {
                _this.dispatch.emit('dragging', e);
                _this.scrubTimeline(e);
            }
        }]);
    }

    initTimeline() {
        const LINEAR = Easing.getCurve('linear');
        const _this = this;

        this.time = {
            start: 0,
            step1: 1500,
            step2: 2500,
            step3: 3500, //First stage Done
            step4: 4500,
            step5: 5500,
            step6: 5750,
            step7: 6000,
            end:   6500
        };
        this.currentTime = 0; //Used in timeline scrubbing

        /*--------------------- BLUE SCREEN ---------------------*/
        this.timeline.registerComponent({
            component: this.blueScreen.align,
            path: [
                [this.time.start, [0, 1, 0]],
                [this.time.step3, [0, 1, 0]],
                [this.time.step5, [0, 0, 0]],
                LINEAR
            ]
        });

        /*--------------------- TOP TEXT ---------------------*/
        this.timeline.registerComponent({
            component: this.topText.position,
            path: [
                [this.time.start, [0, this.topText.position.getY()]],
                [this.time.step1, [0, -200]], // The element is 200px tall, this puts it out of view
                LINEAR
            ]
        });

        this.timeline.registerComponent({
            component: this.topText.opacity,
            path: [
                [this.time.start, 1],
                [(this.time.step1 / 3), 1], // Timing delay
                [this.time.step1, 0],
                LINEAR
            ]
        });

        /*--------------------- HAND ---------------------*/
        this.timeline.registerComponent({
            component: this.hand.position,
            path: [
                [this.time.start, [0, this.hand.position.getY()]],
                [this.time.step1, [0, -75]], // The element is 75px tall, this puts it out of view
                LINEAR
            ]
        });

        this.timeline.registerComponent({
            component: this.hand.opacity,
            path: [
                [this.time.start, this.hand.opacity.get()],
                [this.time.step1, 0],
                LINEAR
            ]
        });

        /*--------------------- CARDS ---------------------*/
        this.cards.forEach(function(card) {
            let timeSegments = _this.getCardTimeSegments(card);

            _this.timeline.registerComponent({
                component: card.position,
                path: timeSegments.cardPosition
            });

            _this.timeline.registerComponent({
                component: card.scale,
                path: timeSegments.cardScale
            });

            _this.timeline.registerComponent({
                component: card.rotation,
                path: timeSegments.cardRotation
            });

            _this.timeline.registerComponent({
                component: card.opacity,
                path: timeSegments.cardOpacity
            });
        });

        setTimeout(function() {
            _this.timeline.set(_this.time.end, { duration: _this.time.end });
        }, 500);
    }

    getCardTimeSegments(card) {
        let currentPosition = [card.model.position.x, card.model.position.y];
        let currentRotation = [0, 0, card.model.rotation.z];
        let timeSegments = {
            cardScale: [],
            cardRotation: [],
            cardOpacity: [],
            cardPosition: []
        };

        timeSegments.cardPosition = [[this.time.start, currentPosition],  [(this.time.step1 / 2), [0, 250]],   [this.time.step1, [0, 75]]];

        switch(card.model.i) {
            case 0: //GIFT
                timeSegments.cardScale = [
                    [this.time.start, [.5, .5, .5]],
                    [300, [.5, .5, .5]], // Delay
                    [(this.time.step1 / 2), [1, 1, 1]],
                    [this.time.step1, [.5, .5, .5]]
                ];
                timeSegments.cardRotation = [
                    [this.time.start, currentRotation],
                    [300, currentRotation], // Delay
                    [this.time.step1, [(360 * Math.PI / 180), 0, (-270 * Math.PI / 180)]]
                ];
                timeSegments.cardOpacity = [
                    [this.time.start, 1],
                    [(this.time.step1 - 1), 1],
                    [this.time.step1, 0]
                ];
                break;
            case 1: // CREDIT
                timeSegments.cardScale = [
                    [this.time.start, [.5, .5, .5]],
                    [200, [.5, .5, .5]], // Delay
                    [(this.time.step1 / 2), [1, 1, 1]],
                    [this.time.step1, [.5, .5, .5]]
                ];
                timeSegments.cardRotation = [
                    [this.time.start, currentRotation],
                    [200, currentRotation], // Delay
                    [this.time.step1, [(-360 * Math.PI / 180), 0, (90 * Math.PI / 180)]]
                ];
                timeSegments.cardOpacity = [
                    [this.time.start, 1],
                    [(this.time.step1 - 1), 1],
                    [this.time.step1, 0]
                ];
                break;
            case 2: //MEMBERSHIP
                timeSegments.cardScale = [
                    [this.time.start, [.5, .5, .5]],
                    [100, [.5, .5, .5]], // Delay
                    [(this.time.step1 / 2), [1, 1, 1]],
                    [this.time.step1, [.5, .5, .5]]
                ];
                timeSegments.cardRotation = [
                    [this.time.start, currentRotation],
                    [100, currentRotation], // Delay
                    [this.time.step1, [(360 * Math.PI / 180), 0, (-270 * Math.PI / 180)]]
                ];
                timeSegments.cardOpacity = [
                    [0, 1],
                    [(this.time.step1 - 1), 1],
                    [this.time.step1, 0]
                ];
                break;
            case 3: //DEBIT
                timeSegments.cardScale = [
                    [this.time.start, [.5, .5, .5]],
                    [(this.time.step1 / 2), [1, 1, 1]],
                    [this.time.step1, [.5, .5, .5]]
                ];
                timeSegments.cardRotation = [
                    [this.time.start, currentRotation],
                    [this.time.step1, [(-360 * Math.PI / 180), 0, (90 * Math.PI / 180)]]
                ];
                timeSegments.cardOpacity = [
                    [this.time.start, 1],
                    [(this.time.step1 - 1), 1],
                    [this.time.step1, 0]
                ];
                break;
            case 4: //COIN
                timeSegments.cardScale = [
                    [this.time.start, [.5, .5, .5]],
                    [(this.time.step1 / 2), [1, 1, 1]],
                    [this.time.step1, [.5, .5, .5]],
                    [this.time.step2, [.2, .2, .2]],
                    [this.time.step3, [.5, .5, .5]],
                    [this.time.step4, [.62, .62, .62]],
                    [this.time.step5, [.75, .75, .75]]
                ];

                timeSegments.cardRotation = [
                    [0, currentRotation],
                    [this.time.step1, [(-360 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
                    [this.time.step2, [(-1080 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
                    [this.time.step3, [(-360 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
                    [this.time.step4, [(-270 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
                    [this.time.step5, [(0 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
                    [this.time.step6, [(15 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
                    [this.time.step7, [(0 * Math.PI / 180), 0, (90 * Math.PI / 180)]]
                ];

                timeSegments.cardOpacity = [
                    [0, 0],
                    [(this.time.step1 - 1), 0],
                    [this.time.step1, 1]
                ];

                timeSegments.cardPosition = [
                    [this.time.start, currentPosition],
                    [(this.time.step1 / 2), [0, 250]],
                    [this.time.step1, [0, 75]],
                    [this.time.step3, [0, 75]],
                    [this.time.step4, [0, 300]],
                    [this.time.step5, [0, 200]]
                ];

                break;
        }

        return timeSegments;
    }

    scrubTimeline(e) {
        let duration = 0;

        if(e.status === 'start') {
            //this.currentTime = 0;
        } else if(e.status === 'move') {
            if(this.currentTime >= 0 && this.currentTime <= this.time.end) {
                this.currentTime += -1 * e.centerDelta.y * 4;
            }

            if(this.currentTime < 0) {
                this.currentTime = 0;
            }

            if(this.currentTime > this.time.end) {
                this.currentTime = this.time.end;
            }

            this.timeline.set(this.currentTime, { duration: duration });
        } else if(e.status === 'end') {
            let apexTime = this.time.step1 / 2;

            if(this.currentTime <= apexTime) {
                duration = this.currentTime * 1.25; // Lets the float
                this.currentTime = 0;
            } else if (this.currentTime < this.time.step2) {
                duration = this.time.end - this.currentTime;
                this.currentTime = this.time.end;
            }

            this.timeline.set(this.currentTime, { duration: duration });
        }

    }

    renderOverlay() {
        this.overlay = new View({
            tagName: 'img',
            node: this.node.addChild()
        });

        this.overlay.el.attribute('src', 'assets/images/ScreenShot1.png');
        this.overlay.size.setProportional(1, 1);
        this.overlay.opacity.set(.7);
    }
}
