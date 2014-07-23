define(function(require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        Backbone = Keel.Backbone,
        sync = require('./sync'),
        Events = require('./events');

    module.exports = Keel.Model = Backbone.Model.extend({
        sync: function() {
            return sync.apply(this, arguments);
        },

        option: function(action, options) {
            options = options || {};
            var suc = options.suc,
                err = options.error,
                model = this;
            options.success = function(resp) {
                if (suc) {
                    suc(model, resp, options);
                }
                model.trigger('sync', model, resp, options);
            };
            options.error = function(resp) {
                if (err) {
                    err(model, resp, options);
                }
                model.trigger('error', model, resp, options);
            };
            return this.sync('option', this,
                _.extend(options, {
                    action: action
                }));
        },

        description: function() {
            return this.id;
        },

        select: function() {
            if (this.collection) {
                this.collection.selectModel(this);
            }
        },

        deselect: function() {
            if (this.collection) {
                this.collection.deselectModel(this);
            }
        },

        isSelected: function() {
            if (this.collection) {
                return _.contains(this.collection.getSelectedModels(),
                    this);
            } else {
                return false;
            }
        }

    });

    _.extend(Keel.Model.prototype, Events);
});