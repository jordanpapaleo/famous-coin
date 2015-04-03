const Utilities =  {
    extend: function (base, addon) { // extends one object to another
        var result = {};
        for(var key in base) {
            result[key] = base[key];
        }
        for(var key in addon) {
            if(!result[key]) {
                result[key] = addon[key];
            }
        }
        return result;
    },
    layoutColumns: function (views) {
        let proportion = 1 / views.length;

        views.forEach(function(view, i) {
            view.size.setProportional(proportion, 1);
            view.align.set(proportion * i, 0);
            view.mountPoint.set(0, 0);
        });
    },
    setStyle: function (view, properties) {
        for(var prop in properties) {
            view.el.property(prop, properties[prop]);
        }
    }
};

export default Utilities;
