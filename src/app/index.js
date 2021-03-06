import {TopText, TagLine, GetYours, PreOrder, Coin} from './TextViews';
import View             from 'famous-creative/display/View';
import Timeline         from 'famous-creative/animation/Timeline';
import {Hand}           from './Hand';
import {Card}           from './Card';
import {Ring}           from './Ring';
import {SpinningRing}   from './SpinningRing';
import ENUMS            from './Enums';
import Physics          from './PhysicsService';

//Famous Components
const GestureHandler = FamousPlatform.components.GestureHandler;
const Curves         = FamousPlatform.transitions.Curves;

//Physics Components
const Gravity1D      = FamousPlatform.physics.Gravity1D;
const Gravity3D      = FamousPlatform.physics.Gravity3D;
const Vec3           = FamousPlatform.math.Vec3;
const Drag           = FamousPlatform.physics.Drag;

export class App extends View {
    constructor(node, options) {
        super(node, options);

        this.setAlign(.5, .5);
        this.setMountPoint(.5, .5);

        this.setSizeMode(0, 0);
        this.setAbsoluteSize(1, 1);

        this.createDOMElement({
            properties: {
                'overflow': 'hidden'
            }
        });

        this.initTimeline();

        this.render();
        this.renderSpinningRings();
        this.renderRings();

        this.setEvents();
        this.registerTimelinePaths();
        this.initWorld();
    }

    initTimeline() {
        this.timeline = new Timeline({ timescale: 1 });
        this.time = {};
        this.time.start = 0;
        this.time.step1 = this.time.start + 1500; // Card scale apex
        this.time.step2 = this.time.step1 + 500;  // Card scale basin
        this.time.step3 = this.time.step2 + 500;  // Stage one done: Coin card has scaled back to a resting point
        this.time.step4 = this.time.step3 + 1000; // Coin card scale and flip starting
        this.time.step5 = this.time.step4 + 1000; // Coin card scale and flip apex
        this.time.step6 = this.time.step5 + 250;  // Coin card scale and flip almost done
        this.time.step7 = this.time.step6 + 250;  // End state text starts moving in
        this.time.step8 = this.time.step7 + 1000; // Stage two done: Tag line and coin card are moving up and out
        this.time.end   = this.time.step8 + 1000; // Finis
    }

    initWorld() {
        this.world = Physics.getSimulation();
        this.ringBodies = [];

        for(let i = 0; i < this.rings.length; i++) {
            this.ringBodies.push(this.rings[i].sphere);
        }

        this.drag = new Drag(this.ringBodies, {
            max: Physics.dampenForce(7500),
            strength: Physics.dampenForce(7500),
            type: Drag.Linear
        });

        this.world.add(this.ringBodies, this.drag);
    }

    phyAddRepulsion() {
        let ringRepulsions = [];
        for(let i = 0; i < this.ringBodies.length; i++) {
            ringRepulsions.push(new Gravity3D(this.ringBodies[i], this.ringBodies, {
                strength: Physics.dampenForce(-1e3) //Negative Repulsion pushes away
            }));
        }

        this.world.add(ringRepulsions);
    }

    phyAdd1dGravity() {
        this.gravity1d = new Gravity1D(this.ringBodies, {
            acceleration: new Vec3(0, Physics.dampenForce(750), 0)
        });

        this.world.add([this.gravity1d]);
    }

    phyAdd3dGravity() {
        this.gravity3d = new Gravity3D(null, this.ringBodies, {
            strength: Physics.dampenForce(5e7),
            anchor: new Vec3(0, ENUMS.COIN_POS, 0)
        });

        this.world.add([this.gravity3d]);
    }

