define(function(require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        Backbone = Keel.Backbone;

    module.exports = Keel.Router = Backbone.Router.extend({
        constructor: function(options) {
            _.extend(this, _.pick(options || {}, ['app', 'layout']));
            return Backbone.Router.apply(this, arguments);
        }
    });

});