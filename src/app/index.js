import {core, domRenderables, components} from 'famous';
import {View} from '../shared/View';
import Utils from '../utils/Utilities'
import {Frame} from './Frame';

const Camera = components.Camera;

class App extends View {
    setProperties() {
        this.mountPoint.set(0, 0);
        this.align.set(0, 0);
        this.size.setProportional(1, 1);

        this.camera = new Camera(this.dispatch);
        this.camera.set(Camera.PINHOLE_PROJECTION, 10000, 0, 0);
    }

    render() {
        this.frame = new Frame({
            node: this.node.addChild(),
            model: ''
        });
    }
}

const root = new core.Context('body');
const app = new App({
    node: root.addChild(),
    model: ''
});
