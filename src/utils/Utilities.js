/*
 extends one object to another
 */

const Utilities = {};

Utilities.extend =  function(base, addon) {
    var result = {};

    for(var baseKey in base) {
        result[baseKey] = base[baseKey];
    }

    for(var addonKey in addon) {
        if(!result[addonKey]) {
            result[addonKey] = addon[addonKey];
        }
    }

    return result;
};

export default Utilities;
