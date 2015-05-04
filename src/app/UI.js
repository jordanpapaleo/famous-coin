const UI = {};

UI.layoutColumns = function(views) {
    let proportion = 1 / views.length;

    views.forEach(function(view, i) {
        view.size.setProportional(proportion, 1);
        view.align.set(proportion * i, 0);
        view.mountPoint.set(0, 0);
    });
};

UI.layoutRows = function(views) {
    let proportion = 1 / views.length;

    views.forEach(function(view, i) {
        view.size.setProportional(1, proportion);
        view.align.set(0, proportion * i);
        view.mountPoint.set(0, 0);
    });
};

UI.setStyle = function(view, properties) {
    for(var prop in properties) {
        if(this._prefixedRules.indexOf(prop) === -1) {
            view.el.setProperty(prop, properties[prop]);
        } else {
            this._crossBrowserStyle(view.el, prop, properties[prop]);
        }
    }
};

UI._prefixedRules = ['border-radius', 'box-shadow'];
UI._browserPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
UI._crossBrowserStyle = function(el, prop, value) {
    this._browserPrefixes.forEach(function(prefix) {
        el.setProperty(prefix + prop, value);
    });

    el.setProperty(prop, value);
};

export default UI;
