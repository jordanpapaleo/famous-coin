/**
 * Helper function to turn val into an Object.
 * @method  ToObject
 * @param   {Object}  val
 */
function toObject(val) {
  if (val === null) {
    throw new TypeError('Object.assign cannot be called with null or undefined');
  }
  return Object(val);
}

/**
 * Object.assign() polyfill is used to copy the values ofa ll enumerable own properties
 * from one or more source objects to a target object. It will return the target object.
 *
 * @method  assign
 * @param   {Object}  target  The target object.
 * @param   {Object}  source  The source object(s).
 * @return  {Object}  The target object gets returned.
 */
let assign = Object.assign || function assign(target, ...source) {
 let to = toObject(target);
 source.forEach((from) => {
   Object.keys(Object(from)).forEach((key) => {
     to[key] = from[key];
   });
 });
 return to;
};

export default assign;
