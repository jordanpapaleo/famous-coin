const PhysicsEngine    = FamousPlatform.physics.PhysicsEngine;

let Physics = {
    _simulation: new PhysicsEngine()
};

Physics.getSimulation = function() {
    return this._simulation;
};

Physics.magnifyForce = function(v) {
    let width =  window.innerWidth;
    let ratio = 1;

    if(width < 320) {
        ratio = 1.6;
    } else if(width < 428) {
        ratio = 1.5;
    } else if(width < 768) {
        ratio = 1.15;
    }

    return ratio * v;
};

Physics.dampenForce = function(v) {
    let width =  window.innerWidth;
    let ratio = 1;

    if(width < 320) {
        ratio = .55;
    } else if(width < 428) {
        ratio = .6;
    } else if(width < 768) {
        ratio = .85;
    }

    return ratio * v;
};

export default Physics;
