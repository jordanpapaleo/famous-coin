import {core, domRenderables, components, transitions} from 'famous';
import {DomView} from '../shared/DomView';
import {Timeline} from '../shared/Timeline';

import {Hand} from './Hand';
import {Card} from './Card';
import {TopText, TagLine, GetYours, PreOrder, Coin} from './TextViews';

const GestureHandler = components.GestureHandler;
const Curves         = transitions.Curves;
//const Camera         = components.Camera;


export class App extends DomView {
    constructor(options) {
        super(options);

        /*this.camera = new Camera(this.dispatch);
        this.camera.set(Camera.PINHOLE_PROJECTION, 10000, 0, 0);*/


        //GLOBAL EVENTS
        /*this.eventHandler = new components.EventHandler(this.node);

        this.eventHandler.on('test', function(message) {
            console.log('EVENT HANDLER', message);
        });*/




        /*this.onGlobalEvent('test', function(message) {
            console.log('onGlobalEvent', message);
        });*/

        this.on(['click'], function(evt) {
            console.log('evt',evt);
        });

        /*this.node.addComponent({
            onReceive: function(evtName, message) {
                if(evtName === 'test') {
                    console.log('COMPONENT', evtName, message);
                }
            }
        });*/

        /*this.el.on('test', function(message) {
            console.log('EL', message);
        });*/


        /*this.el.onAddUIEvent('click');
        this.el.on('click', function() {
            console.log('clicked');
        });*/

        //this.node.emit('test', ['my', 'message']);


        //this.setEvents();

        this.timeline = new Timeline({ timescale: 1 });
    }

    setProperties() {
        this.setSize(['absolute', 320], ['absolute', 568]);
        this.mountPoint.set(.5, .5);
        this.align.set(.5, .5);
    }

