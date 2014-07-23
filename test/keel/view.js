define(function(require, exports, module) {
    var _ = require('underscore'),
        Backbone = require('backbone'),
        Keel = require('./core'),
        template = require('./template'),
        Events = require('./events');

    module.exports = Keel.View = Backbone.View.extend({
        constructor: function() {
            var $super = Backbone.View.prototype.constructor;
            var response = $super.apply(this, arguments);
            this.bindModelEvents();
            return response;
        },

        bindUIElements: function() {
            if (_.isEmpty(this.ui)) {
                return this;
            }

            // store the ui hash in _uiBindings so they can be reset later
            // and so re-rendering the view will be able to find the bindings
            if (!this._uiBindings) {
                this._uiBindings = this.ui;
            }

            // get the bindings result, as a function or otherwise
            var bindings = _.result(this, '_uiBindings');

            // empty the ui so we don't have anything to start with
            this.ui = {};

            // bind each of the selectors
            _.each(_.keys(bindings), function(key) {
                var selector = bindings[key];
                if (selector) {
                    this.ui[key] = this.$(selector);
                } else {
                    this.ui[key] = this.$el;
                }
            }, this);
            return this;
        },

        // This method unbinds the elements specified in the `ui` hash
        unbindUIElements: function() {
            if (!this.ui || !this._uiBindings) {
                return this;
            }

            // delete all of the existing ui bindings
            _.each(this.ui, function($el, name) {
                delete this.ui[name];
            }, this);

            // reset the ui element to the original bindings configuration
            this.ui = this._uiBindings;
            delete this._uiBindings;
            return this;
        },

        resetUI: function() {
            this.unbindUIElements();
            this.bindUIElements();
            return this;
        },

        modelEvents: {},

        collectionEvents: {},

        bindModelEvents: function() {
            if (this.model && !_.isEmpty(this.modelEvents)) {
                _.each(this.modelEvents, function(method, modelEvent) {
                    method = _.isString(method) ? this[method] :
                        method;
                    this.stopListening(this.model, modelEvent,
                        method);
                    this.listenTo(this.model, modelEvent, method);
                }, this);
            }
            if (this.collection && !_.isEmpty(this.collectionEvents)) {
                _.each(this.collectionEvents,
                    function(method, collectionEvent) {
                        method = _.isString(method) ? this[method] :
                            method;
                        this.stopListening(this.collection,
                            collectionEvent, method);
                        this.listenTo(this.collection, collectionEvent,
                            method);
                    }, this);
            }
            return this;
        },

        template: function(data) {
            var html = this.templateID ? Keel.$(this.templateID)
                .html() :
                '';
            return template(html, data);
        },

        serialize: function() {
            var data = {};
            if (this.model) {
                data = this.model.toJSON();
            }
            if (this.collection) {
                data = _.extend(data, {
                    collection: this.collection.toJSON
                });
            }
            return data;
        },

        render: function() {
            this.$el.html(this.template(this.serialize()));
            this.resetUI();
            return this;
        }

    });

    _.extend(Keel.View.prototype, Events);

});