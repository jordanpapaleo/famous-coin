import View     from 'famous-creative/display/View';
import Timeline from 'famous-creative/animation/Timeline';
import {Hand}   from './Hand';
import {Card}   from './Card';
import {Ring}   from './Ring';
import {TopText, TagLine, GetYours, PreOrder, Coin} from './TextViews';

const GestureHandler = FamousPlatform.components.GestureHandler;
const Curves         = FamousPlatform.transitions.Curves;
const Color          = FamousPlatform.utilities.Color;

export class App extends View {
    constructor(node, options) {
        super(node, options);
        this.timeline = new Timeline({ timescale: 1 });

        this.setSizeMode(0, 0);
        this.setAbsoluteSize(1, 1);
        this.setMountPoint(.5, .5);
        this.setAlign(.5, .5);

        this.createDOMElement({
            properties: {
                'overflow': 'hidden'
            }
        });

        this.render();
        this.setEvents();
        this.registerTimelinePaths();
    }

    render() {
        this.renderBlueScreen();
        this.renderTopText();
        this.renderCards();
        this.renderHand();
        this.renderTagLine();
        this.renderSpinningCoin();
        this.renderCoin();
        this.renderGetYours();
        this.renderPreOrder();
        this.renderRings();
    }

    renderBlueScreen() {
        this.blueScreen = new View(this.node.addChild());

        this.blueScreen.createDOMElement({
            properties: {
                'background-color': 'rgb(22, 139, 221)'
            },
            classes: ['blue-screen']
        });

        this.blueScreen.setSizeMode(0, 0);
        this.blueScreen.setProportionalSize(1, 1);
        this.blueScreen.setAlign(0, 0, 0);
        this.blueScreen.setPosition(0, window.innerHeight, -1000);
    }

    renderTopText() {
        this.topText = new TopText(this.node.addChild());
    }

    renderHand() {
        this.hand = new Hand(this.node.addChild(), {
            tagName: 'img',
            model: {
                imgPath: 'assets/svg/hand.svg'
            }
        });
    }

    renderCards() {
        const _this = this;

        this.cards = [];
        let cardsSrc = [
            { front: 'assets/images/gift.png',       back: 'assets/svg/cardBack.svg'},
            { front: 'assets/images/credit.png',     back: 'assets/svg/cardBack.svg'},
            { front: 'assets/images/membership.png', back: 'assets/svg/cardBack.svg'},
            { front: 'assets/images/debit.png',      back: 'assets/svg/cardBack.svg'},
            { front: 'assets/svg/coinFront.svg',     back: 'assets/svg/coinBack.svg'}
        ];

        cardsSrc.forEach(function(card, i) {
            let cardNode = new Card(_this.node.addChild(), {
                tagName: 'div',
                model: {
                    front: card.front,
                    back: card.back,
                    i: i
                }
            });

            if(i === cardsSrc.length - 1) {
                cardNode.setOpacity(0);
            }

            _this.cards.push(cardNode);
        });
    }

    renderTagLine() {
        this.tagLine = new TagLine(this.node.addChild());
    }

    renderSpinningCoin() {
        let svgPaths = [
            'assets/svg/outerCircle.svg',
            'assets/svg/innerCircle.svg'
        ];

        this.spinningCoins = [];

        for(var i = 0; i < svgPaths.length; i++) {
            let coin = new View(this.node.addChild());
            let sizeX, sizeY, posY;

            coin.createDOMElement({
                tagName: 'img',
                attributes: {
                    'src': svgPaths[i]
                }
            });

            if(i === 0) {
                //Outer coin
                sizeX = 90;
                sizeY = 90;
                posY  = window.innerHeight * 1.1;
            } else if(i === 1) {
                //Inner coin
                sizeX = 78;
                sizeY = 78;
                posY  = window.innerHeight * 1.1;
            }

            coin.setSizeMode(1, 1);
            coin.setAbsoluteSize(sizeX, sizeY);
            coin.setPositionY(posY);

            coin.setMountPoint(.5, 0);
            coin.setAlign(.5, 0);
            coin.setOrigin(.5, .5);
            this.spinningCoins.push(coin);
        }
    }

    renderCoin() {
        this.coin = new Coin(this.node.addChild());
    }

    renderGetYours() {
        this.getYours = new GetYours(this.node.addChild());
    }

    renderPreOrder() {
        this.preOrder = new PreOrder(this.node.addChild(), {
            tag: 'button'
        });

        this.shimmer = new View(this.preOrder.addChild());
        this.shimmer.createDOMElement({
            properties: {
                'background': 'linear-gradient(80deg, rgba(0,0,0,0) 30%,rgba(180,180,180,0.3) 45%,rgba(180,180,180,0.3) 55%, rgba(0,0,0,0) 70%)',
                'zIndex': 10
            },
            classes: ['shimmer']
        });

        this.shimmer.setPosition(-240, -40, 10);
    }

