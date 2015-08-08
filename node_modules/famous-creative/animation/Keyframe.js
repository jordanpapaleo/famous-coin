export default class Keyframe {
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
