import Physics          from './PhysicsService';
import View             from 'famous-creative/display/View';

//Famous Components
const Famous            = FamousPlatform.core.Famous;

//Physics Components
const RotationalDrag    = FamousPlatform.physics.RotationalDrag;
const Sphere            = FamousPlatform.physics.Sphere;

export class SpinningRing extends View {
    constructor(node, options) {
        super(node, options);

        this.model = options || {};

        //Position
        this.setAlign(.5, 0);
        this.setMountPoint(.5, .5, .5);
        this.setOrigin(.5, .5, .5);
        this.setPositionY(window.innerHeight * 1.1);

        //Sizing
        if(this.model.i === 0) {            //Outer ring
            this.model.sizeX = 90;
            this.model.sizeY = 90;
        } else if(this.model.i === 1) {     //Inner ring
            this.model.sizeX = 78;
            this.model.sizeY = 78;
        }

        this.setSizeModeAbsolute();
        this.setAbsoluteSize(this.model.sizeX, this.model.sizeY);

        //Display
        this.setOpacity(0);
        this.createDOMElement({
            tagName: 'img',
            attributes: {
                'src': this.model.svgPath
            },
            classes: ['spinning-ring']
        });

        //Eventing
        this.setEvents();
        this._initPhysics();
    }

    setEvents() {
        this.on('spinRing', () => {
            let opacity = this.getOpacity();
            if(opacity !== 1) {
                this.setOpacity(1, {
                    duration: 200
                });
            }

            this.spinRing();
        });
    }

    spinRing() {
        //TODO Allow rotational args to be passed
        if(this.model.i === 0) {
            this.sphere.setAngularVelocity(5, 15, 10);
        } else if(this.model.i === 1) {
            this.sphere.setAngularVelocity(25, 10, 15);
        }
    }

    _initPhysics() {
        this.world = Physics.getSimulation();

        var updater = {
            onUpdate: (t) => {
                this.world.update(t);
                this._update();

                Famous.requestUpdateOnNextTick(updater);
            }
        };

        Famous.requestUpdateOnNextTick(updater);

        this.sphere = new Sphere({
            mass: 100,
            radius: this.model.sizeX * .5
        });

        //A behavior that slows angular velocity by applying torque.
        this.rotationalDrag = new RotationalDrag([this.sphere], {
            max: 50000,
            strength: 500000
        });

        this.world.add([this.sphere, this.rotationalDrag]);
    }

    _update() {
        let v = this.sphere.getAngularVelocity();
        let q = this.sphere.getOrientation(); //Returns a quaternion

        if(v.x < 1 && v.y < 1 && v.z < 1) {
            this.setRotation(0, 0, 0, {
                duration: 2000
            });
        } else {
            let rotation = {};
            q.toEuler(rotation);
            this.setRotation(rotation.x, rotation.y, rotation.z);
        }
    }
}
