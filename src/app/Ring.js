import View     from 'famous-creative/display/View';
import Physics  from './PhysicsService';

const Famous           = FamousPlatform.core.Famous;
const GestureHandler   = FamousPlatform.components.GestureHandler;

//Physics Components
const Box              = FamousPlatform.physics.Box;
const Spring           = FamousPlatform.physics.Spring;
const Vec3             = FamousPlatform.math.Vec3;

export class Ring extends View {
    constructor(node, options) {
        super(node);

        this.isBlackholeActive = false;

        this.model = {
            ringSize: this._getRingSize(),
            ringColor: this._getRingColors()
        };

        this.model.size = this.model.ringSize * 35;

        this.setAlign(.5, 0);
        this.setMountPoint(.5, 0);
        this.setOrigin(.5, .5);
        this.setPositionY(200);
        this.setPositionZ(-500);
        this.setOpacity(0);
        this.setScale(.25, .25);
        this.setSizeModeAbsolute();
        this.setAbsoluteSize(this.model.size, this.model.size);

        this.createDOMElement({
            properties: {
                width: '100%',
                height: '100%',
                border: this.model.ringSize + 'px solid ' + this.model.ringColor,
                borderRadius: '50%',
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
            mass: 10,
            size: [this.model.size, this.model.size, 0],
            position : new Vec3(0, 175, 0)
        });

        this.spring = new Spring({});
    }

    update() {
        if(this.isPhysicsActive) {
            let physicsTransform = this.world.getTransform(this.box);
            var dx = physicsTransform.position[0] - 0;
            var dy = physicsTransform.position[1] - 500;

            let distanceFromCenter = Math.sqrt(dx * dx + dy * dy) - this.model.size / 2;
            let blackholeRadius = 30;

            if(this.isBlackholeActive && distanceFromCenter < blackholeRadius) {
                this.emit('spinRing', {});
                this.isPhysicsActive = false;
                this.box.setVelocity(0, 0, 0);
                this.setScale(0.1, 0.1, 0.1, {duration : 100}, () => {
                    this.recycle();
                });
            }

            if(physicsTransform.position[1] > window.innerHeight + 100) {
               this.recycle();
            } else {
                this.setPosition(physicsTransform.position[0], physicsTransform.position[1], physicsTransform.position[2]);
            }
        }
    }

    activateBlackhole() {
        this.isBlackholeActive = true;
    }

    activatePhysics() {
        this.isPhysicsActive = true;
    }

    pop() {
        let duration = 100;

        this.setOpacity(0, {
            duration: 50
        });

        this.setScale(1.2, 1.2, 1.2, {
            duration: duration / 2
        }, () => {
            this.setScale(0, 0, 0, {
                duration: duration / 2
            }, () => {
                this.isPhysicsActive = false;
                this.recycle();
            });
        });
    }

    recycle() {
        let windowHalf = window.innerWidth / 2;
        let xPos = Math.random() * (windowHalf * 2) - windowHalf;
        let yPos = Math.random() * -700 - 200;
        this.box.setPosition(xPos, yPos, 0);
        this.scale.set(1, 1, 1, {duration : 10});
        this.setOpacity(1);
        this.box.setVelocity(0, 0, 0);
        this.isPhysicsActive = true;
        this.setDOMProperties({
            'border-color': '#000000'
        });
    }
}
