const Famous           = FamousPlatform.core.Famous;
const PhysicsEngine    = FamousPlatform.physics.PhysicsEngine;
const Collision        = FamousPlatform.physics.Collision;

let Physics = {
    _simulation: new PhysicsEngine()
};

Physics.getSimulation = function() {
    return this._simulation;
};

/*
Physics.updateSimulation = function(t) {
    this._simulation.update(t);
};


Physics.addToSimulation = function() {
    this._simulation.add(arguments);
};

Physics.addCollision = function() {
    let collision = new Collision(arguments);
    this._simulation.add(collision);
};
*/

export default Physics;
