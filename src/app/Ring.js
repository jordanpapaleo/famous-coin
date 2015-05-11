import View     from 'famous-creative/display/View';
import Physics  from './PhysicsService';

const Famous           = FamousPlatform.core.Famous;
const GestureHandler   = FamousPlatform.components.GestureHandler;

//Physics Components
const Box              = FamousPlatform.physics.Box;
const Spring           = FamousPlatform.physics.Spring;
const Gravity1D        = FamousPlatform.physics.Gravity1D;
const Gravity3D        = FamousPlatform.physics.Gravity3D;
const Vec3             = FamousPlatform.math.Vec3;

export class Ring extends View {
    constructor(node, options) {
        super(node);

        this.model = {
            ringSize: this._getRingSize(),
            ringColor: this._getRingColors()
        };

        this.model.size = 50 * this.model.ringSize;

        this.setAlign(.5, 0);
        this.setMountPoint(.5, 0);
        this.setOrigin(.5, .5);
        this.setPositionY(175);
        this.setPositionZ(-500);
        //this.setOpacity(0);
        //this.setScale(.25, .25);
        this.setSizeModeAbsolute();
        this.setAbsoluteSize(this.model.size, this.model.size);

        this.createDOMElement({
            properties: {
                width: '100%',
                height: '100%',
                borderColor: this.model.ringColor,
                borderRadius: '50%',
                borderStyle: 'solid',
                'border-width': this.model.ringSize + 'px',
                'z-index': -500
            },
            classes: ['ring']
        });

        this._setRingPosition();
        this._initPhysics();
        this.setEvents();
    }

    _setRingPosition() {
        const xMax = window.innerWidth / 4;
        const yMax = window.innerHeight / 4;
        this.model.positionX = Math.random() * (xMax * 2) - xMax;
        this.model.positionY = Math.random() * (yMax * 2) - yMax;

        /*this.model.positionX = Math.random() * 50;
         this.model.positionY = Math.random() * 50;*/

        if(this.model.positionY < 0) {
            this.model.positionY += 175;
        }
    }

    _getRingColors() {
        const colors = ['#329978', '#0089e0', '#3980a8', '#da695b'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    _getRingSize() {
        const ringSizes = [1, 2, 3];
        return ringSizes[Math.floor(Math.random() * ringSizes.length)];
    }

    setEvents() {
        this.on('risingComplete', () => {
            //TODO Eventing is not working right here
            console.warn('Eventing bug');
            //this.exit();
        });

        this.on('risingTide', function(message) {
            if(!this.hasOwnProperty('hasChanged')) {
                this.hasChanged = false;
            }

            if(this.hasChanged) {
                return;
            }

            let yPos = this.getPositionY();
            let size = this.getSize();

            let bottomEdge = yPos + size[1];

            if(bottomEdge > message) {
                this.hasChanged = true;

                this.setDOMProperties({
                    borderColor: 'black'
                });

                this.setScale(1.05, 1.05, 1.05, {
                    duration: 100
                }, function() {
                    this.setScale(.95, .95, .95, {
                        duration: 100
                    });
                }.bind(this));
            }
        }.bind(this));

        this.on('mousedown', () => {
            this.pop();
        });

        this.gestures = new GestureHandler(this.node, [{
            event: 'tap',
            callback: (e) => {
                this.pop();
            }
        }]);
    }

    _initPhysics() {
        this.world = Physics.getSimulation();
        this.isPhysicsActive = false;

        var updater = {
            onUpdate: (t) => {
                this.world.update(t);
                this.update();

                Famous.requestUpdateOnNextTick(updater);
            }
        };

        Famous.requestUpdateOnNextTick(updater);

        //Mass will only have an effect if there is a force
        this.box = new Box({
            mass: (1 / this.model.ringSize) * 50,
            size: [this.model.size, this.model.size, 0],
            position : new Vec3(this.model.positionX, this.model.positionY, 0)
        });

        this.spring = new Spring({});
    }

    update() {
        if(!this.hasOwnProperty('hasVelocity')) {
            this.hasVelocity = true;
            this.box.setVelocity(0, this.model.ringSize * 10, 0);
        }

        if(true || this.isPhysicsActive) {
            let physicsTransform = this.world.getTransform(this.box);

            /*
            let blackholeRadius = 30;

            var dx = physicsTransform.position[0] - 0;
            var dy = physicsTransform.position[1] - 500;

            if(Math.sqrt(dx * dx + dy * dy) < blackholeRadius) {
                this.isPhysicsActive = false;
                this.setScale(0, 0, 0, {duration : 200});
            }
            */

            if(physicsTransform.position[1] > window.innerHeight) {
               this.recycle();
            } else {
                this.setPosition(physicsTransform.position[0], physicsTransform.position[1], physicsTransform.position[2]);
            }
        }
    }

    startRingAnimation() {
        this.isPhysicsActive = true;
    }

    pop() {
        let duration = 100;

        this.setOpacity(0, {
            duration: 75
        });

        this.setScale(1.2, 1.2, 1.2, {
            duration: duration / 2
        }, () => {
            this.setScale(0, 0, 0, {
                duration: duration / 2
            }, () => {
                this.node.hide();
                this.world.remove(this.box);
                this.isPhysicsActive = false;
            });
        });
    }

    exit() {
        let xPos = 0;
        let yPos = window.innerHeight - 265;
        let delay = (Math.random() * (1000 - 500)) + 500;
        let springDuration = 950;

        //Random Delay so rings do not move at the same time
        setTimeout(() => {
            //this.anchor.set(xPos, yPos);
            /*this.setAbsoluteSize(70, 70, 70, {
                duration: springDuration
            }, () => {*/
                //this.node.hide();
                this.emit('spinCoin');
            //});
        }, delay);
    }

    recycle() {
        let windowHalf = window.innerWidth / 2;
        let xPos = Math.random() * (windowHalf * 2) - windowHalf;
        let yPos = Math.random() * -700 - 200;

        console.log('xPos', xPos);

        this.box.setPosition(xPos, yPos, 0);
    }
}

/*
* Pull rotational gravity and have the bubbles slowly fall getting sucked towards the logo
* */
