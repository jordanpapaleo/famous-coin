import View     from 'famous-creative/display/View';
import Physics  from './PhysicsService';

const Curves  = FamousPlatform.transitions.Curves;
const Famous  = FamousPlatform.core.Famous;

//Physics Components
const Sphere            = FamousPlatform.physics.Sphere;
const Spring            = FamousPlatform.physics.Spring;
const RotationalSpring  = FamousPlatform.physics.RotationalSpring;
const RotationalDrag    = FamousPlatform.physics.RotationalDrag;
const Vec3              = FamousPlatform.math.Vec3;

export class SpinningRing extends View {
    constructor(node, options) {
        super(node, options);

        this.model = {};

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

        this._initPhysics();
    }

    _initPhysics() {
        this.simulation = Physics.getSimulation();

        var updater = {
            onUpdate: (t) => {
                this.simulation.update(t);
                this._update();

                Famous.requestUpdateOnNextTick(updater);
            }
        };

        Famous.requestUpdateOnNextTick(updater);

        this.sphere = new Sphere({
            mass: 100,
            size: [this.model.sizeX, this.model.sizeY, 0]
        });

        this.anchor = new Vec3(0, this.model.posY, 0);

        this.rotationalSpring = new RotationalSpring(null, [this.sphere], {
            period: 1,
            dampingRatio: .9,
            anchor: this.anchor
        });

        this.simulation.add([this.sphere, this.rotationalSpring]);
    }

    _update() {
        let physicsTransform = this.simulation.getTransform(this.sphere);
        //this.setRotation()
    }

    spinCoin() {
        //Apply some physics force to a rotation
    }
}
