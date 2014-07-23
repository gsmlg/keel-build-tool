define(function(require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        View = require('./view');

    module.exports = Keel.ItemView = View.extend({
        constructor: function(options) {
            _.extend(this, _.pick(options || {}, ['serialize',
                'template'
            ]));
            return Keel.View.prototype.constructor.apply(this,
                arguments);
        },

        modelEvents: {
            'change': 'render'
        },

        getAttrs: function() {
            return {};
        },

        render: function() {
            var returnValue = Keel.View.prototype.render.apply(this,
                arguments);
            this.$el.attr(this.getAttrs());
            return returnValue;
        }

    });
});