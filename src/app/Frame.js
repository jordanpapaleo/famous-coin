import {core, domRenderables, components, transitions} from 'famous';
import Utils from '../utils/Utilities'
import {View} from '../shared/View';
import {Hand} from './Hand';
import {Card} from './Card';
import {TopText, TagLine, GetYours, PreOrder, Coin} from './TextViews';
import {Timeline} from '../shared/Timeline';

const Easing         = transitions.Easing;
const GestureHandler = components.GestureHandler;
const Camera         = components.Camera;

export class Frame extends View {
    pre() {
        this.timeline = new Timeline({ timescale: 1 });
    }

    setProperties() {
        this.size.setAbsolute(320, 568);
        this.mountPoint.set(.5, .5);
        this.align.set(.5, .5);

        this.camera = new Camera(this.dispatch);
        this.camera.set(Camera.PINHOLE_PROJECTION, 0, 0, 0);
    }

    render() {
        Utils.setStyle(this, {
            'border': '1px solid black',
            'overflow': 'hidden'
        });

        this.renderBlueScreen();
        this.renderTopText();
        this.renderCards();
        this.renderHand();
        this.renderTagLine();
        this.renderSpinningCoin();
        this.renderCoin();
        this.renderGetYours();
        this.renderPreOrder();

        this.initTimeline();
    }

    renderBlueScreen() {
        this.blueScreen = new View({
            node: this.node.addChild(),
            mode: {}
        });

        Utils.setStyle(this.blueScreen, {
            'background-color': 'rgb(22, 139, 221)'
        });

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
            { front: 'assets/images/gift.png', back: 'assets/svg/cardBack.svg'},
            { front: 'assets/images/credit.png', back: 'assets/svg/cardBack.svg'},
            { front: 'assets/images/membership.png', back: 'assets/svg/cardBack.svg'},
            { front: 'assets/images/debit.png', back: 'assets/svg/cardBack.svg'},
            { front: 'assets/svg/coinFront.svg', back: 'assets/svg/coinBack.svg'}
        ];

