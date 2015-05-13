import ENUMS           from './Enums';
import Physics         from './PhysicsService';
import View            from 'famous-creative/display/View';

//Famous Components
const Famous            = FamousPlatform.core.Famous;
const GestureHandler    = FamousPlatform.components.GestureHandler;

//Physics Components
const Box               = FamousPlatform.physics.Box;
const Spring            = FamousPlatform.physics.Spring;
const Vec3              = FamousPlatform.math.Vec3;
const Sphere            = FamousPlatform.physics.Sphere;

export class Ring extends View {
    constructor(node, options) {
        super(node, options);

        this.model           = options || {};
        this.model.ringSize  = this._getRingSize();
        this.model.ringColor = this._getRingColor();
        this.model.size      = this.model.ringSize * 35;

        //Position
        this.setAlign(.5, 0);
        this.setMountPoint(.5, .5, .5);
        this.setOrigin(.5, .5, .5);
        this.setPositionY(200);
        this.setPositionZ(-500);

        // Sizing
        this.setSizeModeAbsolute();
        this.setAbsoluteSize(this.model.size, this.model.size);

        //Display
        this.setOpacity(0);
        this.setScale(.25, .25);
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

        //Eventing
        this.setEvents();
        this._initPhysics();
    }

    _getRingColor() {
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

    activateBlackhole() {
        this.isBlackholeActive = true;
    }

    activatePhysics() {
        this.isPhysicsActive = true;
    }

    pop() {
        let duration = 100;
        this.isBreathing = false;
        this.haltOpacity();
        this.haltScale();

        this.setOpacity(0, {
            duration: duration * 2
        });

        this.setScale(1.2, 1.2, 1.2, {
            duration: duration
        }, () => {
            this.setScale(0, 0, 0, {
                duration: duration
            }, () => {
                this.isPhysicsActive = false;
                this.recycle();
            });
        });
    }

    _initPhysics() {
        this.world             = Physics.getSimulation();
        this.isBlackholeActive = false;
        this.isBreathing       = true;
        this.isPhysicsActive   = false;

        this.scaling = {
            state: (Math.random() > 0.5) ? 0 : 1,
            val: 1,
            max: .1,
            rate: Math.random() * .005
        };

        var updater = {
            onUpdate: (t) => {
                this.world.update(t);
                this._update();

                Famous.requestUpdateOnNextTick(updater);
            }
        };

        Famous.requestUpdateOnNextTick(updater);

        this.sphere = new Sphere({
            mass: 10,
            radius: this.model.size * .5
        })
    }

    _update() {
        if(this.isPhysicsActive) {
            let physicsTransform = this.world.getTransform(this.sphere);
            var dx = physicsTransform.position[0] - 0;
            var dy = physicsTransform.position[1] - 500;

            let distanceFromCenter = Math.sqrt(dx * dx + dy * dy) - this.model.size / 2;
            let blackholeRadius = 30;

            if(this.isBlackholeActive && distanceFromCenter < blackholeRadius) {
                this.emit('spinRing', {});

                this.isPhysicsActive = false;
                this.sphere.setVelocity(0, 0, 0);
                this.setPosition(0, ENUMS.COIN_CENTER, 0, { duration: 250 }, () => {
                    this.setScale(0.1, 0.1, 0.1, { duration: 100 }, () => {
                        this.recycle();
                    });
                });
            } else if(physicsTransform.position[1] > window.innerHeight + 100) {
                this.recycle();
            } else {
                this.setPosition(physicsTransform.position[0], physicsTransform.position[1], physicsTransform.position[2]);

                if(this.isBreathing) {
                    //Breathing
                    if(this.scaling.state === 0) {
                        this.scaling.val += this.scaling.rate; //scale in
                    } else {
                        this.scaling.val -= this.scaling.rate; //scale out
                    }

                    if(this.scaling.val >= 1 + this.scaling.max) {
                        this.scaling.state = 1;
                    } else if(this.scaling.val <= 1 - this.scaling.max) {
                        this.scaling.state = 0;
                    }

                    this.haltScale();
                    this.setScale(this.scaling.val, this.scaling.val, this.scaling.val, { duration: 10});
                }
            }
        }
    }

    recycle() {
        let windowHalf = window.innerWidth / 2;
        let xPos = Math.random() * (windowHalf * 2) - windowHalf;
        let yPos = Math.random() * -700 - 200;
        this.sphere.setPosition(xPos, yPos, 0);
        this.scale.set(1, 1, 1, {duration : 10});
        this.setOpacity(1);
        this.sphere.setVelocity(0, 0, 0);
        this.isPhysicsActive = true;
        this.isBreathing = true;
        this.setDOMProperties({
            'border-color': '#000000'
        });
    }
}
