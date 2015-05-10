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
        this.setOpacity(0);
        this.setScale(.25, .25);
        this.setSizeModeAbsolute();
        this.setAbsoluteSize(this.model.size, this.model.size);

        this.createDOMElement({
            properties: {
                width: '100%',
                height: '100%',
                borderColor: this.model.ringColor,
                borderRadius: '50%',
                borderStyle: 'solid',
                'border-width': this.model.ringSize + 'px'
            }
        });

        this._setRingPosition();
        this._initPhysics();
        this.setEvents();
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

    spreadRing() {
        this.isGravityApplied = true;
        this.anchor.set(this.model.positionX, this.model.positionY);
    }

    _initPhysics() {
        this.simulation = Physics.getSimulation();
        this.isGravityApplied = false;

        var updater = {
            onUpdate: (t) => {
                this.simulation.update(t);
                this._update();

                Famous.requestUpdateOnNextTick(updater);
            }
        };

        Famous.requestUpdateOnNextTick(updater);

        //Mass will only have an effect if there is a force
        this.box = new Box({
            mass: 100,
            size: [this.model.size, this.model.size, 0]
        });

        //
        this.anchor = new Vec3(0, 175, 0);

        this.spring = new Spring(null, this.box, {
            period: 1,
            dampingRatio: .9,
            anchor: this.anchor
        });

        this.simulation.add([this.box, this.spring, this.collision]);
    }

    _update() {
        if(this.isGravityApplied) {
            if(!this.gravityX || this.gravityX === -10) {
                this.gravityX = 10;
            } else {
                this.gravityX = -10;
            }

            if(!this.gravityZ || this.gravityZ === -10) {
                this.gravityZ = 10;
            } else {
                this.gravityZ = -10;
            }

            if(!this.gravityY) {
                let yGravity = 0;

                switch(this.model.ringSize) {
                    case 1:
                        yGravity = this.model.ringSize;
                        break;
                    case 2:
                        yGravity = this.model.ringSize * 3;
                        break;
                    case 3:
                        yGravity = this.model.ringSize * 8;
                        break;
                }

                this.gravityY = Math.random() * yGravity + 1;
            }

            let physicsTransform = this.simulation.getTransform(this.box);
            this.setPosition(physicsTransform.position[0], physicsTransform.position[1], physicsTransform.position[3]);

            this.gravity = new Gravity1D([this.box], {
                acceleration: new Vec3(this.gravityX, this.gravityY, this.gravityZ)
            });

            this.simulation.add(this.gravity);
        }
    }

    _setRingPosition() {
        const xMax = window.innerWidth / 2;
        const yMax = window.innerHeight / 2;
        this.model.positionX = Math.random() * (xMax * 2) - xMax;
        this.model.positionY  = Math.random() * (yMax * 2) - yMax;

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
            this.anchor.set(xPos, yPos);
            this.setAbsoluteSize(70, 70, 70, {
                duration: springDuration
            }, () => {
                this.node.hide();
                this.emit('spinCoin');
            });
        }, delay);
    }
}
