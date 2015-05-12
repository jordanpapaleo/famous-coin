import View     from 'famous-creative/display/View';
import Physics  from './PhysicsService';

const Curves  = FamousPlatform.transitions.Curves;
const Famous  = FamousPlatform.core.Famous;
const Quaternion = FamousPlatform.math.Quaternion;

//Physics Components
const Sphere            = FamousPlatform.physics.Sphere;
const Spring            = FamousPlatform.physics.Spring;
const Box               = FamousPlatform.physics.Box;
const RotationalSpring  = FamousPlatform.physics.RotationalSpring;
const RotationalDrag    = FamousPlatform.physics.RotationalDrag;
const Vec3              = FamousPlatform.math.Vec3;

export class SpinningRing extends View {
    constructor(node, options) {
        super(node, options);

        this.model = {};
        this.model.i = options.i;

        this.createDOMElement({
            tagName: 'img',
            attributes: {
                'src': options.svgPath
            }
        });

        if(options.i === 0) {
            //Outer ring
            this.model.sizeX = 90;
            this.model.sizeY = 90;
            this.model.posY  = window.innerHeight * 1.1;
        } else if(options.i === 1) {
            //Inner ring
            this.model.sizeX = 78;
            this.model.sizeY = 78;
            this.model.posY  = window.innerHeight * 1.1;
        }

        this.setSizeMode(1, 1);
        this.setAbsoluteSize(this.model.sizeX, this.model.sizeY);

        this.setPositionY(this.model.posY);

        this.setMountPoint(.5, 0);
        this.setAlign(.5, 0);
        this.setOrigin(.5, .5);
        this.isActiveRotation = false;
        this._initPhysics();
        this.setEvents();
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
            size: [this.model.sizeX, this.model.sizeY, 0]
        });

        window.sphere = this.sphere;

        //A behavior that slows angular velocity by applying torque.
        this.rotationalDrag = new RotationalDrag([this.sphere], {
            max: 50,
            strength: 50
        });

        this.world.add([this.sphere, this.rotationalDrag]);
    }

    _update() {
        let velocity = this.sphere.getAngularVelocity();

        if(velocity.x < 1 && velocity.y < 1 && velocity.z < 1) {
            this.setRotation(0, 0, 0, {
                duration: 2000
            });
            this.isRotationActive = false;
        }

        if(this.isRotationActive) {
            let physicsTransform = this.world.getTransform(this.sphere);
            let quaternion = new Quaternion(physicsTransform.rotation[3], physicsTransform.rotation[0], physicsTransform.rotation[1], physicsTransform.rotation[2]);
            let rotation = {};
            quaternion.toEuler(rotation);
            this.setRotation(rotation.x, rotation.y, rotation.z);
        }
    }

    setEvents() {
        this.on('spinRing', () => {
            this.isRotationActive = true;
            if(this.model.i === 0) {
                this.sphere.setAngularVelocity(5, 15, 10);
            } else if(this.model.i === 1) {
                this.sphere.setAngularVelocity(25, 10, 15);
            }
        });
    }
}