        cardsSrc.forEach(function(card, i) {
            let cardNode = new Card({
                tagName: 'div',
                node: _this.node.addChild(),
                model: {
                    front: card.front,
                    back: card.back,
                    i: i
                }
            });

            if(i === 4) {
                cardNode.opacity.set(0);
            }

            _this.cards.push(cardNode);
        });
    }

    renderTagLine() {
        this.tagLine = new TagLine({
            node: this.node.addChild(),
            model: {}
        });
    }

    renderSpinningCoin() {
        let svgPaths = [
            'assets/svg/outerCircle.svg',
            'assets/svg/innerCircle.svg'
        ];

        this.spinningCoins = [];

        for(var i = 0; i < svgPaths.length; i++) {
            let coin = new View({
                tagName: 'img',
                node: this.node.addChild(),
                model: {imgPath: svgPaths[i]}
            });

            if(i === 0) {
                coin.size.setAbsolute(90, 90);
                coin.position.setY(592);
            } else if(i === 1) {
                coin.size.setAbsolute(77, 77);
                coin.position.setY(604);
            }

            coin.mountPoint.set(.5, 0);
            coin.align.set(.5, 0);
            coin.origin.set(.5, .5);
            coin.el.attribute('src', coin.model.imgPath);

            this.spinningCoins.push(coin);
        }
    }

    renderCoin() {
        this.coin = new Coin({
            node: this.node.addChild(),
            model: {}
        });
    }

    renderGetYours() {
        this.getYours = new GetYours({
            node: this.node.addChild(),
            model: {}
        });
    }

    renderPreOrder() {
        this.preOrder = new PreOrder({
            tag: "button",
            node: this.node.addChild(),
            model: {}
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

    addPostTimelineEvents() {
        const _this = this;
        const coinCard = _this.cards[_this.cards.length - 1];
        const viewPortCenter = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        const appSize = this.size.get();
        const cardSize = coinCard.size.get();
        const cardPosition ={
            x: coinCard.position.getX(),
            y: coinCard.position.getY()
        };
        const cardCenter = {
            x: viewPortCenter.x,
            y: (viewPortCenter.y - (appSize[1] / 2)) + ((cardSize[1] / 2) + cardPosition.y)
        };

        this.el.on('mousemove');
        this.dispatch.registerTargetedEvent('mousemove', function(e) {
            let offset = {
                x: e.x - cardCenter.x,
                y: e.y - cardCenter.y
            };

            console.log('offset',offset.x, offset.y);
        });
    }

    initTimeline() {
        const LINEAR = Easing.getCurve('linear');
        const _this = this;
        this.currentTime = 0; //Used in timeline scrubbing

        this.time = {
            start: 0,
            step1: 1500, // Card scale apex
            step2: 2500, // Card scale basin
            step3: 3500, // Stage one done: Coin card has scaled back to a resting point
            step4: 4500, // Coin card scale and flip starting
            step5: 5500, // Coin card scale and flip apex
            step6: 5750, // Coin card scale and flip almost done
            step7: 6000, // End state text starts moving in
            step8: 6500, // Stage two done: Tag line and coin card are moving up and out
            end:   7000 //
        };

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

        /*--------------------- TAG LINE ---------------------*/
        this.timeline.registerComponent({
            component: this.tagLine.position,
            path: [
                [this.time.start, [0, this.tagLine.position.getY()]],
                [this.time.step4, [0, this.tagLine.position.getY()]],
                [this.time.step6, [0, 50]], // The element is 100px tall, this puts it out of view
                [this.time.step7, [0, 40]],
                [this.time.step8, [0, -110]],
                LINEAR
            ]
        });

        /*--------------------- SPINNING COINS ---------------------*/
        this.spinningCoins.forEach(function(coin, i) {
            let startingYPos = coin.position.getY();
            let endingYPos = startingYPos / 2;

            _this.timeline.registerComponent({
                component: coin.position,
                path: [
                    [_this.time.start, [0, startingYPos]],
                    [_this.time.step7, [0, startingYPos]],
                    [_this.time.step8, [0, endingYPos]],
                    LINEAR
                ]
            });

            _this.timeline.registerCallback({
                time: _this.time.step7,
                direction: 1,
                fn: function() {
                    if(i === 0) {
                        coin.rotation.set(1080 * Math.PI / 180, 720 * Math.PI / 180, 0, {
                            curve: 'easeOut',
                            duration: 3000
                        });
                    } else if(i === 1) {
                        coin.rotation.set(-1440 * Math.PI / 180, -1260 * Math.PI / 180, 0, {
                            curve: 'easeOut',
                            duration: 3000
                        });
                    }
                }
            });
        });

        /*--------------------- COIN ---------------------*/
        this.timeline.registerComponent({
            component: this.coin.position,
            path: [
                [this.time.start, [0, this.coin.position.getY()]],
                [this.time.step7, [0, this.coin.position.getY()]],
                [this.time.step8, [0, this.coin.position.getY() / 2]],
                LINEAR
            ]
        });

        /*--------------------- GET YOURS ---------------------*/
        this.timeline.registerComponent({
            component: this.getYours.position,
            path: [
                [this.time.start, [0, this.getYours.position.getY()]],
                [this.time.step7, [0, this.getYours.position.getY()]],
                [this.time.step8, [0, this.getYours.position.getY() / 2]],
                LINEAR
            ]
        });

        /*--------------------- PRE ORDER ---------------------*/
        this.timeline.registerComponent({
            component: this.preOrder.position,
            path: [
                [this.time.start, [0, this.preOrder.position.getY()]],
                [this.time.step7, [0, this.preOrder.position.getY()]],
                [this.time.step8, [0, this.preOrder.position.getY() / 2]],
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


        /*--------------------- APP ---------------------*/
        this.timeline.registerCallback({
            time: _this.time.end,
            direction: 1,
            fn: function() {
                _this.addPostTimelineEvents();
            }
        });

        setTimeout(function() {
            _this.timeline.set(_this.time.end, { duration: _this.time.end });
        }, 1000);
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
                    [this.time.step5, [0, 200]],
                    [this.time.step7, [0, 200]],
                    [this.time.step8, [0, 50]]
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

            if(this.currentTime >= 0 && this.currentTime <= this.time.end) { this.currentTime += e.centerDelta.y * -4; }
            if(this.currentTime < 0) { this.currentTime = 0; }
            if(this.currentTime > this.time.end) { this.currentTime = this.time.end; }

        } else if(e.status === 'end') {

            if(Math.abs(e.centerVelocity.y) > 250  || this.currentTime > (this.time.step1 / 2)) {
                duration = this.time.end - this.currentTime;
                this.currentTime = this.time.end;
            } else {
                duration = this.currentTime;
                this.currentTime = 0;
            }
        }

        this.timeline.set(this.currentTime, { duration: duration });

    }
}
