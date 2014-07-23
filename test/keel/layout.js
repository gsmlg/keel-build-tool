define(function(require, exports, module) {
    var Keel = require('./core'),
        _ = Keel._,
        View = require('./view');

    module.exports = Keel.Layout = View.extend({
        constructor: function(options) {
            this._isRender = false;
            this.cid = _.uniqueId('view');
            options = options || {};
            var viewOptions = [
                'model', 'collection', 'el',
                'id', 'attributes', 'className',
                'tagName', 'events'
            ];
            _.extend(this, _.pick(options, viewOptions));
            this._ensureElement();
            this.delegateEvents();
            this.__regions__ = {};
            this.initialize.apply(this, arguments);
        },

        _addViewToRegion: function(selector, view) {
            if (this.__regions__[selector] !== view) {
                this.removeView(selector);
            }
            this.__regions__[selector] = view;
            return this;
        },

        _insertToDom: function(selector, view, noRender) {
            var el = this.$(selector);
            if (el.length) {
                el.html(view.el);
                view.delegateEvents();
                if (!noRender) {
                    view.render();
                }
            } else {
                delete this.__regions__[selector];
                throw new Error(
                    'The selector did not match any element');
            }
        },

        getView: function(name) {
            return this.__regions__[name];
        },
        addView: function(selector, view, noRender) {
            this._addViewToRegion(selector, view);
            if (this._isRender) {
                this._insertToDom(selector, view, noRender);
            }
            return this;
        },

        removeView: function(selector) {
            var view = this.__regions__[selector];
            if (view) {
                delete this.__regions__[selector];
                view.remove();
            }
            return this;
        },

        eachView: function(callback, context) {
            context = context || this;
            _.each(this.__regions__, function(view, selector) {
                callback.call(context, view, selector, this);
            }, this);
            return this;
        },

        render: function() {
            Keel.View.prototype.render.apply(this, arguments);
            this._isRender = true;
            this.eachView(function(view, selector) {
                this._insertToDom(selector, view);
            });
            return this;
        },

        remove: function() {
            this._isRender = false;
            this.eachView(function(view) {
                view.remove();
            });
            this.stopListening();
            this.undelegateEvents();
        }
    });
});