    renderRings() {
        this.rings = [];

        let bubbleCount = 0;
        let windowWidth =  window.innerWidth;

        if(windowWidth < 320) {
            bubbleCount = 5;
        } else if(windowWidth < 428) {
            bubbleCount = 10;
        } else if(windowWidth < 768) {
            bubbleCount = 15;
        } else if(windowWidth < 992) {
            bubbleCount = 20;
        } else {
            bubbleCount = 30;
        }


        for(let i = 0; i < bubbleCount; i++) {
            this.rings.push(new Ring(this.node.addChild()));
        }
    }

    loadRings() {
        this.rings.forEach(function(ring, i) {
            let currentTime = Math.random() * (1000 - 500) + 500;

            ring.setOpacity(1);
            ring.setScale(1, 1, 1, {
                duration: currentTime,
                curve: Curves.linear
            });

            ring.setPositionX(ring.model.positionX, {
                duration: currentTime,
                curve: Curves.easeOut
            });

            ring.setPositionY(ring.model.positionY, {
                duration: currentTime,
                curve: Curves.easeOut
            }, function() {
                ring.sink();
            });
        });
    }

    translateShimmer() {
        setTimeout(function() {
            this.shimmer.setPositionX(240, {
                duration: 1500,
                curve: Curves.easeInOut
            }, function() {
                this.shimmer.setPositionX(-240);
                this.translateShimmer();
            }.bind(this));
        }.bind(this), 3000);
    }

    setEvents() {
        let isScrubbing = false;
        let hasFinished = false;

        this.on('mousedown', (e) => {
            if(!hasFinished) {
                this.emit('dragging', 'start');
                isScrubbing = true;
            }
        });

        this.on('mousemove', (e) => {
            if(isScrubbing) {
                this.mouseMovement = {
                    x: e.clientX,
                    y: e.clientY
                };
                this.scrubTimeline(this.mouseMovement.movement);
            }
        });

        this.on('mouseup', (e) => {
            isScrubbing = false;
            let duration;
            this.mouseMovement = null;

            if(this.currentTime > (this.time.step1 / 2)) { // FINISH the time line
                duration = this.time.end - this.currentTime;
                this.currentTime = this.time.end;
                hasFinished = true;
            } else {  //RESET the time line
                duration = this.currentTime;
                this.emit('resetApp', { duration });
                this.currentTime = 0;
            }
            this.timeline.set(this.currentTime, { duration });
        });

        this.gestures = new GestureHandler(this.node,  [{
            event: 'drag',
            callback: (e) => {
                let duration;

                if(e.status === 'move') {
                    this.emit('dragging', 'start');
                    this.scrubTimelineGesture(e);
                } else if(e.status === 'end') {
                    if(this.currentTime > (this.time.step1 / 2)) { //Math.abs(e.centerVelocity.y) > 250  ||
                        duration = this.time.end - this.currentTime;
                        this.currentTime = this.time.end;
                    } else {
                        duration = this.currentTime;
                        this.currentTime = 0;
                        this.emit('resetApp', { duration });
                    }

                    this.timeline.set(this.currentTime, { duration });
                }

            }
        }]);
    }

    set mouseMovement(position) {
        if(!position) {
            delete this.mouseProperties;
        } else if(!this.mouseProperties) {
            this.mouseProperties = {
                _lastPosition: position,
                movement: {
                    x: 0,
                    y: 0
                }
            };
        } else {
            this.mouseProperties.movement.x = this.mouseProperties._lastPosition.x - position.x;
            this.mouseProperties.movement.y = this.mouseProperties._lastPosition.y - position.y;
            this.mouseProperties._lastPosition = position;
        }
    }

    get mouseMovement() {
        if(!this.mouseProperties) {
            this.mouseProperties = {
                _lastPosition: undefined,
                movement: {
                    x: undefined,
                    y: undefined
                }
            };
        }

        return this.mouseProperties;
    }

