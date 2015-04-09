const Utilities = {};

Utilities.layoutColumns = function(views) {
    let proportion = 1 / views.length;

    views.forEach(function(view, i) {
        view.size.setProportional(proportion, 1);
        view.align.set(proportion * i, 0);
        view.mountPoint.set(0, 0);
    });
};

Utilities.layoutRows = function(views) {
    let proportion = 1 / views.length;

    views.forEach(function(view, i) {
        view.size.setProportional(1, proportion);
        view.align.set(0, proportion * i);
        view.mountPoint.set(0, 0);
    });
};

Utilities.setStyle = function(view, properties) {
    for(var prop in properties) {
        if(this._prefixedRules.indexOf(prop) === -1) {
            view.el.property(prop, properties[prop]);
        } else {
          this._crossBrowserStyle(view.el, prop, properties[prop]);
        }
    }
};

Utilities._prefixedRules = ['border-radius', 'backface-visibility'];
Utilities._browserPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
Utilities._crossBrowserStyle = function(el, prop, value) {
    this._browserPrefixes.forEach(function(prefix) {
        el.property(prefix + prop, value);
    });

    el.property(prop, value);
};

export default Utilities;
