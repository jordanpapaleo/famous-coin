import {core, domRenderables, components, transitions} from 'famous';

const Famous          = core.Famous;
const Size            = components.Size;
const Transitionable  = transitions.Transitionable;
const Curves          = transitions.Curves;

export class Timeline {
    constructor(options = {}) {
        this.componentSet = [];
        this.timescale = options.timescale || 1;
        this.currentTime = new Transitionable(0);
        this.callbacks = [];
        //Famous.requestUpdateOnNextTick(this);
    }

    registerComponent(animationData) {
        this.componentSet.push(animationData);
    }

    registerCallback(time, direction, fn) {
        this.callbacks.push({
            time: time,
            direction: (direction || 1),  //what direction to trigger this callback.
            fn: fn
        });
    }

    /**
     * Adds an array of {@link KeyframeObjs} to a {@link Timeline} instance.
     * @method  addKeyframes
     * @param   {KeyframeObjs}  keyframeObjs  An array of {@link KeyframeObjs}.
     */
    /*eslint no-underscore-dangle:0*/
    addKeyframes(keyframeObjs) {
        let layers = {};

        for (let i = 0; i < keyframeObjs.length; i++) {
            let keyframes = keyframeObjs[i].keyframes;

            for(let j = 0; j < keyframes.length; j++) {
                let keyframe = keyframes[j];
                let nodeProperty = keyframe.shift();
                let id = nodeProperty._dispatch._renderProxy._id;
                keyframe.unshift(keyframeObjs[i].time);

                if (!layers[id]) {
                    layers[id] = {
                        component: nodeProperty,
                        path: []
                    };
                }

                layers[id].path.push(keyframe);
            }
        }

        Object.keys(layers).forEach((id) => this.registerComponent(layers[id]));
    }

    set(time, transition, callback) {
        this.direction = (time > this.currentTime.get()) ? 1 : -1;
        //comment out no longer updates and stuff for now, race condition in clock.
        if (transition) {
            this.inTransition = true;
            Famous.requestUpdate(this);

            this.currentTime.set(time, transition, () => {
                this.inTransition = false;
                Famous.requestUpdate(this);

                if (callback && callback instanceof Function) {
                    callback();
                }
            });
        } else {
            this.currentTime.set(time);
            this.inTransition = true;
            Famous.requestUpdate(this);
            this.inTransition = false;
        }
    }

    onUpdate(time) {
        let res = [];

        //TODO Why pass in time if we just overwrite it
        time = this.currentTime.get() * this.timescale;

        for(let i = 0; i<this.callbacks.length; i++) {
            if(this.direction > 0 && this.callbacks[i].direction > 0) {
                //forward
                if(time >= this.callbacks[i].time && this.callbacks[i].fn instanceof Function) {
                    this.callbacks[i].fn();
                    this.callbacks[i].direction = -1; //set to backwards
                }
            } else if(this.direction < 0 && this.callbacks[i].direction < 0){
                if(time <= this.callbacks[i].time && this.callbacks[i].fn instanceof Function) {
                    this.callbacks[i].fn();
                    this.callbacks[i].direction = 1; //set to forwards
                }
            }
        }

        for (let i = 0; i < this.componentSet.length; i++) {
            let animData = this.componentSet[i];

            for (let j = 0; j < animData.path.length; j++) {
                let currStep = animData.path[j];
                let nextStep = animData.path[j + 1];

                //currently mid path, calculate and apply.
                if (nextStep && currStep[0] <= time && nextStep[0] >= time) {
                    let percentDone = (time - currStep[0]) / (nextStep[0] - currStep[0]);
                    let state = currStep[2] ? currStep[2](percentDone) : Curves.linear(percentDone);

                    if (currStep[1] instanceof Array) {
                        for (let k = 0; k < currStep[1].length; k++) {
                            res[k] = currStep[1][k] + (nextStep[1][k] - currStep[1][k]) * state;
                        }

                        if (animData.component instanceof Size) {
                            animData.component.setAbsolute(...res);
                        } else {
                            animData.component.set(...res);
                        }
                    } else {
                        animData.component.set(currStep[1] + (nextStep[1] - currStep[1]) * state);
                    }
                }

                //we are passed last step, set object to final state.
                if (!nextStep && currStep[0] < time) {
                    if (currStep[1] instanceof Array) {
                        if (animData.component instanceof Size) {
                            animData.component.setAbsolute(...res);
                        } else {
                            animData.component.set(...currStep[1]);
                        }
                    } else {
                        animData.component.set(currStep[1]);
                    }
                }
            }
        }

        if (this.inTransition) {
            Famous.requestUpdateOnNextTick(this);
        }
    }
}

export class Keyframe {
    /**
     * @typedef KeyframeObjs
     * @type {Array.<Object>}
     * @property {Object.Number}           time      Time in milliseconds to place the keyframe.
     * @property {Object.Array.<Keyframe>} keyframes An array of {@link Keyframe} data.
     */

    /**
     * Creates an array of data for use with the {@link Timeline}.
     * @method  add
     *
     * @example
     * Returns: [nodeProperty, [value1, value2], easingFunction]
     * or
     * Returns: [nodeProperty, [value1, value2]]
     *
     * @param   {Object}      nodeProperty   The animatable property of a node.
     * @param   {Array<Int>}  values         The values to animate.
     * @param   {Function}    easingFunction Easing equation to use on the animation.
     * @return  {Keyframe}    A keyframe for use with the {@link Timeline}.
     */
    static add(nodeProperty, values, easingFunction) {
        let keyframe = [nodeProperty];
        keyframe.push(values);
        if (easingFunction) {
            keyframe.push(easingFunction);
        }
        return keyframe;
    }
}