    loadRings() {
        const _this = this;
        let dampenedVelocity = Physics.dampenForce(1000);

        this.rings.forEach((ring) => {
            ring.setOpacity(1);

            let vx = Math.random() * (dampenedVelocity * 2) - dampenedVelocity;
            let vy = Math.random() * (dampenedVelocity * 2) - dampenedVelocity;

            ring.sphere.setVelocity(vx, vy, 0);
            ring.activatePhysics();

            ring.setScale(1.1, 1.1, 1.1, {
                duration: 750
            }, () => {
                ring.setScale(1, 1, 1, {
                    duration: 50
                });
            });

            setTimeout(function() {
                ring.activateBlackhole();
            }, this.time.step6);

            setTimeout(function() {
                ring.setDOMProperties({
                    'border-color': '#000000'
                });
            }, this.time.end);
        });

        setTimeout(function() {
            _this.phyAdd1dGravity();
            _this.phyAddRepulsion();
        }, 850);

        setTimeout(function() {
            _this.phyAdd3dGravity();
        }, this.time.step6);
    }

    render() {
        this.renderBlueScreen();
        this.renderTopText();
        this.renderCards();
        this.renderHand();
        this.renderTagLine();
        this.renderCoin();
        this.renderGetYours();
        this.renderPreOrder();
    }

    renderBlueScreen() {
        this.blueScreen = new View(this.node.addChild());

        this.blueScreen.createDOMElement({
            properties: {
                'background-color': 'rgb(22, 139, 221)',
                'z-index': -1000
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

    renderSpinningRings() {
        let svgPaths = [
            'assets/svg/outerCircle.svg',
            'assets/svg/innerCircle.svg'
        ];

        this.spinningRings = [];

        for(var i = 0; i < svgPaths.length; i++) {
            let ring = new SpinningRing(this.node.addChild(), {
                i,
                svgPath: svgPaths[i]
            });

            this.spinningRings.push(ring);
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

        let ringCount = 0;

        if(window.innerWidth < 320) {
            ringCount = 7;
        } else if(window.innerWidth < 428) {
            ringCount = 10;
        } else if(window.innerWidth < 768) {
            ringCount = 15;
        } else if(window.innerWidth < 992) {
            ringCount = 20;
        } else {
            ringCount = 30;
        }

        ringCount = 150;
        for(let i = 0; i < ringCount; i++) {
            let ring = new Ring(this.node.addChild());
            this.rings.push(ring);
        }
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

        setInterval(() => {
            if(this.rings && this.rings.length > 0) {
                let ring = this.rings[Math.floor(Math.random() * this.rings.length)];
                ring.pop();
            }
        }, 500);

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

        /*--------------------- RINGS  ---------------------*/
        this.timeline.registerPath({
            handler: (time) => {
                if(!this.hasOwnProperty('initializedRings')) {
                    this.initializedRings = false;
                }

                if(!this.initializedRing && time >= this.time.step3 - 50) {
                    this.loadRings();
                    this.initializedRing = true;
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
                if(!this.hasOwnProperty('hasRisen')) {
                    this.hasRisen = false;
                }

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

        /*--------------------- SPINNING RINGS ---------------------*/
        for(let i = 0, j = this.spinningRings.length; i < j; i++) {
            let coin = this.spinningRings[i];
            let startingYPos = coin.getPositionY();

            this.timeline.registerPath({
                handler: function(val) {
                    coin.setPosition(...val);
                },
                path: [
                    [this.time.start, [0, startingYPos]],
                    [this.time.step7, [0, startingYPos]],
                    [this.time.step8, [0, ENUMS.COIN_CENTER], Curves.easeOut]
                ]
            });

            this.timeline.registerPath({
                handler: (time) => {
                    if(!this.hasOwnProperty('hasLoadedRings')) {
                        this.hasLoadedRings = false;
                    }

                    if(!this.hasLoadedRings && time >= this.time.step7) {
                        this.emit('spinRing', {});
                        this.hasLoadedRings = true;
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
                    [this.time.step3 + 50, [.5, .5, .5]],
                    [this.time.step4, [.62, .62, .62]],
                    [this.time.step5, [.75, .75, .75]]
                ];
                timeSegments.cardRotation = [
                    [0, currentRotation],
                    [this.time.step1, [(-360 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
                    [this.time.step2, [(-540 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
                    [this.time.step3, [(-360 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
                    [this.time.step3 + 50, [(-360 * Math.PI / 180), 0, (90 * Math.PI / 180)]],
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
                    [this.time.step3 + 50, [0, 75, 0]],
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