    render() {
        this.setStyle({
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

        //this.initTimeline();
    }

    renderBlueScreen() {
        this.blueScreen = new DomView({
            node: this.node.addChild(),
            model: {
                styles: {
                    'background-color': 'rgb(22, 139, 221)'
                }
            }
        });

        this.setSize(['absolute', 320], ['absolute', 580]);
        this.blueScreen.align.set(0, 0, 0);
        this.blueScreen.position.setY(580);
        this.blueScreen.position.setZ(-1000);
    }

    renderTopText() {
        this.topText = new TopText({
            node: this.node.addChild(),
            model: 'Try<br>simple'
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

            if(i === cardsSrc.length - 1) {
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
            let coin = new DomView({
                tagName: 'img',
                node: this.node.addChild(),
                model: {imgPath: svgPaths[i]}
            });

            if(i === 0) {
                coin.setSize(['absolute', 90], ['absolute', 90]);
                coin.position.setY(592);
            } else if(i === 1) {
                coin.setSize(['absolute', 77], ['absolute', 77]);
                coin.position.setY(604);
            }

            coin.mountPoint.set(.5, 0);
            coin.align.set(.5, 0);
            coin.origin.set(.5, .5);
            coin.el.setAttribute('src', coin.model.imgPath);

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
            tag: 'button',
            node: this.node.addChild(),
            model: {}
        });
    }

    setEvents() {
        const _this = this;
        let isScrubbing = false;
        let hasFinished = false;



        this.onDomEvent2('mousedown', ['preventDefault'], ['offsetX', 'offsetY'], function(e) {
            if(!hasFinished) {
                _this.dispatch.emit('dragging', 'start');
                isScrubbing = true;
            }
        });

        this.onDomEvent2('mousemove', ['preventDefault'], ['offsetX', 'offsetY'], function(e) {
            if(isScrubbing) {
                _this.scrubTimeline(e);
            }
        });

        this.onDomEvent2(['mouseup'], ['preventDefault'], ['offsetX', 'offsetY'], function(e) {
            isScrubbing = false;
            let duration;

            setTimeout(function () {
                if(_this.currentTime > (_this.time.step1 / 2)) { //FINISH
                    duration = _this.time.end - _this.currentTime;

                    _this.currentTime = _this.time.end;
                    _this.timeline.set(_this.currentTime, { duration });
                    hasFinished = true;
                } else {  //RESET
                    duration = _this.currentTime;

                    _this.dispatch.emit('resetApp', { duration });
                    _this.currentTime = 0;
                    _this.timeline.set(_this.currentTime, { duration });
                }
            }, 0);
        });
    }

    addCoinSpringEvent() {
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

        this.onDomEvent(['mouseleave', 'mouseout'], ['preventDefault'], ['offsetX', 'offsetY'], function(e) {
            coinCard.rotation.setY(0, {
                curve: Curves.spring,
                duration: 1000
            });

            coinCard.rotation.setX(0, {
                curve: Curves.spring,
                duration: 1000
            });
        });

        this.onDomEvent(['mousemove'], ['preventDefault'], ['offsetX', 'offsetY'], function(e) {
            let offset = {
                x: e.x - cardCenter.x,
                y: e.y - cardCenter.y
            };

            let maxOffsetX = 145;
            let maxOffsetY = 140;

            if(offset.x > -maxOffsetX && offset.x < maxOffsetX && offset.y > -maxOffsetY && offset.y < maxOffsetY) {
                //We Flip the X and Y here because the card has a rotation of 90 degrees, which flips its axis
                coinCard.rotation.setY((((offset.x * Math.PI) / 3) / 180));
                coinCard.rotation.setX((((offset.y * Math.PI) / 4) / 180));
            } else {
                coinCard.rotation.setY(0, {
                    curve: Curves.spring,
                    duration: 1000
                });

                coinCard.rotation.setX(0, {
                    curve: Curves.spring,
                    duration: 1000
                });
            }
        });
    }

    initTimeline() {
        const _this = this;
        this.currentTime = 0; //Used in timeline scrubbing

        this.time = {};
        this.time.start = 0;
        this.time.step1 = this.time.start + 1500; // Card scale apex
        this.time.step2 = this.time.step1 + 500;  // Card scale basin
        this.time.step3 = this.time.step2 + 500;  // Stage one done: Coin card has scaled back to a resting point
        this.time.step4 = this.time.step3 + 1000; // Coin card scale and flip starting
        this.time.step5 = this.time.step4 + 1000; // Coin card scale and flip apex
        this.time.step6 = this.time.step5 + 250;  // Coin card scale and flip almost done
        this.time.step7 = this.time.step6 + 250;  // End state text starts moving in
        this.time.step8 = this.time.step7 + 500;  // Stage two done: Tag line and coin card are moving up and out
        this.time.end   = this.time.step8 + 500;  // Finis

        /*--------------------- BLUE SCREEN ---------------------*/
        this.timeline.registerComponent({
            component: this.blueScreen.position,
            path: [
                [this.time.start, [0, 580]],
                [this.time.step3, [0, 580]],
                [this.time.step5, [0, -6]]
            ]
        });

        /*--------------------- TOP TEXT ---------------------*/
        this.timeline.registerComponent({
            component: this.topText.position,
            path: [
                [this.time.start, [0, this.topText.position.getY()]],
                [this.time.step1, [0, -200]] // The element is 200px tall, this puts it out of view
            ]
        });

        this.timeline.registerComponent({
            component: this.topText.opacity,
            path: [
                [this.time.start, 1],
                [(this.time.step1 / 3), 1], // Timing delay
                [this.time.step1, 0]
            ]
        });

        /*--------------------- HAND ---------------------*/
        this.timeline.registerComponent({
            component: this.hand.position,
            path: [
                [this.time.start, [0, this.hand.position.getY()]], //TODO BUG: this is always starting at 0...
                [this.time.step1, [0, -75]] // The element is 75px tall, this moves it out of view at the top
            ]
        });

        this.timeline.registerComponent({
            component: this.hand.opacity,
            path: [
                [this.time.start, this.hand.opacity.get()],
                [this.time.step1, 0]
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
                [this.time.step8, [0, -110]]
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
                    [_this.time.step8, [0, endingYPos]]
                ]
            });

            _this.timeline.registerCallback({
                time: _this.time.step7,
                direction: 1,
                fn: function() {
                    if(i === 0) {
                        coin.rotation.set(540 * Math.PI / 180, 720 * Math.PI / 180, 0, {
                            curve: Curves.easeOut,
                            duration: 3000
                        });
                    } else if(i === 1) {
                        coin.rotation.set(-1080 * Math.PI / 180, -1260 * Math.PI / 180, 0, {
                            curve:  Curves.easeOut,
                            duration: 3000
                        });
                    }
                }
            });
        });

        /*--------------------- COIN TEXT ---------------------*/
        this.timeline.registerComponent({
            component: this.coin.position,
            path: [
                [this.time.start, [0, this.coin.position.getY()]],
                [this.time.step7, [0, this.coin.position.getY()]],
                [this.time.step8, [0, this.coin.position.getY() / 2]]
            ]
        });

        /*--------------------- GET YOURS ---------------------*/
        this.timeline.registerComponent({
            component: this.getYours.position,
            path: [
                [this.time.start, [0, this.getYours.position.getY()]],
                [this.time.step7, [0, this.getYours.position.getY()]],
                [this.time.step8, [0, this.getYours.position.getY() / 2]]
            ]
        });

        /*--------------------- PRE ORDER ---------------------*/
        this.timeline.registerComponent({
            component: this.preOrder.position,
            path: [
                [this.time.start, [0, this.preOrder.position.getY()]],
                [this.time.step7, [0, this.preOrder.position.getY()]],
                [this.time.step8, [0, this.preOrder.position.getY() / 2]]
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
                _this.addCoinSpringEvent();
            }
        });
    }

    getCardTimeSegments(card) {
        let currentPosition = [card.model.position.x, card.model.position.y, card.model.position.z];
        let currentRotation = [card.model.rotation.x, card.model.rotation.y, card.model.rotation.z];
        let timeSegments = {
            cardScale: [],
            cardRotation: [],
            cardOpacity: [],
            cardPosition: []
        };

        timeSegments.cardPosition = [
            [this.time.start, currentPosition],
            [(this.time.step1 / 2), [0, 250, card.model.position.z]],
            [this.time.step1, [0, 75, card.model.position.z]]
        ];

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
                    [this.time.step2, [.3, .3, .3]],
                    [this.time.step3, [.5, .5, .5]],
                    [this.time.step4, [.62, .62, .62]],
                    [this.time.step5, [.75, .75, .75]]
                ];
                timeSegments.cardRotation = [
                    [0, currentRotation],
                    [this.time.step1, [(-360 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
                    [this.time.step2, [(-540 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
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
                    [this.time.step1, [0, 75], Curves.outBack],
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

        // 4 is used to speed up the scrubbing rate by a factor of 4 from the gesture movement
        // The negative of the number is required bc the values are oposite of the desired movement
        if(this.currentTime >= 0 && this.currentTime <= this.time.end) {
            this.currentTime += e.movementY * -4;
        }

        //The previous math can leave values that are outside of the working value range
        if(this.currentTime < 0) {
            this.currentTime = 0;
        }

        if(this.currentTime > this.time.end) {
            this.currentTime = this.time.end;
        }

        this.timeline.set(this.currentTime, { duration });
    }
}

const root = core.Famous.createContext('body');

window.app = new App({
    node: root.addChild(),
    model: {}
});
