define(function(require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        Backbone = Keel.Backbone,
        Model = require('./model'),
        sync = require('./sync'),
        Events = require('./events');

    module.exports = Keel.Collection = Backbone.Collection.extend({
        model: Model,

        sync: function() {
            return sync.apply(this, arguments);
        },

        option: function(action, options) {
            options = options || {};
            var suc = options.suc,
                err = options.error,
                collection = this;
            options.success = function(resp) {
                if (suc) {
                    suc(collection, resp, options);
                }
                collection.trigger('sync', collection, resp, options);
            };
            options.error = function(resp) {
                if (err) {
                    err(collection, resp, options);
                }
                collection.trigger('error', collection, resp, options);
            };
            return this.sync('option',
                this,
                _.extend(options, {
                    action: action
                }));
        },

        constructor: function(models, options) {
            options = options || {};
            this.singleSelect = !!options.singleSelect;
            this._selectedModels = this.singleSelect ? null : [];
            Backbone.Collection.prototype.constructor.apply(this,
                arguments);
            this.on('remove', this.deselectModel, this);
        },

        singleSelect: false,

        selectModel: function(model) {
            if (this.singleSelect) {
                if (this._selectedModels === model) {
                    return;
                }
                this.deselectModel();
                this._selectedModels = model;
                model.trigger('select', model, this, this._selectedModels);
            } else {
                if (this.indexOf(model) !== -1 &&
                    _.indexOf(this._selectedModels, model) === -1) {
                    this._selectedModels.push(model);
                    model.trigger('select', model, this, this._selectedModels);
                }
            }
        },

        deselectModel: function(model) {
            if (this.singleSelect) {
                if (this._selectedModels) {
                    model = this._selectedModels;
                    model.trigger('deselect',
                        model, this, this._selectedModels);
                    this._selectedModels = null;
                }
            } else {
                var index = _.indexOf(this._selectedModels, model);
                if (index !== -1) {
                    this._selectedModels.splice(index, 1);
                    model.trigger('deselect',
                        model, this, this._selectedModels);
                }
            }
        },

        setSelectModels: function(models) {
            if (this.singleSelect) {
                throw new Error(
                    'single select mode not support this method');
            } else {
                models = _.intersection(this.models, models);
                var deSelectModels = _.difference(this._selectedModels,
                    models);
                var newSelectModels = _.difference(models,
                    this._selectedModels);
                this._selectedModels = models;
                _.each(deSelectModels, function(model) {
                    model.trigger('deselect', model, this, models);
                }, this);
                _.each(newSelectModels, function(model) {
                    model.trigger('select', model, this, models);
                }, this);
            }
        },

        getSelectedModels: function() {
            if (this.singleSelect) {
                return this._selectedModels;
            }
            return _.clone(this._selectedModels);
        },

        _batchOperation: function(models, action) {
            var dfd = new Keel.$.Deferred(),
                len = models.length,
                errors = [],
                done = 0;

            function callback(resp, model) {
                done++;
                dfd.notify(resp, model);
                if (resp !== undefined) {
                    errors.push({
                        model: model,
                        response: resp
                    });
                }
                if (done === len) {
                    if (errors.length > 0) {
                        dfd.reject(errors);
                    } else {
                        dfd.resolve();
                    }
                }
            }

            _.each(models, function(model) {
                action.call(null, model)
                    .done(function() {
                        callback(void(0), model);
                    })
                    .fail(function(resp) {
                        callback(resp, model);
                    });
            });

            return dfd.promise();
        },

        updateModels: function(models, attrs, options) {
            options = options || {};
            _.defaults(options, {
                wait: true
            });
            return this._batchOperation(models, function(model) {
                return model.save(attrs, options);
            });
        },

        destroyModels: function(models, options) {
            options = options || {};
            _.defaults(options, {
                wait: true
            });
            return this._batchOperation(models, function(model) {
                return model.destroy(options);
            });
        }

    });

    _.extend(Keel.Collection.prototype, Events);
});