    addCoinSpringEvent() {
        const _this = this;
        const coinCard = _this.cards[_this.cards.length - 1];
        const viewPortCenter = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        const appSize = this.getSize();
        const cardSize = coinCard.getSize();
        const cardPosition = {
            x: coinCard.position.getX(),
            y: coinCard.getPositionY()
        };
        const cardCenter = {
            x: viewPortCenter.x,
            y: (viewPortCenter.y - (appSize[1] / 2)) + ((cardSize[1] / 2) + cardPosition.y)
        };

        function releaseSpring(e) {
            coinCard.setRotationY(0, {
                curve: Curves.spring,
                duration: 1000
            });

            coinCard.setRotationX(0, {
                curve: Curves.spring,
                duration: 1000
            });
        }

        this.on('mouseleave', releaseSpring);
        this.on('mouseout', releaseSpring);

        this.on('mousemove', function(e) {
            let offset = {
                x: e.clientX - cardCenter.x,
                y: e.clientY - cardCenter.y
            };

            let maxOffsetX = 145;
            let maxOffsetY = 140;

            if(offset.x > -maxOffsetX && offset.x < maxOffsetX && offset.y > -maxOffsetY && offset.y < maxOffsetY) {

                //We Flip the X and Y here because the card has a rotation of 90 degrees, which flips its axis
                coinCard.setRotationY((((offset.x * Math.PI) / 3) / 180));
                coinCard.setRotationX((((offset.y * Math.PI) / 4) / 180));
            } else {

                coinCard.setRotationY(0, {
                    curve: Curves.spring,
                    duration: 1000
                });

                coinCard.setRotationX(0, {
                    curve: Curves.spring,
                    duration: 1000
                });
            }
        });
    }

    addGyroscopeEvent() {
        window.addEventListener('deviceorientation', (e) => {
            let rotX = e.beta * -Math.PI/180;
            let rotY = e.gamma * Math.PI/180;
            this.cards[4].haltRotation();
            this.cards[4].setRotation(rotX, rotY, (90 * Math.PI / 180), {
                duration: 100
            });
        }, false);
    }

