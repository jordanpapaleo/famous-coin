const Famous           = FamousPlatform.core.Famous;
const PhysicsEngine    = FamousPlatform.physics.PhysicsEngine;
const Collision        = FamousPlatform.physics.Collision;

let Physics = {
    _simulation: new PhysicsEngine()
};

Physics.getSimulation = function() {
    return this._simulation;
};

Physics.magnifyForce = function() {
    let width =  window.innerWidth;
    let height = window.innerHeight;
    let ratio = 1;

    if(width < 320) {
        ratio = 1.6;
    } else if(width < 428) {
        ratio = 1.5;
    } else if(width < 768) {
        ratio = 1.15;
    } else {
        ratio = 1;
    }

    return ratio * v;
};

Physics.dampenForce = function(v) {
    let width =  window.innerWidth;
    let height = window.innerHeight;
    let ratio = 1;

    if(width < 320) {
        ratio = .4;
    } else if(width < 428) {
        ratio = .5;
    } else if(width < 768) {
        ratio = .85;
    } else {
        ratio = 1;
    }

    return ratio * v;
};

export default Physics;