    registerTimelinePaths() {
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
        this.time.step8 = this.time.step7 + 1000;  // Stage two done: Tag line and coin card are moving up and out
        this.time.end   = this.time.step8 + 1000;  // Finis

        /*--------------------- RINGS  ---------------------*/
        let initializedRings = false;
        this.timeline.registerPath({
            handler: (time) => {
                if(time >= this.time.step3 && !initializedRings) {
                    this.loadRings();
                    initializedRings = true;
                }
            },
            path: [
                [0, 0],
                [this.time.end, this.time.end]
            ]
        });

        /*--------------------- BLUE SCREEN ---------------------*/
        this.timeline.registerPath({
            handler: (val) => {
                this.blueScreen.setPosition(...val);
            },
            path: [
                [this.time.start, [0, window.innerHeight]],
                [this.time.step3, [0, window.innerHeight]],
                [this.time.step5, [0, 0]]
            ]
        });


        this.timeline.registerPath({
            handler: (time) => {
                if(time >= this.time.step3 && time <= this.time.step5) {
                    this.emit('risingTide', this.blueScreen.getPositionY());
                }
            },
            path: [
                [0, 0],
                [this.time.end, this.time.end]
            ]
        });

        /*--------------------- TOP TEXT ---------------------*/
        this.timeline.registerPath({
            handler: function(val) {
                this.topText.setPosition(...val);
            }.bind(this),
            path: [
                [this.time.start, [0, this.topText.getPositionY()]],
                [this.time.step1, [0, -200]] // The element is 200px tall, this puts it out of view
            ]
        });

        this.timeline.registerPath({
            handler: function(val) {
                this.topText.setOpacity([val]);
            }.bind(this),
            path: [
                [this.time.start, 1],
                [(this.time.step1 / 3), 1], // Timing delay
                [this.time.step1, 0]
            ]
        });

        /*--------------------- HAND ---------------------*/
        this.timeline.registerPath({
            handler: function(val) {
                this.hand.setPosition(...val);
            }.bind(this),
            path: [
                [this.time.start, [0, this.hand.getPositionY()]],
                [this.time.step1, [0, -75]] // The element is 75px tall, this moves it out of view at the top
            ]
        });

        /*--------------------- TAG LINE ---------------------*/
        this.timeline.registerPath({
            handler: function(val) {
                this.tagLine.setPosition(...val);
            }.bind(this),
            path: [
                [this.time.start, [0, this.tagLine.getPositionY()]],
                [this.time.step4, [0, this.tagLine.getPositionY()]],
                [this.time.step6, [0, 50]], // The element is 100px tall, this puts it out of view
                [this.time.step7, [0, 40]],
                [this.time.step8 - 500, [0, -200]]
            ]
        });

        /*--------------------- SPINNING COINS ---------------------*/
        for(let i = 0, j = this.spinningCoins.length; i < j; i++) {
            let coin = this.spinningCoins[i];

            let startingYPos = coin.getPositionY();
            let endingYPos = window.innerHeight - 265;
            if(i === 1) {
                endingYPos = endingYPos + 6;
            }

            this.timeline.registerPath({
                handler: function(val) {
                    coin.setPosition(...val);
                },
                path: [
                    [this.time.start, [0, startingYPos]],
                    [this.time.step7, [0, startingYPos]],
                    [this.time.step8, [0, endingYPos], Curves.easeOut]
                ]
            });

            this.timeline.registerPath({
                handler: (time) => {
                    if(time >= this.time.step7) {
                        if(i === 0) { // Outer ring
                            coin.setRotation(540 * Math.PI / 180, 900 * Math.PI / 180, 0, {
                                curve: Curves.easeOut,
                                duration: 3000
                            });
                        } else if(i === 1) { // Inner ring
                            coin.setRotation(-1080 * Math.PI / 180, -1440 * Math.PI / 180, 0, {
                                curve: Curves.easeOut,
                                duration: 3000
                            });
                        }
                    }
                },
                path: [
                    [0, 0],
                    [this.time.end, this.time.end]
                ]
            });
        }

        /*--------------------- COIN TEXT ---------------------*/
        this.timeline.registerPath({
            handler: (val) => {
                this.coin.setPosition(...val);
            },
            path: [
                [this.time.start, [0, this.coin.getPositionY()]],
                [this.time.step7 + 50, [0, this.coin.getPositionY()]],
                [this.time.step8 + 50, [0, window.innerHeight - 175], Curves.easeOut]
            ]
        });

        /*--------------------- GET YOURS ---------------------*/
        this.timeline.registerPath({
            handler: (val) => {
                this.getYours.setPosition(...val);
            },
            path: [
                [this.time.start, [0, this.getYours.getPositionY()]],
                [this.time.step7 + 75, [0, this.getYours.getPositionY()]],
                [this.time.step8 + 75, [0, window.innerHeight - 120], Curves.easeOut]
            ]
        });

        /*--------------------- PRE ORDER ---------------------*/
        this.timeline.registerPath({
            handler: (val) => {
                this.preOrder.setPosition(...val);
            },
            path: [
                [this.time.start, [0, this.preOrder.getPositionY()]],
                [this.time.step7 + 200, [0, this.preOrder.getPositionY()]],
                [this.time.step8 + 200, [0, window.innerHeight - 65], Curves.easeOut]
            ]
        });

        /*--------------------- CARDS ---------------------*/
        for(let i = 0, j = this.cards.length; i < j; i++) {
            let card = this.cards[i];

            let timeSegments = this.getCardTimeSegments(card);

            this.timeline.registerPath({
                handler: function(val) {
                    card.setPosition(...(Array.isArray(val) ? val : [val]));
                },
                path: timeSegments.cardPosition
            });

            this.timeline.registerPath({
                handler: function(val) {
                    card.setScale(...(Array.isArray(val) ? val : [val]));
                },
                path: timeSegments.cardScale
            });

            this.timeline.registerPath({
                handler: function(val) {
                    card.setRotation(...(Array.isArray(val) ? val : [val]));
                },
                path: timeSegments.cardRotation
            });

            this.timeline.registerPath({
                handler: function(val) {
                    card.setOpacity(val);
                },
                path: timeSegments.cardOpacity
            });
        }

        this.timeline.registerPath({
            handler: (time) => {
                if(time >= this.time.end) {
                    this.addCoinSpringEvent();
                    this.addGyroscopeEvent();
                    this.translateShimmer();
                }
            },
            path: [
                [0, 0],
                [this.time.end, this.time.end]
            ]
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
                    [(this.time.step1 / 2), [0, 250, 0]],
                    [this.time.step1, [0, 75, 0], Curves.outBack],
                    [this.time.step3, [0, 75, 0]],
                    [this.time.step4, [0, 300, 0]],
                    [this.time.step5, [0, 200, 0]],
                    [this.time.step7, [0, 200, 0]],
                    [this.time.step8 - 500, [0, 50, 0], Curves.easeOut]
                ];
                break;
        }

        return timeSegments;
    }

    scrubTimelineGesture(e) {
        if(this.currentTime >= 0 && this.currentTime <= this.time.end) {
            this.currentTime += e.centerDelta.y * -4;
        }

        if(this.currentTime < 0) {
            this.currentTime = 0;
        }

        if(this.currentTime > this.time.end) {
            this.currentTime = this.time.end;
        }

        this.timeline.set(this.currentTime);
    }

    scrubTimeline(mouseMovement) {
        // 4 is used to speed up the scrubbing rate by a factor of 4 from the gesture movement
        if(this.currentTime >= 0 && this.currentTime <= this.time.end) {
            this.currentTime += mouseMovement.y * 4;
        }

        //The previous math can leave values that are outside of the working value range
        if(this.currentTime < 0) {
            this.currentTime = 0;
        }

        if(this.currentTime > this.time.end) {
            this.currentTime = this.time.end;
        }
        this.timeline.set(this.currentTime);
    }
}

const rootNode   = FamousPlatform.core.Famous.createContext('body');
let camera = new FamousPlatform.components.Camera(rootNode);
camera.setDepth(20000);

window.app = new App(rootNode.addChild(), {
    properties: {

    }
});
